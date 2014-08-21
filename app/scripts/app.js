'use strict';

angular.module('buddyClientApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ui.router',
    'ui.bootstrap'
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
            templateUrl: '/views/login.html',
            controller: 'LoginCtrl'
        }).state('anon.passwordReset', {
            url: '/passwords/forgot',
            templateUrl: '/views/passwords/forgot.html',
            controller: 'PasswordForgotCtrl'
        }).state('anon.passwordSent', {
            url: '/passwords/sent/:email_or_mobile',
            templateUrl: '/views/passwords/sent.html',
            controller: 'PasswordSentCtrl',
        }).state('anon.emailPasswordReset', {
            url: '/p/:userId/:token',
            templateUrl: '/views/passwords/email_reset.html',
            controller: 'EmailPasswordResetCtrl'
        });

        $stateProvider.state('user', {
            abstract: true,
            template: '<ui-view>',
            data: {
                access: AccessLevels.user
            }
        }).state('user.dashboard', {
            url: '/dashboard',
            templateUrl: '/views/user_dashboard.html',
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
            templateUrl: '/views/diary.html',
            controller: 'DiaryCtrl'
        });

        $stateProvider.state('clinician', {
            abstract: true,
            template: '<ui-view>',
            data: {
                access: AccessLevels.clinician
            }
        }).state('clinician.serviceUsers', {
            url: '/service_users',
            templateUrl: '/views/service_users.html',
            controller: 'ServiceUsersCtrl'
        }).state('clinician.teams', {
            url: '/teams',
            templateUrl: '/views/teams/index.html',
            controller: 'TeamsCtrl'
        }).state('clinician.team', {
            url: '/teams/:team_id',
            templateUrl: '/views/teams/show.html',
            controller: 'TeamCtrl'
        });

        $stateProvider.state('clinicianAdmin', {
            abstract: true,
            template: '<ui-view>',
            data: {
                access: AccessLevels.clinicianAdmin
            }
        }).state('clinicianAdmin.clinicians', {
            url: '/clinicians',
            templateUrl: '/views/clinicians.html',
            controller: 'CliniciansCtrl'
        });

        $urlRouterProvider.otherwise('/');
        $locationProvider.html5Mode(true);
    });
