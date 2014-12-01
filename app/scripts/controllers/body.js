'use strict';

angular.module('buddyClientApp')
    .controller('BodyCtrl', function($scope, $state, CurrentUser) {
        $scope.state = $state;
        if (CurrentUser.user()) {
            $scope.intercomUser = CurrentUser.intercomUser();
        }

    });
