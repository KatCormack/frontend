'use strict';

angular.module('buddyClientApp')
    .factory('Password', function($resource, APIHost) {
        return $resource(APIHost + '/api/v1/passwords.json');
    })
    .factory('Entry', function($resource, APIHost) {
        return $resource(APIHost + '/api/v1/entries/:id.json', {id: '@id'}, {update: {method: 'PUT'}});
    })
    .factory('Session', function($resource, APIHost) {
        return $resource(APIHost + '/api/v1/sessions/:id.json', {id: '@id'}, {update: {method: 'PUT'}});
    })
    .factory('Clinician', function($resource, APIHost) {
        return $resource(APIHost + '/api/v1/clinicians/:id.json', {id: '@id'}, {update: {method: 'PUT'}});
    })
    .factory('ClinicianServiceUser', function($resource, APIHost) {
        return $resource(APIHost + '/api/v1/clinicians/:clinician_id/service_users/:id.json', {id: '@id', clinician_id: '@clinician_id'});
    })
    .factory('ClinicianServiceUserRelationship', function($resource, APIHost) {
        return $resource(APIHost + '/api/v1/clinician_service_user_relationships.json');
    })
    .factory('Membership', function($resource, APIHost) {
        return $resource(APIHost + '/api/v1/memberships.json');
    })
    .factory('ClinicianSearch', function($resource, APIHost) {
        return $resource(APIHost + '/api/v1/clinicians/search.json');
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
    .factory('ServiceUserSearch', function($resource, APIHost) {
        return $resource(APIHost + '/api/v1/service_users/search.json');
    })
    .factory('Team', function($resource, APIHost) {
        return $resource(APIHost + '/api/v1/accounts/:id.json', {id: '@id'}, {update: {method: 'PUT'}});
    })
    .factory('TeamClinician', function($resource, APIHost) {
        return $resource(APIHost + '/api/v1/accounts/:account_id/clinicians/:id.json', {id: '@id', account_id: '@account_id'}, {update: {method: 'PUT'}});
    })
    .factory('TeamServiceUser', function($resource, APIHost) {
        return $resource(APIHost + '/api/v1/accounts/:account_id/service_users/:id.json', {id: '@id', account_id: '@account_id'}, {update: {method: 'PUT'}});
    })
    .factory('Membership', function($resource, APIHost) {
        return $resource(APIHost + '/api/v1/memberships');
    })
    .factory('ServiceUserGoal', function($resource, APIHost) {
        return $resource(APIHost + '/api/v1/service_users/:user_id/goals/:id.json', {id: '@id', user_id: '@user_id'}, {update: {method: 'PUT'}});
    })
    .factory('Goal', function($resource, APIHost) {
        return $resource(APIHost + '/api/v1/goals/:id.json', {id: '@id'}, {update: {method: 'PUT'}});
    })
    .factory('Group', function($resource, APIHost) {
        return $resource(APIHost + '/api/v1/groups/:id.json', {id: '@id'}, {update: {method: 'PUT'}});
    })
    .factory('GroupServiceUser', function($resource, APIHost) {
        return $resource(APIHost + '/api/v1/groups/:group_id/service_users.json', {group_id: '@group_id'}, {update: {method: 'PUT'}});
    })
    .factory('GroupClinician', function($resource, APIHost) {
        return $resource(APIHost + '/api/v1/groups/:group_id/clinicians.json', {group_id: '@group_id'}, {update: {method: 'PUT'}});
    })
    .factory('GroupMembership', function($resource, APIHost) {
        return $resource(APIHost + '/api/v1/groups/:group_id/group_memberships/:id.json', {group_id: '@group_id'}, {update: {method: 'PUT'}});
    });
