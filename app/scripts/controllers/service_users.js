'use strict';

angular.module('buddyClientApp')
    .controller('AddServiceUserCtrl', function($scope, ServiceUser) {

    })
    .controller('ServiceUsersCtrl', function ($scope, ServiceUser, $modal) {
        $scope.serviceUsers = ServiceUser.query();
        $scope.addServiceUser = function() {
            $modal.open({
                templateUrl: 'views/service_users/new.html',
                controller: 'AddServiceUserCtrl',
                resolve: function() { }
            })
        }
    });
