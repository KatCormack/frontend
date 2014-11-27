'use strict';

angular.module('buddyClientApp')
	.factory('ExampleServiceUser', function() {
		return {
			full_name: 'Test User',
			buddy_id: 'TU.12345'
		};
	});