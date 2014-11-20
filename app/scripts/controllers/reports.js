'use strict';

angular.module('buddyClientApp')
    .controller('ReportsCtrl', function($scope, LocalService) {
        $scope.report = function(url) {
            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'text',
                beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + angular.fromJson(LocalService.get('auth_token')).token);},
                success: function() {

                }
            });
        };

    });
