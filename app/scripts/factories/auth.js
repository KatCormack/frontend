'use strict';

angular.module('buddyClientApp').
    factory('Auth', function($http, LocalService, AccessLevels, APIHost, CurrentUser, $state) {
        return {
            authorize: function(access) {
                if (access === AccessLevels.user) {
                    return this.isAuthenticated();
                }
                else if (access === AccessLevels.clinician) {
                    return this.isClinician();
                }
                else if (access === AccessLevels.service_user) {
                    return this.isServiceUser();
                }
                else if (access === AccessLevels.clinicianAdmin) {
                    return this.isClinicianAdmin();
                } else {
                    return true;
                }
            },
            isAuthenticated: function() {
                return LocalService.get('auth_token');
            },
            isClinician: function() {
                return this.isAuthenticated() && CurrentUser.user().type === 'Clinician';
            },
            isClinicianAdmin: function() {
                return this.isClinician() && CurrentUser.user().can_administer_account;
            },
            isServiceUser: function() {
                return this.isAuthenticated() && CurrentUser.user().type === 'ServiceUser';
            },
            login: function(credentials) {
                console.log(credentials);
                var login = $http.post(APIHost + '/api/v1/auth/login', credentials);
                login.success(function(result) {
                    LocalService.set('auth_token', JSON.stringify(result));
                });
                return login;
            },
            logout: function() {
                // The backend doesn't care about logouts, delete the token and you're good to go.
                $state.go('anon.home');
                LocalService.unset('auth_token');
            },
            register: function(formData) {
                LocalService.unset('auth_token');
                var register = $http.post(APIHost + '/api/v1/auth/register', formData);
                register.success(function(result) {
                    LocalService.set('auth_token', JSON.stringify(result));
                });
                return register;
            }
        };
    });
