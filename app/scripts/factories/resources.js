'use strict';

angular.module('buddyClientApp')
    .factory('Password', function($resource, APIHost) {
        return $resource(APIHost + '/api/v1/passwords.json');
    })
    .factory('Entry', function($resource, APIHost) {
        return $resource(APIHost + '/api/v1/entries.json', {id: '@id'}, {update: {method: 'PUT'}});
    })
    .factory('Clinician', function($resource, APIHost) {
        return $resource(APIHost + '/api/v1/clinicians/:id.json', {id: '@id'}, {update: {method: 'PUT'}});
    })
    .factory('ServiceUser', function($resource, APIHost) {
        return $resource(APIHost + '/api/v1/service_users/:id.json', {id: '@id'}, {update: {method: 'PUT'}});
    })
    .factory('ServiceUserEntry', function($resource, APIHost) {
        return $resource(APIHost + '/api/v1/service_users/:service_user_id/entries.json', {id: '@id', service_user_id: '@service_user_id'}, {update: {method: 'PUT'}});
    })
    .factory('ServiceUserSession', function($resource, APIHost) {
        return $resource(APIHost + '/api/v1/service_users/:service_user_id/sessions.json', {id: '@id', service_user_id: '@service_user_id'}, {update: {method: 'PUT'}});
    })
    .factory('Team', function($resource, APIHost) {
        return $resource(APIHost + '/api/v1/accounts/:id.json', {id: '@id'}, {update: {method: 'PUT'}});
    })
    .factory('TeamClinician', function($resource, APIHost) {
        return $resource(APIHost + '/api/v1/accounts/:account_id/clinicians.json', {id: '@id', account_id: '@account_id'}, {update: {method: 'PUT'}});
    })
    .factory('TeamServiceUser', function($resource, APIHost) {
        return $resource(APIHost + '/api/v1/accounts/:account_id/service_users.json', {id: '@id', account_id: '@account_id'}, {update: {method: 'PUT'}});
    });
