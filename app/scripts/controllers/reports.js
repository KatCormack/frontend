'use strict';

angular.module('buddyClientApp')
    .controller('ReportsCtrl', function($scope, LocalService) {
        $scope.getAuthToken = function() {
            return 'Bearer ' + angular.fromJson(LocalService.get('auth_token')).token;
        };

    });
