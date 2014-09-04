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
    }).controller('ScheduleSessionCtrl', function($scope, userId, ServiceUserSession) {
        console.log(userId);
        $scope.title = "Schedule new session";
        $scope.button_value = "Schedule";
        $scope.session = {}
        $scope.session.time = moment().add('months', 1);
        $scope.session.date = $scope.session.time.format("DD/MM/YYYY");
        $scope.session.hour = $scope.session.time.format("HH");
        $scope.session.minute = "00";
        $scope.open = function($event) {
            $scope.opened = true;
        };
        $scope.submit = function() {
            $scope.session.scheduled_time = moment($scope.session.date, "DD/MM/YYYY")
            $scope.session.scheduled_time.hour($scope.session.session_hour);
            $scope.session.scheduled_time.minute($scope.session.session_minute);
            ServiceUserSession.save({service_user_id: userId, session: $scope.session}, function(res) {
                console.log(res)
            }, function() {
                console.log($scope.session.scheduled_time)
            })
        }
    });
