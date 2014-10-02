'use strict';

angular.module('buddyClientApp')
    .controller('AddServiceUserCtrl', function($scope, Team) {
        $scope.teams = Team.query({});
    }).controller('ServiceUsersCtrl', function ($scope, TeamServiceUser, $modal, CurrentUser, $location, $state) {

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

        $scope.serviceUsers = TeamServiceUser.query({account_id: $scope.user.account_ids[0]});
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
    }).controller('ServiceUserDiaryCtrl', function($scope, ServiceUser, $state, Entry, Session) {
        $scope.hstep = 1;
        $scope.mstep = 15;
        $scope.user = ServiceUser.get({id: $state.params.id}, function() {
            $scope.sessionScheduledTime = $scope.user.session_scheduled_time;
        });

        $scope.sessions = Session.query({user_id: $state.params.id}, function() {
            var removeValue = function(array, id) {
                return _.reject(array, function(item) {
                    return item === id;
                });
            };
            var allEntries = Entry.query({user_id: $state.params.id}, function() {
                $scope.entries = allEntries;
                $scope.sessions.reverse();
                var currentIndex = 1;
                _.each($scope.sessions, function(session) {
                    session.index = currentIndex;
                    var entries = _.select(allEntries, function(entry) {
                        return entry.created_at <= session.scheduled_time;
                    });
                    session.entries = entries;
                    _.each(entries, function(entry) { removeValue(allEntries, entry); })
                        currentIndex++;
                });

                $scope.sessions.reverse();
                $scope.sessions.unshift({id: 'present', entries: _.select(allEntries, function(entry) { entry.created_at >= $scope.sessions[0].scheduled_time }), visible: true});
                _.each($scope.sessions, function(session) {
                    session.progress = {}
                    var entryLength = session.entries.length
                    if (entryLength > 0) {
                        var counts = _.countBy(session.entries, function(entry) {
                            return "rating-" + entry.rating;
                        });
                        _.each(counts, function(count, idx) {
                            counts[idx] = "{width: '" + (parseFloat(count) / parseFloat(entryLength)) * 100 + "%'}"
                        });
                        session.progress = counts;
                    }
                });
                var entryLength = $scope.entries.length;
                if (entryLength > 0) {
                    var counts = _.countBy($scope.entries, function(entry) {
                        return "rating-" + entry.rating;
                    });
                    _.each(counts, function(count, idx) {
                        counts[idx] = "{width: '" + (parseFloat(count) / parseFloat(entryLength)) * 100 + "%'}"
                    });
                    $scope.progress = counts || {}
                }
            });



        });


        jQuery(document).ready(function() {
            $(".diary-page-contents-wrapper").hide();
            $("#diaryEntries").show();
        });
        $scope.show = function(id) {

        };
        $scope.toggleEntries = function(session) {
            session.visible = !session.visible;
        };
        $scope.setDiaryFilter = function(val) {
            $scope.diaryFilter = val;
        }

    }).controller('NewServiceUsersCtrl', function($scope, $state, Team, TeamClinician, CurrentUser, TeamServiceUser) {
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
            TeamServiceUser.save({user: $scope.service_user, account_id: $scope.service_user.account_id}, function() {
                $state.go('clinician.serviceUsers');
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
