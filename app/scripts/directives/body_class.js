'use strict';

angular.module('buddyClientApp')
    .directive('setBodyClass', function() {
        return {
            restrict: 'A',
            scope: false,
            link: function(scope, element) {
                scope.$watch('state.current.controller', function() {
                    // for some reason element.removeClass() was not
                    // working, as a workaround for now - we are
                    // removing the entire class attribute, then
                    // adding it afterwards
                    element.removeAttr('class');
                    element.addClass(scope.state.current.controller);
                });
            }
        };
    });
