'use strict';

angular.module('buddyClientApp')
    .controller('AddServiceUserCtrl', function($scope, Team) {
        $scope.teams = Team.query({});
    }).controller('ServiceUsersCtrl', function ($scope, TeamServiceUser, $modal, CurrentUser, $location, $state, HopscotchTour, ExampleServiceUser) {
        $scope.user = CurrentUser.user();
        jQuery(document).ready(function () {
            $('.tab-pane').hide();
            $('#sessions').show();
            $(document).on('click', 'td.expand-link', function() {
                if ($(this).find('a').attr('ng-click')) {
                    angular.element(this).find('a').triggerHandler('click');
                } else {
                    $location.path($(this).find('a').attr('ng-href'));
                    $location.hash('');
                    $scope.$apply();
                }
            });
            $('#accordion').on('show.bs.collapse', function(e) {
                $(e.target).prev('.panel-heading').addClass('active');
            }).on('hide.bs.collapse', function(e) {
                $(e.target).prev('.panel-heading').removeClass('active');
            });
        });

        $scope.anchor = function(tab) {
            $('.tab-pane').hide();
            $('#' + tab).show();
        };

        $scope.serviceUsers = TeamServiceUser.query({account_id: $scope.user.account_ids[0]}, function() {
            // are we running the tutorial? create an example User
            var hopscotchState = hopscotch.getState();
            console.log(hopscotchState);
            if (hopscotchState === 'welcome-to-buddy:4') {
                var exampleUser = ExampleServiceUser.generate($scope.user);
                $scope.serviceUsers.unshift(exampleUser);
                hopscotch.startTour(HopscotchTour.tour(), 4);
            }
        });

        $scope.rescheduleSession = function(serviceUser) {
            var modalInstance = $modal.open({
                templateUrl: '/views/sessions/reschedule.html',
                controller: 'RescheduleSessionCtrl',
                resolve:  {
                    sessionId: function() { return serviceUser.current_session_id; }
                }
            });
            modalInstance.result.then(function(result) {
                serviceUser.current_session_time = result.scheduled_time;
            });
        };
        $scope.scheduleSession = function(serviceUser) {
            var modalInstance = $modal.open({
                templateUrl: '/views/sessions/reschedule.html',
                controller: 'ScheduleSessionCtrl',
                resolve: {
                    userId: function() { return serviceUser.id; }
                }
            });
            modalInstance.result.then(function(result) {
                serviceUser.current_session_time = result.scheduled_time;
            });
        };
        $scope.search = function() {
            $state.go('clinician.search', {search: $scope.search_term});
        };
        $scope.reactivate = function(serviceUser) {
            serviceUser.deactivated_at = null;
            TeamServiceUser.update({user: serviceUser, id: serviceUser.id, account_id: serviceUser.account_id});
        };
    }).controller('ServiceUserDiaryCtrl', function($scope, ServiceUser, $state, Entry, Session, ServiceUserGoal, Days, Team, TeamClinician, Goal, ServiceUserSession, Hours, CurrentUser, Auth, ExampleServiceUser, HopscotchTour) {
        $scope.Auth = Auth;
        var serviceUserId = $state.params.id || CurrentUser.user().id;

        $scope.Hours = Hours;
        var refreshClinicians = function() {
            $scope.clinicians = TeamClinician.query({account_id: $scope.service_user.account_id}, function() {
                if (!_.detect($scope.clinicians, function(x) { return x.id === $scope.service_user.clinician_id; })) {
                    $scope.service_user.clinician_id = null;
                }
            });
        };
        $scope.editGoal = function(goal) {
            goal.editable = true;
        };
        $scope.cancelEditGoal = function(goal) {
            goal.editable = false;
        };

        $scope.hstep = 1;
        $scope.mstep = 15;

        $scope.nextSession = {};

        $scope.typesOfMessage = {
            'none': 'None',
            'custom': 'Custom message',
            'default': 'Default message'
        };

        $scope.updateTextMessage = function() {
            switch($scope.service_user.type_of_message) {
                case 'custom':
                    $scope.service_user.send_daily_reminder_messages = true;
                    break;
                case 'default':
                    $scope.service_user.send_daily_reminder_messages = true;
                    $scope.service_user.daily_entry_text_message = null;
                    break;
                case 'none':
                    $scope.service_user.send_daily_reminder_messages = false;
            }
            ServiceUser.update({user: $scope.service_user, id: $scope.service_user.id}, function(res) {
                $scope.service_user = res;
                $scope.service_user.daily_entry_reminder_hour = $scope.service_user.daily_entry_reminder_hour.toString();
            });
        };

        $scope.updateSession = function(session) {
            if (session.id) {
                Session.update({session: session, id: session.id}, function() {
                    $scope.sessionScheduledTime = session.scheduled_time;
                });
            } else {
                ServiceUserSession.save({session: session, service_user_id: $scope.user.id}, function(s) {
                    $scope.sessionScheduledTime = session.scheduled_time;
                    $scope.nextSession = s;
                });
            }
        };

        if (serviceUserId !== 'example') {
            $scope.service_user = ServiceUser.get({id: serviceUserId}, function() {
                $scope.service_user.daily_entry_reminder_hour = $scope.service_user.daily_entry_reminder_hour.toString();
                $scope.teams = Team.query({}, function() {
                    refreshClinicians();
                });
                if ($scope.service_user.session_scheduled_time) {
                    $scope.sessionScheduledTime = $scope.service_user.session_scheduled_time;
                    $scope.nextSession = Session.get({id: $scope.service_user.session_id});
                } else {
                    $scope.nextSession.scheduled_time = new Date();
                    $scope.nextSession.scheduled_time.setMinutes(0);
                }

            });
            $scope.submitDiaryEntry = function() {
                if ($scope.currentDiaryEntry) {
                    if ($scope.currentDiaryEntry.body) {
                        if ($scope.newDiaryEntry.body) {
                            $scope.newDiaryEntry.body = $scope.currentDiaryEntry.body + "\n\n" + $scope.newDiaryEntry.body;
                        }
                        Entry.update({entry: $scope.newDiaryEntry, id: $scope.currentDiaryEntry.id}, function(res) {
                            $scope.currentDiaryEntry = res;
                        });
                        $scope.newDiaryEntry = {};
                    }
                } else if (!$scope.currentDiaryEntry || !$scope.currentDiaryEntry.body) {
                    Entry.save({entry: $scope.newDiaryEntry}, function(res) {
                        $scope.currentDiaryEntry = res;
                    });
                    $scope.newDiaryEntry = {};

                }
            };

            $scope.sessions = Session.query({user_id: serviceUserId}, function() {
                $scope.currentSession = $scope.sessions[0];
                var removeEntries = function(array, entry) {
                    return _.reject(array, function(item) {
                        return item.id === entry.id;
                    });
                };
                var allEntries = Entry.query({user_id: serviceUserId}, function() {

                    $scope.entries = allEntries;
                    var today = new Date();
                    today.setHours(0,0,0,0);
                    var tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    tomorrow.setHours(0,0,0,0);

                    $scope.currentDiaryEntry = _.find($scope.entries, function(entry) {
                        var created_at = moment(entry.created_at);
                        return created_at >= today && created_at <= tomorrow;
                    });
                    $scope.newDiaryEntry = {};

                    $scope.sessions.reverse();
                    var currentIndex = 1;
                    _.each($scope.sessions, function(session) {
                        session.index = currentIndex;
                        var entries = _.select(allEntries, function(entry) {
                            return entry.created_at <= session.scheduled_time;
                        });
                        session.entries = entries;
                        _.each(entries, function(entry) { allEntries = removeEntries(allEntries, entry); });
                        currentIndex++;
                    });

                    $scope.sessions.reverse();
                    $scope.sessions.unshift({id: 'present', entries: allEntries, visible: true});
                    _.each($scope.sessions, function(session) {
                        session.progress = {};
                        var entryLength = _.filter(session.entries, function(entry) { return !!entry.rating;}).length;
                        if (entryLength > 0) {
                            var counts = _.countBy(session.entries, function(entry) {
                                if (entry.rating) {
                                    return 'rating-' + entry.rating;
                                } else {
                                    return null;
                                }
                            });
                            _.each(counts, function(count, idx) {
                                if (idx) {
                                    counts[idx] = '{width: "' + (parseFloat(count) / parseFloat(entryLength)) * 100 + '%"}';
                                }
                            });
                            delete counts[null];
                            session.progress = counts;
                        }
                    });
                    var entryLength = _.filter($scope.entries, function(entry) { return !!entry.rating;}).length;
                    if (entryLength > 0) {
                        var counts = _.countBy($scope.entries, function(entry) {
                            if (entry.rating) {
                                return 'rating-' + entry.rating;
                            } else {
                                return null;
                            }
                        });
                        _.each(counts, function(count, idx) {
                            if (idx) {
                                counts[idx] = '{width: "' + (parseFloat(count) / parseFloat(entryLength)) * 100 + '%"}';
                            }

                        });
                        delete counts[null];
                        $scope.progress = counts || {};
                    }
                });
            });

            $scope.goals = ServiceUserGoal.query({user_id: serviceUserId}, function() {
                _.map($scope.goals, function(goal) { goal.removed = !!goal.removed_at; });
            });
        } else {
            var hopscotchState = hopscotch.getState();
            if (hopscotchState === 'welcome-to-buddy:5') {
                hopscotch.startTour(HopscotchTour.tour($state, $scope), 6);
            }

            $scope.service_user = ExampleServiceUser.generate(CurrentUser.user().id);
            $scope.sessions = $scope.service_user.sessions;
        }

        $scope.toggleGoalChanged = function(goal) {
            if (goal.removed) {
                goal.removed_at = new Date();
            } else {
                goal.removed_at = null;
            }
            goal.removed = !!goal.removed_at;
            goal = Goal.update({goal: goal, id: goal.id});
        };

        var goalTime = new Date();
        goalTime.setMinutes(0);

        $scope.newGoal = {reminder_type: 'recurring', time: goalTime, text: '', day:{}};
        _.each(Days, function(day) { $scope.newGoal.day[day] = false; });
        $scope.Days = Days;

        $scope.show = function(id) {
            $('.diary-page-contents-wrapper').hide();
            $('#' + id).show();
            $('.nav-item').removeClass('active');
            $('.' + id).addClass('active');
        };

        jQuery(document).ready(function() {
            $scope.show('diaryEntries');
        });
        $scope.toggleEntries = function(session) {
            session.visible = !session.visible;
        };
        $scope.setDiaryFilter = function(val) {
            $scope.diaryFilter = val;
        };
        $scope.submit = function() {
            ServiceUser.update({id: $scope.service_user.id, user: $scope.service_user}, function(res) {
                $scope.service_user = res;
                $scope.service_user.daily_entry_reminder_hour = $scope.service_user.daily_entry_reminder_hour.toString();
            }, function(response) {
                _.each(response.data, function(value, key) { response.data[key] = value[0]; });
                $scope.errors = response.data;
            });
        };
        $scope.submitSessionPlan = function(session) {
            Session.update({id: session.id, session: session});
        };


    }).controller('NewServiceUsersCtrl', function($scope, $state, Team, TeamClinician, CurrentUser, TeamServiceUser, HopscotchTour) {
        if (hopscotch.getState() === 'welcome-to-buddy:2') {
            hopscotch.startTour(HopscotchTour.tour(), 3);
        }

        $scope.service_user = {};
        $scope.errors = {};

        var refreshClinicians = function() {
            $scope.clinicians = TeamClinician.query({account_id: $scope.teams[0].id}, function() {
                if (!_.detect($scope.clinicians, function(x) { return x.id === $scope.service_user.clinician_id; })) {
                    $scope.service_user.clinician_id = null;
                }
            });
        };

        var user = CurrentUser.user();
        $scope.teams = Team.query({}, function() {
            $scope.service_user.account_id = $scope.teams[0].id;
            refreshClinicians();
            $scope.service_user.clinician_id = user.id;
        });

        $scope.hstep = 1;
        $scope.mstep = 15;
        $scope.service_user.session_time = new Date();
        $scope.service_user.session_time.setMonth($scope.service_user.session_time.getMonth() + 1);
        $scope.service_user.session_time.setMinutes(0);

        $scope.minDate = new Date();
        $scope.open = function() {
            $scope.opened = true;
        };

        $scope.submit = function() {
            var user = TeamServiceUser.save({user: $scope.service_user, account_id: $scope.service_user.account_id}, function() {
                $state.go('clinician.serviceUserDiary', {id: user.id});
            }, function(response) {
                _.each(response.data, function(value, key) { response.data[key] = value[0]; });
                $scope.errors = response.data;
            });
        };

    }).controller('EditServiceUserCtrl', function($scope, $state, ServiceUser, TeamServiceUser, Team, TeamClinician) {
        $scope.service_user = ServiceUser.get({id: $state.params.id}, function() {
            $scope.service_user.account_id = $scope.service_user.primary_account_id;
        });
        var refreshClinicians = function() {
            $scope.clinicians = TeamClinician.query({account_id: $scope.teams[0].id}, function() {
                if (!_.detect($scope.clinicians, function(x) { return x.id === $scope.service_user.clinician_id; })) {
                    $scope.service_user.clinician_id = null;
                }
            });
        };
        $scope.teams = Team.query({}, function() {
            refreshClinicians();
        });

        $scope.submit = function() {
            TeamServiceUser.update({id: $scope.service_user.id, user: $scope.service_user, account_id: $scope.service_user.account_id}, function() {
                $state.go('clinician.serviceUsers');
            }, function(response) {
                _.each(response.data, function(value, key) { response.data[key] = value[0]; });
                $scope.errors = response.data;
            });
        };
    }).controller('DeactivateServiceUserCtrl', function($scope, $state, ServiceUser, TeamServiceUser, $location) {
        $scope.returnTo = unescape($state.params.returnTo || '/service_users');
        $scope.serviceUser = ServiceUser.get({id: $state.params.id});
        $scope.deactivationReasons = [
            'Completed treatment',
            'Self discharge',
            'Not using Buddy',
            'Lost phone',
            'Other'
        ];
        $scope.submit = function() {
            $scope.serviceUser.deactivated_at = new Date();
            TeamServiceUser.update({id: $state.params.id, user: $scope.serviceUser, account_id: $scope.serviceUser.account_id}, function() {
                $location.path($scope.returnTo);
                $location.search('returnTo', null);
            });
        };
    });
