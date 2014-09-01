angular.module('buddyClientApp')
    .directive('hourSelect', function () {
        return {
            restrict: 'E',
            replace: true,
            controller:function($scope) {
                $scope.hourRange = _.map(_.range(0,24), function(i) { return pad(i, 2) });
            },
            template: '<select ng-options="h as h for h in hourRange" class="form-control"></select>'
        };
    })
    .directive('minuteSelect', function () {
        return {
            restrict: 'E',
            replace: true,
            controller:function($scope) {
                $scope.minuteRange = ['00', '15', '30', '45'];
            },
            template: '<select ng-options="m as m for m in minuteRange" class="form-control"></select>'
        };
    })

;
