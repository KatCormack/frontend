'use strict';

angular.module('buddyClientApp')
    .controller('AddClinicianCtrl', function($scope, TeamClinician, Team, CurrentUser, $modalInstance) {
        $scope.clinicians = {};
        $scope.teams = Team.query({});
        $scope.clinicians.team = CurrentUser.user().account_ids[0];
        $scope.submit = function() {
            var teamClinician = {user: {email: $scope.clinicians.email}, account_id: $scope.clinicians.team};
            TeamClinician.save(teamClinician, function(response) {
                $modalInstance.close(response);
            });
        };
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
        $scope.search = function() {
            $state.go('clinician.search', {search: $scope.search_term});
        };

    })
    .controller('CliniciansCtrl', function ($scope, Clinician, Team, Page, $modal) {
        Page.setTitle('Buddy - Clinicians');
        $scope.teams = Team.query();
        $scope.clinicians = Clinician.query();
        $scope.addClinician = function() {
            $modal.open({
                templateUrl: 'views/clinicians/new.html',
                controller: 'AddClinicianCtrl',
                resolve: function() { }
            });
        };
    });
