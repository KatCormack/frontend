'use strict';

angular.module('buddyClientApp')
    .factory('Entry', function($resource, APIHost) {
        return $resource(APIHost + '/api/v1/entries.json', {id: '@id'}, {update: {method: 'PUT'}});
    })
    .factory('ServiceUser', function($resource, APIHost) {
        return $resource(APIHost + '/api/v1/service_users.json', {id: '@id'}, {update: {method: 'PUT'}});
    });
