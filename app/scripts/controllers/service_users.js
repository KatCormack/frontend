'use strict';

angular.module('buddyClientApp')
    .controller('AddServiceUserCtrl', function($scope, ServiceUser, Team) {
        $scope.teams = Team.query({});
    }).controller('ServiceUsersCtrl', function ($scope, TeamServiceUser, $modal, CurrentUser, $location) {
        $scope.user = CurrentUser.user();
        jQuery(document).ready(function () {
            $('#tabs').tab();
            $('#tabs a[href="' + window.location.hash + '"]').tab('show');
            $(document).on('click', 'td', function() {
                $location.path($(this).find('a').attr('ng-href'));
                $location.hash('');
                $scope.$apply();
            });
        });
        $scope.serviceUsers = TeamServiceUser.query({account_id: $scope.user.account_ids[0]});
        $scope.addServiceUser = function() {
            $modal.open({
                templateUrl: '/views/service_users/new.html',
                controller: 'AddServiceUserCtrl',
                resolve: { }
            });
        };
        $scope.rescheduleSession = function(sessionId) {
            $modal.open({
                templateUrl: '/views/sessions/reschedule.html',
                controller: 'RescheduleSessionCtrl',
                resolve:  {
                    sessionId: function() { return sessionId; }
                }
            });
        };
    }).controller('ServiceUserDiaryCtrl', function($scope, ServiceUser, $state, Entry) {
        $scope.user = ServiceUser.get({id: $state.params.id});
        $scope.entries = Entry.query({user_id: $state.params.id});
    }).controller('NewServiceUsersCtrl', function($scope, Team, TeamClinician, CurrentUser) {
        $scope.service_user = {};
        var refreshClinicians = function() {
            $scope.clinicians = TeamClinician.query({account_id: $scope.teams[0].id}, function() {
                if (!_.detect($scope.clinicians, function(x) { return x.id == $scope.service_user.clinician_id })) {
                    $scope.service_user.clinician_id = null;
                }
            });
        };
        var user = CurrentUser.user();
        $scope.teams = Team.query({}, function() {
            $scope.service_user.team_id = $scope.teams[0].id;
            refreshClinicians();
            $scope.service_user.clinician_id = user.id;
        });
        $scope.open = function($event) {
            $scope.opened = true;
        };
    });
