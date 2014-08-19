'use strict';

angular.module('buddyClientApp').
    factory('Page', function() {
        var title = 'Buddy';
        return {
            title: function() { return title; },
            setTitle: function(newTitle) {
                title = newTitle;
                return title;
            }
        };
    });
