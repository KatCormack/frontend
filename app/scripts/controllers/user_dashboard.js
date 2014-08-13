'use strict';

angular.module('buddyClientApp')
    .controller('UserDashboardCtrl', function ($scope, CurrentUser, Entry, ServiceUser) {
        $scope.user = CurrentUser.user();
        if ($scope.user.type === 'ServiceUser') {
            $scope.entries = Entry.query();
        } else {
            $scope.serviceUsers = ServiceUser.query();
        }
    }
);
