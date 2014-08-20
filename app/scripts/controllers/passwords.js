'use strict';

angular.module('buddyClientApp')
    .controller('EmailPasswordResetCtrl', function($scope, Clinician, ServiceUser, $state) {
        $scope.user = ServiceUser.get({id: $state.params.userId, token: $state.params.token}, function() {
            /* success */
        }, function() {
            /* failed - this person is maybe a clinician */
            $scope.user = Clinician.get({id: $state.params.userId, token: $state.params.token}, function() {
                /* success */
            }, function() {

            });

        });
    }
);
