'use strict';

angular.module('buddyClientApp')
    .controller('NewClinicianCtrl', function($scope, $state, Clinician, Team, CurrentUser) {
        $scope.clinician = {}
        $scope.teams = Team.query({})
        $scope.current_team = CurrentUser.user().account_ids[0];
        $scope.submit = function() {
            var selectedTeams = _.select($scope.teams, function(team) { return team.selected })
            var teamIds = _.map(selectedTeams, function(team) { return team.id})
            $scope.clinician.account_ids = teamIds;
            Clinician.save({user: $scope.clinician}, function() {
                $state.go('clinicianAdmin.clinicians')
            }, function(response) {
                _.each(response.data, function(value, key) { response.data[key] = value[0] });
                $scope.errors = response.data;
            });
        }
    })
    .controller('CliniciansCtrl', function ($scope, Clinician, Team, Page, $modal, $location) {
        Page.setTitle('Buddy - Clinicians');
        jQuery(document).ready(function () {
            $('.tab-pane').hide();
            $('#az').show();
            $(document).on('click', 'td.expand-link', function() {
                $location.path($(this).find('a').attr('ng-href'));
                $location.hash('');
                $scope.$apply();
            });
        });
        $scope.anchor = function(tab) {
            $(".tab-pane").hide();
            $("#" + tab).show();
        }

        $scope.teams = Team.query();
        $scope.clinicians = Clinician.query({}, function() {
            _.map($scope.clinicians, function(clinician) {
                clinician.last_request_at = (clinician.last_request_at ? moment(clinician.last_request_at) : null);
                return clinician;
            })
        });
        $scope.search = function() {
            $state.go('clinician.search', {search: $scope.search_term});
        };
        $scope.twoWeeksAgo = new Date()
        $scope.twoWeeksAgo.setDate($scope.twoWeeksAgo.getDate() - 14);
    })
    .controller('EditClinicianCtrl', function($scope, $state, Team, Clinician, ClinicianServiceUser) {
        $scope.clinician = Clinician.get({id: $state.params.id})
        $scope.teams = Team.query({}, function() {
            $scope.teams = _.map($scope.teams, function(team) { team.selected = true; return team });
        });
        $scope.serviceUsers = ClinicianServiceUser.query({clinician_id: $state.params.id});
    });
