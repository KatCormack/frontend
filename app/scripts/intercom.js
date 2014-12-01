'use strict';

angular.module('buddyClientApp')
    .directive("intercom", function(Intercom) {
        return {
            link: function(scope, element, attrs) {
                scope.$watch('intercomUser', function(user) {
                    if (user) {
                        if (user.user_id) {
                            Intercom.boot(user);
                        }

                    }
                });
            }
        };
    });
