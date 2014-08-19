'use strict';

angular.module('buddyClientApp')
    .controller('AddClinicianCtrl', function($scope, Clinician, Team) {
        $scope.teams = Team.query({});
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
