'use strict';

angular.module('buddyClientApp')
    .controller('UserDashboardCtrl', function ($scope, CurrentUser, Entry, ServiceUser, Auth) {
        $scope.user = CurrentUser.user();
        $scope.auth = Auth;
    }
);
