'use strict';

angular.module('buddyClientApp')
    .controller('LoginCtrl', function ($scope, $state, Auth) {
        $scope.login = function() {
            Auth.login({user_session: $scope.user}).success(function(res) {
                console.log(res);
                if (res.user.type === 'ServiceUser') {
                    $state.go('serviceUser.diary');
                } else {
                    $state.go('user.dashboard');
                }

            }).error(function(res) {
                console.log(res);
                $scope.login_error = true;
            });
        };
    });
