'use strict';

describe('Controller: EmailPasswordResetCtrl', function () {
    beforeEach(module('buddyClientApp'));

    var EmailPasswordResetCtrl,
    $httpBackend,
    APIHost,
    scope,
    state,
    Auth,
    Password,
    mockClinician;

    beforeEach(inject(function ($controller, $rootScope, _$httpBackend_, _APIHost_) {
        scope = $rootScope.$new();
        state = {}
        state.params = {}
        state.go = function(arg) {
            this.transitionTo = arg;
        }
        $httpBackend = _$httpBackend_;
        APIHost = _APIHost_;
        mockClinician = {type: 'Clinician', id: 4, full_name: 'Test User'};
    }));

    describe("when finding a clinician from the credentials", function() {
        beforeEach(angular.mock.inject(function($httpBackend) {
            $httpBackend.when('GET', APIHost + "/api/v1/service_users/4.json?token=1234").respond(404, '');
            $httpBackend.when('GET', APIHost + "/api/v1/clinicians/4.json?token=1234").respond(200, mockClinician);
        }));

        beforeEach(inject(function($controller, $rootScope) {
            state.params.userId = '4';
            state.params.token = '1234'

            EmailPasswordResetCtrl = $controller('EmailPasswordResetCtrl', {
                $scope: scope,
                $state: state
            });
        }));

        it("should return clinician object and store in scope.user", function() {
            $httpBackend.flush();
            expect(scope.user.type).toBe('Clinician');
        });

        describe("when filling in details with an error on the password", function() {
            beforeEach(angular.mock.inject(function($httpBackend) {
                $httpBackend.when('PUT', APIHost + "/api/v1/clinicians/4.json").respond(417, {password: "has a problem"})
            }));

            it("should show an error for the password when the API server returns an error", function() {
                $httpBackend.flush();
                scope.resetPassword();
                $httpBackend.flush();
                expect(scope.user.password_error).toBe(true);
            });

        })

        describe("when filling in details with an error on the password confirmation", function() {
            beforeEach(angular.mock.inject(function($httpBackend) {
                $httpBackend.when('PUT', APIHost + "/api/v1/clinicians/4.json").respond(417, {password_confirmation: "has a problem"})
            }));

            it("should show an error for the password when the API server returns an error", function() {
                $httpBackend.flush();
                scope.resetPassword();
                $httpBackend.flush();
                expect(scope.user.password_confirmation_error).toBe(true);
            });

        });

        describe("when filling in details correctly", function() {
            beforeEach(angular.mock.inject(function($httpBackend) {
                $httpBackend.when('PUT', APIHost + "/api/v1/clinicians/4.json").respond(200, mockClinician);
                $httpBackend.when('POST', APIHost + "/api/v1/auth/login").respond(200, {});
            }));

            it("should show an error for the password when the API server returns an error", function() {
                $httpBackend.flush();
                scope.resetPassword();
                $httpBackend.flush();
                expect(state.transitionTo).toBe('user.dashboard');
                expect(scope.user.password_error).toBe(false);
                expect(scope.user.password_confirmation_error).toBe(false);
            });

        });


    });
});


describe('Controller: PasswordForgotCtrl', function () {
    beforeEach(module('buddyClientApp'));

    var PasswordForgotCtrl,
    APIHost,
    scope,
    state,
    $httpBackend;

    beforeEach(inject(function ($controller, $rootScope, _$httpBackend_, _APIHost_) {
        scope = $rootScope.$new();
        state = {}
        state.params = {}
        state.go = function(arg) {
            this.transitionTo = arg;
        }
        $httpBackend = _$httpBackend_;
        APIHost = _APIHost_;
    }));

    describe("when requesting a new password", function() {
        beforeEach(angular.mock.inject(function($httpBackend) {
            $httpBackend.when('POST', APIHost + "/api/v1/passwords.json").respond(200, '');
        }));

        beforeEach(inject(function($controller, $rootScope) {
            PasswordForgotCtrl = $controller('PasswordForgotCtrl', {
                $scope: scope,
                $state: state
            });
        }));


        it('should send you to the password sent page', function() {
            scope.password = {email_or_mobile: "foo@bar.com"}
            scope.forgotPassword();
            $httpBackend.flush();
            expect(state.transitionTo).toBe('anon.passwordSent');
        })
    });



});
