'use strict';

angular.module('buddyClientApp')
    .controller('SearchCtrl', function($scope, $state, ServiceUserSearch, ClinicianSearch, $location) {
        $scope.search_term = $state.params.search;
        $scope.serviceUsers = ServiceUserSearch.query({q: $scope.search_term});
        $scope.clinicians = ClinicianSearch.query({q: $scope.search_term})
        jQuery(document).ready(function () {
            $(document).on('click', 'td.expand-link', function() {
                $location.path($(this).find('a').attr('ng-href'));
                $location.hash('');
                $scope.$apply();
            });
        });

    })
