'use strict';

angular.module('buddyClientApp')
    .controller('SearchCtrl', function($scope, $state) {
        $scope.search_term = $state.params.search;
    })
