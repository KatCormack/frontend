'use strict';

angular.module('buddyClientApp')
    .controller('CliniciansCtrl', function ($scope, Clinician, Team) {
        $scope.teams = Team.query();

        $scope.clinicians = Clinician.query();
        /*
           some sort of grouping query perhaps where we show the
           clinicians with their teams?
        */

    });
