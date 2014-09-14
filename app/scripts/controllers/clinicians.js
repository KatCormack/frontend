'use strict';

angular.module('buddyClientApp')
    .controller('AddClinicianCtrl', function($scope, TeamClinician, Team, CurrentUser) {
        $scope.clinician = {}
        $scope.teams = Team.query({});
        $scope.clinician.team = CurrentUser.user().account_ids[0];
    })
    .controller('CliniciansCtrl', function ($scope, Clinician, Team, Page, $modal, $location) {
        Page.setTitle('Buddy - Clinicians');
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
        $(document).on('click', 'td.expand-link', function() {
            $location.path($(this).find('a').attr('ng-href'));
            $location.hash('');
            $scope.$apply();
        });
    })
    .controller('EditClinicianCtrl', function($scope, $state, Clinician) {
        $scope.clinician = Clinician.get({id: $state.params.id})
    })

;
