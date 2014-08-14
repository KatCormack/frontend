'use strict';

angular.module('buddyClientApp')
    .factory('Entry', function($resource, APIHost) {
        return $resource(APIHost + '/api/v1/entries.json', {id: '@id'}, {update: {method: 'PUT'}});
    })
    .factory('ServiceUser', function($resource, APIHost) {
        return $resource(APIHost + '/api/v1/service_users.json', {id: '@id'}, {update: {method: 'PUT'}});
    })
    .factory('ServiceUserEntry', function($resource, APIHost) {
        return $resource(APIHost + '/api/v1/service_users/:service_user_id/entries.json', {id: '@id', service_user_id: '@service_user_id'}, {update: {method: 'PUT'}});
    })
    .factory('ServiceUserSession', function($resource, APIHost) {
        return $resource(APIHost + '/api/v1/service_users/:service_user_id/sessions.json', {id: '@id', service_user_id: '@service_user_id'}, {update: {method: 'PUT'}});
    });
