'use strict';

describe('Controller: AddServiceUserCtrl', function() {
    beforeEach(module('buddyClientApp'));

    var AddServiceUserCtrl,
    $httpBackend,
    APIHost,
    scope,
    mockTeams;

    beforeEach(inject(function($rootScope, _$httpBackend_, _APIHost_) {
        scope = $rootScope.$new();
        $httpBackend = _$httpBackend_;
        APIHost = _APIHost_;
        mockTeams = [
            {name: 'Herp'},
            {name: 'Derp'}
        ];
    }));

    describe('when teams are present', function() {
        beforeEach(angular.mock.inject(function($httpBackend) {
            $httpBackend.when('GET', APIHost + '/api/v1/accounts.json').respond(200, mockTeams);
        }));

        beforeEach(inject(function($controller) {
            AddServiceUserCtrl = $controller('AddServiceUserCtrl', {
                $scope: scope
            });
        }))

        it('should fetch the teams and assign them to scope.team', function() {
            $httpBackend.flush();
            expect(scope.teams.length).toBe(2);
        });

    })

})
