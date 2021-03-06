'use strict';

angular.module('buddyClientApp').
    controller('TutorialCtrl', function($scope, HopscotchTour, $state) {
        $scope.clinicianTutorial = function() {
            hopscotch.endTour();
            hopscotch.startTour(HopscotchTour.tour($state));
        };
    });
