'use strict';

angular.module('buddyClientApp').
    controller('TutorialCtrl', function($scope, HopscotchTour) {
        $scope.clinicianTutorial = function() {
            hopscotch.startTour(HopscotchTour)
        };
    });
