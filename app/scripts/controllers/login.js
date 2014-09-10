'use strict';

angular.module('buddyClientApp')
    .controller('LoginCtrl', function ($scope, $state, Auth) {
        $scope.login = function() {
            Auth.login({user_session: $scope.user}).success(function() {
                $state.go('user.dashboard');
            }).error(function() {
                $scope.login_error = true;
            });
        };
    });
