'use strict';

angular.module('buddyClientApp')
    .controller('NavigationController', function ($scope, $state, Auth) {
        $scope.auth = Auth;
        $scope.logout = function() {
            Auth.logout();
            $state.go('anon.home');
        };
    }
);
