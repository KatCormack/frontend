'use strict';

angular.module('buddyClientApp')
    .directive("intercom", function(Intercom) {
        return {
            link: function(scope, element, attrs) {
                scope.$watch('intercomUser', function(user) {
                    if (user) {
                        Intercom.boot(user);
                    }
                });
            }
        };
    });
