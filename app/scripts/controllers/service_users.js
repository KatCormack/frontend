'use strict';

angular.module('buddyClientApp')
    .controller('AddServiceUserCtrl', function($scope, ServiceUser, Team) {
        $scope.teams = Team.query({});
    }).controller('ServiceUsersCtrl', function ($scope, TeamServiceUser, $modal, CurrentUser, $location, $state) {
        $scope.user = CurrentUser.user();
        jQuery(document).ready(function () {
            $('#tabs').tab();
            $('#tabs a[href="' + window.location.hash + '"]').tab('show');
            $(document).on('click', 'td.expand-link', function() {
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
        $scope.scheduleSession = function(serviceUser) {
            $modal.open({
                templateUrl: '/views/sessions/reschedule.html',
                controller: 'ScheduleSessionCtrl',
                resolve: {
                    userId: function() { return serviceUser.id; }
                }
            })
        }
        $scope.search = function() {
            $state.go('clinician.search', {search: $scope.search_term});
        };
        $scope.reactivate = function(serviceUser) {
            console.log(serviceUser);
        };
        $scope.deactivate = function(serviceUser) {

        };
    }).controller('ServiceUserDiaryCtrl', function($scope, ServiceUser, $state, Entry) {
        $scope.user = ServiceUser.get({id: $state.params.id});
        $scope.entries = Entry.query({user_id: $state.params.id});
    }).controller('NewServiceUsersCtrl', function($scope, $state, Team, TeamClinician, CurrentUser, TeamServiceUser) {
        $scope.service_user = {};
        $scope.errors = {};

        var refreshClinicians = function() {
            $scope.clinicians = TeamClinician.query({account_id: $scope.teams[0].id}, function() {
                if (!_.detect($scope.clinicians, function(x) { return x.id == $scope.service_user.clinician_id })) {
                    $scope.service_user.clinician_id = null;
                }
            });
        };

        var user = CurrentUser.user();
        $scope.teams = Team.query({}, function() {
            $scope.service_user.account_id = $scope.teams[0].id;
            refreshClinicians();
            $scope.service_user.clinician_id = user.id;
        });
        $scope.service_user.session_time = moment().add('months', 1);
        $scope.service_user.session_date = $scope.service_user.session_time.format("DD/MM/YYYY");
        $scope.service_user.session_hour = $scope.service_user.session_time.format("HH");
        $scope.service_user.session_minute = "00";

        $scope.minDate = new Date();
        $scope.open = function() {
            $scope.opened = true;
        };

        $scope.submit = function() {
            $scope.service_user.session_time = moment($scope.service_user.session_date, "DD/MM/YYYY")
            $scope.service_user.session_time.hour($scope.service_user.session_hour);
            $scope.service_user.session_time.minute($scope.service_user.session_minute);
            TeamServiceUser.save({user: $scope.service_user, account_id: $scope.service_user.account_id}, function() {
                $state.go('clinician.serviceUsers');
            }, function(response) {
                _.each(response.data, function(value, key) { response.data[key] = value[0] });
                $scope.errors = response.data;
            });
        }

    }).controller('EditServiceUserCtrl', function($scope, $state, ServiceUser, TeamServiceUser, Team, TeamClinician) {
        $scope.service_user = ServiceUser.get({id: $state.params.id}, function() {
            $scope.service_user.account_id = $scope.service_user.primary_account_id;
        })
        var refreshClinicians = function() {
            $scope.clinicians = TeamClinician.query({account_id: $scope.teams[0].id}, function() {
                if (!_.detect($scope.clinicians, function(x) { return x.id == $scope.service_user.clinician_id })) {
                    $scope.service_user.clinician_id = null;
                }
            });
        };
        $scope.teams = Team.query({}, function() {
            refreshClinicians();
        });

        $scope.submit = function() {
            TeamServiceUser.update({id: $scope.service_user.id, user: $scope.service_user, account_id: $scope.service_user.account_id}, function() {
                $state.go('clinician.serviceUsers');
            }, function(response) {
                _.each(response.data, function(value, key) { response.data[key] = value[0] });
                $scope.errors = response.data;
            });
        };
    });
