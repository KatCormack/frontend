'use strict';

angular.module('buddyClientApp')
    .constant('ExpiryTime', 3600)
    .factory('LocalService', function(ExpiryTime) {
        return {
            get: function(key) {
                var expiryKey = key + 'Expiry'
                if (expiry = localStorage.getWithoutExpiry(expiryKey)) {
                    this.setWithoutExpiry(expiryKey, new Date().getTime() + ExpiryTime);
                    return this.getWithoutExpiry(expiryKey);
                } else {
                    return undefined;
                }
            },
            set: function(key, val) {
                this.setWithoutExpiry(expiryKey, new Date().getTime() + ExpiryTime)
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
