'use strict';

angular.module('buddyClientApp')
    .controller('NewClinicianCtrl', function($scope, $state, Clinician, Team, CurrentUser) {
        $scope.clinician = {};
        $scope.clinician.has_caseload = true;
        $scope.teams = Team.query({});
        $scope.current_team = CurrentUser.user().account_ids[0];
        $scope.submit = function() {
            var selectedTeams = _.select($scope.teams, function(team) { return team.selected; });
            var teamIds = _.map(selectedTeams, function(team) { return team.id; });
            $scope.clinician.account_ids = teamIds;
            Clinician.save({user: $scope.clinician}, function() {
                $state.go('clinicianAdmin.clinicians');
            }, function(response) {
                _.each(response.data, function(value, key) { response.data[key] = value[0]; });
                $scope.errors = response.data;
            });
        };
        $scope.selectAllTeams = function() {
            _.each($scope.teams, function(team) { team.selected = true; });
        };
    })
    .controller('CliniciansCtrl', function ($scope, Clinician, Team, Page, $modal, $location, $state) {
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
            $('.tab-pane').hide();
            $('#' + tab).show();
        };

        $scope.teams = Team.query();
        $scope.clinicians = Clinician.query({}, function() {
            _.map($scope.clinicians, function(clinician) {
                clinician.last_request_at = (clinician.last_request_at ? moment(clinician.last_request_at) : null);
                return clinician;
            });
        });
        $scope.search = function() {
            $state.go('clinician.search', {search: $scope.search_term});
        };
        $scope.twoWeeksAgo = new Date();
        $scope.twoWeeksAgo.setDate($scope.twoWeeksAgo.getDate() - 14);
    })
    .controller('EditClinicianCtrl', function($scope, $state, Team, Clinician, ClinicianServiceUser, TeamClinician, ClinicianServiceUserRelationship, Membership) {
        $scope.clinician = Clinician.get({id: $state.params.id});
        $scope.errors = {};
        $scope.teams = Team.query({}, function() {
            $scope.teams = _.map($scope.teams, function(team) { team.selected = true; return team; });
        });
        $scope.teamClinicians = [];
        $scope.serviceUsers = ClinicianServiceUser.query({clinician_id: $state.params.id}, function() {
            _.each($scope.serviceUsers, function(serviceUser) {
                if (!$scope.teamClinicians[serviceUser.account_id]) {
                    $scope.teamClinicians[serviceUser.account_id] = TeamClinician.query({account_id: serviceUser.account_id});
                }
            });
        });
        $scope.selectAllTeams = function() {
            _.each($scope.teams, function(team) { team.selected = true; });
        };
        $scope.clinicians = Clinician.query();
        $scope.checkUsers = function() {
            var count = 0;
            _.each($scope.serviceUsers, function(user) {
                var selectedTeamIds = _.map(_.filter($scope.teams, function(team) { return team.selected; }), function(team) { return team.id; });
                user.needsMoving = (selectedTeamIds.indexOf(user.account_id) === -1 && user.clinician_id === $state.params.id);
                if (user.needsMoving) { count ++; }
            });
            return count;
        };
        $scope.checkTeams = function() {
            var selectedTeamIds = _.map(_.filter($scope.teams, function(team) { return team.selected; }), function(team) { return team.id; });
            $scope.errors.team = (selectedTeamIds.length === 0);
            return selectedTeamIds.length;
        };
        $scope.submit = function() {
            $scope.checkTeams();
            if ($scope.checkUsers() > 0 || $scope.errors.team) {
                Clinician.update({user: $scope.clinician, id: $state.params.id, validate_only: true}, function() {
                }, function(response) {
                    _.each(response.data, function(value, key) { response.data[key] = value[0]; });
                    $scope.errors = response.data;
                });
            } else {
                Clinician.update({user: $scope.clinician, id: $state.params.id}, function() {
                    // move the service users from one clinician to the other
                    // get the service users
                    var usersToMove = _.select($scope.serviceUsers, function(u) { return u.clinician_id !== $state.params.id; });
                    _.each(usersToMove, function(user) {
                        // create the new relationship
                        ClinicianServiceUserRelationship.save({
                            service_user_id: user.id,
                            clinician_id: user.clinician_id
                        }, function() {
                            // destroy the old relationship
                            ClinicianServiceUserRelationship.remove({
                                service_user_id: user.id,
                                clinician_id: $scope.clinician.id
                            });
                        });
                    });
                    // get newly selected teams
                    var selectedTeamIds = _.map(_.filter($scope.teams, function(team) { return team.selected; }), function(team) { return team.id; });
                    // join and leave old teams
                    _.each(selectedTeamIds, function(id) {
                        $scope.clinician.account_ids.remove(id);
                    });
                    var teamsToRemove = $scope.clinician.account_ids;
                    _.each($scope.clinician.account_ids, function(id) {
                        selectedTeamIds.remove(id);
                    });
                    var teamsToAdd = selectedTeamIds;
                    // leave old teams
                    _.each(teamsToRemove, function(team) {
                        Membership.remove({user_id: $scope.clinician.id, account_id: team});
                    });
                    // join new teams
                    _.each(teamsToAdd, function(team) {
                        Membership.save({user_id: $scope.clinician.id, account_id: team});
                    });

                    $state.go('clinicianAdmin.clinicians');
                });
            }
        };
        $scope.hasUsers = function() {
            return _.filter($scope.serviceUsers, function(user)  { return user.clinician_id === $scope.clinician.id && !user.deactivated_at; }).length > 0;
        };
        $scope.deactivate = function($event) {
            $event.preventDefault();
            if ($scope.hasUsers() > 0) {
                $scope.deactivationClicked = true;
                /*
                var element = angular.element('.deactivate-service-users-error');
                var options = {
                    duration: 700,
                    easing: 'easeInQuad',
                    offset: 120,
                }
                smoothScroll(element, options);
                */
            }
        };

    });
