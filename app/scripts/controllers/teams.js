'use strict';

angular.module('buddyClientApp')
    .controller('TeamsCtrl', function ($scope, Team) {
        $scope.teams = Team.query({});
    })
    .controller('TeamCtrl', function ($scope, Team, $state) {
        $scope.team = Team.get({id: $state.params.team_id});
    });
