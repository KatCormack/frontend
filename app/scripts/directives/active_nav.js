'use strict';

angular.module('buddyClientApp')
    .directive('activeNav', function() {
        return {
            restrict: 'A',
            scope: false,
            link: function(scope, element) {
                scope.$watch('state.current.activetab', function() {
                    element.removeClass('active');
                    if (element.attr('active-nav') === scope.state.current.activetab) {
                        element.addClass('active');
                    }
                });
            }
        };
    });
