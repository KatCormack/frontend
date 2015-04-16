'use strict';

angular.module('buddyClientApp').
    controller('GroupsCtrl', function($scope, Group) {
        $scope.groups = Group.query();
    }).
    controller('NewGroupCtrl', function($scope, Group, $state) {
        $scope.group = {};
        $scope.submit = function() {
            Group.save({group: $scope.group}, function(res) {
                $state.go('clinician.showGroup', {id: res.id});
            });
        };
    }).
    controller('GroupCtrl', function($scope, $state, Group, GroupServiceUser, GroupClinician, ServiceUser, Clinician, GroupMembership) {
        $scope.group = Group.get({id: $state.params.id}, function() {
            $scope.service_users = GroupServiceUser.query({group_id: $scope.group.id});
            $scope.clinicians = GroupClinician.query({group_id: $scope.group.id});
        });

        $scope.all_service_users = ServiceUser.query({});
        $scope.all_clinicians = Clinician.query({});
        $scope.addUser = function(user_id) {
            GroupMembership.save({group_id: $scope.group.id, user_id: user_id}, function(res) {
                if (res.type === 'Clinician') {
                    $scope.clinicians.push(res);
                } else {
                    $scope.service_users.push(res);
                }
            });
        };

        $scope.removeServiceUser = function(idx) {
            var user = $scope.service_users[idx];
            $scope.remove(user, 'service_user', idx);
        };

        $scope.removeClinician = function(idx) {
            var user = $scope.clinicians[idx];
            $scope.remove(user, 'clinician', idx);
        };


        $scope.remove = function(user, type, idx) {
            GroupMembership.remove({group_id: $scope.group.id, id: user.id}, function() {
                if (type === 'service_user') {
                    $scope.service_users.splice(idx, 1);
                } else {
                    $scope.clinicians.splice(idx, 1);
                }
            });
        };


    }).
    controller('GroupGoalsCtrl', function($scope, $state, Group, GroupServiceUser, GroupClinician, ServiceUserGoal, Days) {
        $scope.Days = Days;
        var goalTime = new Date();
        goalTime.setMinutes(0);

        $scope.newGoal = {reminder_type: 'recurring', time: goalTime, text: '', regular_reminder_schedule:{}};
        _.each(Days, function(day) { $scope.newGoal.regular_reminder_schedule[day] = false; });

        $scope.group = Group.get({id: $state.params.id}, function() {
            $scope.service_users = GroupServiceUser.query({group_id: $scope.group.id});
        });

        $scope.newGoalSubmit = function() {
            var utcTime = moment($scope.newGoal.time);
            $scope.newGoal.scheduled_reminder_hour = utcTime.hours();
            $scope.newGoal.scheduled_reminder_minutes = utcTime.minutes();
            _.each($scope.service_users, function(user) {
                ServiceUserGoal.save({user_id: user.id, goal: $scope.newGoal}, function(res) {
                    $scope.newGoal = {reminder_type: 'recurring', time: goalTime, text: '', regular_reminder_schedule:{}};
                    _.each(Days, function(day) { $scope.newGoal.regular_reminder_schedule[day] = false; });
                });
            });
        };

        $scope.hstep = 1;
        $scope.mstep = 15;
        $scope.open = function(goal) {
            goal.opened = true;
        };
    }).
    controller('GroupSessionsCtrl', function($scope, $state, Group, GroupServiceUser, GroupClinician, ServiceUserSession) {
        $scope.group = Group.get({id: $state.params.id}, function() {
            $scope.service_users = GroupServiceUser.query({group_id: $scope.group.id});
        });
        $scope.nextSession = {};
        $scope.nextSession.scheduled_time = new Date();
        $scope.nextSession.scheduled_time.setMinutes(0);
        $scope.hstep = 1;
        $scope.mstep = 15;
        $scope.open = function(session) {
            session.opened = true;
        };
        $scope.updateSession = function(session) {
            _.each($scope.service_users, function(user) {
                ServiceUserSession.save({session: session, service_user_id: user.id}, function(s) {
                    $state.go('clinician.showGroup', {id: $scope.group.id});
                });
            });
        };


    });
