'use strict';

describe('Controller: CliniciansCtrl', function () {

    // load the controller's module
    beforeEach(module('buddyClientApp'));

    var CliniciansCtrl,
    $q,
    queryDeferred,
    scope,
    Clinician,
    Team,
    Page,
    modal,
    mockService,
    mockModal;

    beforeEach(inject(function(_$q_, _$rootScope_) {
        $q = _$q_;
    }));

    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        modal = {};
        modal.open = function() { }

        mockService = {
            query: function() {
                queryDeferred = $q.defer();
                return { $promise: queryDeferred.promise };
            }
        }

        mockModal = {
            result: {
                then: function(confirmCallback, cancelCallback) {
                    //Store the callbacks for later when the user clicks on the OK or Cancel button of the dialog
                    this.confirmCallBack = confirmCallback;
                    this.cancelCallback = cancelCallback;
                }
            },
            close: function(item) {
                //The user clicked OK on the modal dialog, call the stored confirm callback with the selected item
                this.result.confirmCallBack(item);
            },
            dismiss: function(type) {
                //The user clicked cancel on the modal dialog, call the stored cancel callback
                this.result.cancelCallback(type);
            }
        };

        Page = {};
        Page.setTitle = function() { };

        spyOn(mockService, 'query').andCallThrough();
        spyOn(modal, 'open').andReturn(mockModal);

        CliniciansCtrl = $controller('CliniciansCtrl', {
            $scope: scope,
            Clinician: Clinician = mockService,
            Team: Team = mockService,
            Page: Page,
            $modal: modal
        });

    }));

    it('should query the teams service', function() {
        expect(Team.query).toHaveBeenCalled();
    });

    it('should query the clinicians service', function() {
        expect(Clinician.query).toHaveBeenCalled();
    });

    it('should open the modal when addClinician is called', function() {
        scope.addClinician();
        expect(modal.open).toHaveBeenCalled();
    });


});
