'use strict';

angular.module('buddyClientApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ui.router',
])
    .constant('APIHost', 'http://localhost:3000')
    .constant('AccessLevels',{
        anon: 0,
        user: 1,
        serviceUser: 2,
        clinician: 3,
        clinicianAdmin: 4
    })
    .config(function ($urlRouterProvider, $locationProvider, $httpProvider, $stateProvider, AccessLevels) {
        $httpProvider.defaults.useXDomain = true;
        $httpProvider.interceptors.push('AuthInterceptor');
        delete $httpProvider.defaults.headers.common['X-Requested-With'];

        $stateProvider.state('anon', {
            abstract: true,
            template: '<ui-view/>',
            data: {
                access: AccessLevels.anon
            }
        }).state('anon.home', {
            url: '/',
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
        }).state('anon.login', {
            url: '/login',
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl'
        });

        $stateProvider.state('user', {
            abstract: true,
            template: '<ui-view>',
            data: {
                access: AccessLevels.user
            }
        }).state('user.dashboard', {
            url: '/dashboard',
            templateUrl: 'views/user_dashboard.html',
            controller: 'UserDashboardCtrl'
        });

        $stateProvider.state('serviceUser', {
            abstract: true,
            template: '<ui-view>',
            data: {
                access: AccessLevels.serviceUser
            }
        }).state('serviceUser.diary', {
            url: '/diary',
            templateUrl: 'views/diary.html',
            controller: 'DiaryCtrl'
        });

        $urlRouterProvider.otherwise('/');
        $locationProvider.html5Mode(true);
    });
