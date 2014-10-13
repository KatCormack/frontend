'use strict';

angular.module('buddyClientApp')
    .controller('UserDashboardCtrl', function ($scope, CurrentUser, Entry, ServiceUser, Auth, $state, Clinician) {
        $scope.user = CurrentUser.user();
        $scope.auth = Auth;
        $scope.search = function() {
            $state.go('clinician.search', {search: $scope.search_term});
        };
        $scope.clinicians = Clinician.query();
    });
