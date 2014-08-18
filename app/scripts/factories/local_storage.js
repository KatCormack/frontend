'use strict';

angular.module('buddyClientApp')
    .constant('ExpiryTime', 3600000)
    .factory('LocalService', function(ExpiryTime) {
        return {
            get: function(key) {
                var expiry = this.getWithoutExpiry(key + "Expiry")
                if (expiry && expiry > new Date().getTime()) {
                    this.setWithoutExpiry(key + "Expiry", new Date().getTime() + ExpiryTime)
                    return this.getWithoutExpiry(key)
                }
            },
            set: function(key, val) {
                this.setWithoutExpiry(key + "Expiry", new Date().getTime() + ExpiryTime)
                return this.setWithoutExpiry(key, val);
            },
            unset: function(key) {
                return localStorage.removeItem(key);
            },
            getWithoutExpiry: function(key) {
                return localStorage.getItem(key);
            },
            setWithoutExpiry: function(key, val) {
                return localStorage.setItem(key, val);
            }
        };
    });
