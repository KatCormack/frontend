'use strict';

angular.module('buddyClientApp')
    .controller('NavigationController', function ($scope, $state, Auth) {
        $scope.auth = Auth;
        $scope.state = $state;
        $scope.logout = function() {
            Auth.logout();
            $state.go('anon.home');
        };
        $scope.$watch('state.current', function () {
          $scope.isHome = $state.current.name === 'anon.home';
          $scope.isUndergoingTherapy = $state.current.name === 'anon.undergoingTherapy';
        });
    }
);
