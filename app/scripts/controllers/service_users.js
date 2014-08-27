'use strict';

angular.module('buddyClientApp')
    .controller('AddServiceUserCtrl', function($scope, ServiceUser, Team) {
        $scope.teams = Team.query({});
    }).controller('ServiceUsersCtrl', function ($scope, TeamServiceUser, $modal, CurrentUser, $location) {
        $scope.user = CurrentUser.user();
        jQuery(document).ready(function () {
            $('#tabs').tab();
            $('#tabs a[href="' + window.location.hash + '"]').tab('show');
            $(document).on("click", "td", function() {
                $location.path($(this).find("a").attr("ng-href"));
                $location.hash("")
                $scope.$apply();
            })
        });
        $scope.serviceUsers = TeamServiceUser.query({account_id: $scope.user.account_ids[0]});
        $scope.addServiceUser = function() {
            $modal.open({
                templateUrl: 'views/service_users/new.html',
                controller: 'AddServiceUserCtrl',
                resolve: function() { }
            });
        };
    }).controller('ServiceUserDiaryCtrl', function($scope, ServiceUser) {
    });


;
