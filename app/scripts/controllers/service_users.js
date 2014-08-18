'use strict';

angular.module('buddyClientApp')
    .controller('ServiceUsersCtrl', function ($scope, ServiceUser) {
        $scope.serviceUsers = ServiceUser.query();
    });
