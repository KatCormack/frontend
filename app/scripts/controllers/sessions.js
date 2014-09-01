'use strict';

angular.module('buddyClientApp')
    .controller('RescheduleSessionCtrl', function(sessionId, Session, $scope) {
        $scope.session = Session.get({id: sessionId}, function() {
            $scope.session.scheduledTimeAsDateTime = moment($scope.session.scheduled_time);
            $scope.session.date = $scope.session.scheduledTimeAsDateTime.toDate();
            $scope.session.hour = pad($scope.session.scheduledTimeAsDateTime.hour(), 2);
            $scope.session.minute = pad($scope.session.scheduledTimeAsDateTime.minute(), 2);
        });
        $scope.open = function($event) {
            $scope.opened = true;
        };
    });
