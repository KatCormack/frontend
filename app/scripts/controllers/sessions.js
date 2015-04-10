'use strict';

angular.module('buddyClientApp')
    .controller('RescheduleSessionCtrl', function(sessionId, Session, $scope, $modalInstance) {
        $scope.title = 'Reschedule session';
        $scope.button_value = 'Reschedule';
        $scope.hstep = 1;
        $scope.mstep = 15;
        $scope.session = Session.get({id: sessionId}, function() {
            $scope.user_id = $scope.session.user_id;
        });
        $scope.open = function() {
            $scope.opened = true;
        };
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
        $scope.submit = function() {
            Session.update({id: sessionId, session: $scope.session}, function(res) {
                $modalInstance.close(res);
            });
        };
    }).controller('ScheduleSessionCtrl', function($scope, userId, ServiceUserSession, $modalInstance) {
        $scope.title = 'Schedule new session';
        $scope.button_value = 'Schedule';
        $scope.session = {};
        $scope.user_id = userId;
        $scope.session.scheduled_time = moment().add(1, 'months').toDate().toString();
        $scope.hstep = 1;
        $scope.mstep = 15;
        $scope.open = function() {
            $scope.opened = true;
        };
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
        $scope.submit = function() {
            ServiceUserSession.save({service_user_id: userId, session: $scope.session}, function(res) {
                $modalInstance.close(res);
            });
        };
    });
