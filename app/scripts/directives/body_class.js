'use strict';

angular.module('buddyClientApp')
    .directive('setBodyClass', function() {
        return {
            restrict: 'A',
            scope: false,
            link: function(scope, element) {
                scope.$watch('state.current.controller', function() {
                    element.removeAttr('class')
                    element.addClass(scope.state.current.controller);
                });
            }
        };
    });
