'use strict';

angular.module('buddyClientApp')
    .controller('DiaryCtrl', function($scope, CurrentUser, ServiceUserEntry, ServiceUserSession) {
        $scope.user = CurrentUser.user();
        $scope.entries = ServiceUserEntry.query({service_user_id: $scope.user.id});
        $scope.sessions = ServiceUserSession.query({service_user_id: $scope.user.id});
    }
               );
