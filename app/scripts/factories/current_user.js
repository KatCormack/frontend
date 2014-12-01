'use strict';

angular.module('buddyClientApp').
    factory('CurrentUser', function(LocalService) {
        return {
            user: function() {
                if (LocalService.get('auth_token')) {
                    return angular.fromJson(LocalService.get('auth_token')).user;
                } else {
                    return {};
                }
            },
            intercomUser: function() {
                if (LocalService.get('auth_token')) {
                    return angular.fromJson(LocalService.get('auth_token')).intercom_user;
                } else {
                    return {};
                }
            }
        };
    });
