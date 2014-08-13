'use strict';

angular.module('buddyClientApp')
    .controller('MainCtrl', function ($scope, $state, Auth) {
        $scope.login = function() {
            if ($scope.loginForm.$valid) {
                $scope.errors = [];
                Auth.login({user_session: $scope.user}).success(function() {
                    $state.go('user.dashboard');
                }).error(function(err) {
                    $scope.errors.push(err);
                });
            }
        };
    });
