'use strict';

angular.module('buddyClientApp')
    .directive('addEmailInput', function ($compile) { // inject $compile service as dependency
    return {
        restrict: 'A',
        link: function (scope, element) {
            // click on the button to add new input field
            element.find('button').bind('click', function () {
                // I'm using Angular syntax. Using jQuery will have the same effect
                // Create input element
                var input = angular.element('<div><input type="email" ng-model="email[' + scope.inputCounter + ']"></div>');
                // Compile the HTML and assign to scope
                $compile(input)(scope);

                // Append input to div
                element.append(input);

                // Increment the counter for the next input to be added
                scope.inputCounter++;
            });
        }
    };
});
