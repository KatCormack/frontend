'use strict';

describe('Controller: LoginCtrl', function () {

    // load the controller's module
    beforeEach(module('buddyClientApp'));

    var LoginCtrl,
    scope,
    Auth,
    state,
    auth_obj;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        Auth = {};
        state = {}
        state.go = function(arg) {
            this.transitionTo = arg;
        }
        LoginCtrl = $controller('LoginCtrl', {
            $scope: scope,
            Auth: Auth,
            $state: state,
        });
    }));


    it('should let you login if the credentials are right', function () {
        auth_obj = {
            success: function(invokingFunc) {
                if (invokingFunc) {
                    invokingFunc.call();
                }
                return this;
            },
            error: function(invokingFunc) {
                return this;
            }
        }
        Auth.login = function() { return auth_obj }
        scope.loginForm = {}
        scope.loginForm.$valid = true;
        scope.login();
        expect(state.transitionTo).toBe('user.dashboard')
        expect(scope.login_error).not.toBe(true)
    });

    it('should error if the credentials are wrong', function () {
        auth_obj = {
            success: function(invokingFunc) {
                return this;
            },
            error: function(invokingFunc) {
                if (invokingFunc) {
                    invokingFunc.call();
                }
                return this;
            }
        }
        Auth.login = function() { return auth_obj }
        scope.loginForm = {}
        scope.loginForm.$valid = true;
        scope.login();
        expect(state.transitionTo).not.toBe('user.dashboard')
        expect(scope.login_error).toBe(true)
    });

});
