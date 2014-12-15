'use strict';

angular.module('buddyClientApp')
    .controller('BodyCtrl', function($scope, $state, CurrentUser, Auth) {
        $scope.state = $state;
        $scope.auth = Auth;
        if (CurrentUser.user()) {
            $scope.intercomUser = CurrentUser.intercomUser();
        }

    });
