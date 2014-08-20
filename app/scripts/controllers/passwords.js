'use strict';

angular.module('buddyClientApp')
    .controller('EmailPasswordResetCtrl', function($scope, Clinician, ServiceUser, $state, Auth) {
        $scope.user = ServiceUser.get({id: $state.params.userId, token: $state.params.token}, function() {
            /* success */
        }, function() {
            /* failed - this person is maybe a clinician */
            $scope.user = Clinician.get({id: $state.params.userId, token: $state.params.token}, function() {
                /* success */
            }, function() {
                /* no idea who this user is */
            });

        });

        $scope.resetPassword = function() {
            var user = $scope.user;
            user.first_name = user.full_name.substr(0, user.full_name.indexOf(' '));
            user.last_name = user.full_name.substr(user.full_name.indexOf(' ')+1);
            var factory = user.type === 'Clinician' ? Clinician : ServiceUser;
            factory.update({id: $state.params.userId, token: $state.params.token, user: user}, function() {
                Auth.login({user_session: $scope.user}).success(function() {
                    $state.go('user.dashboard');
                });
            });
        };

    }
);
