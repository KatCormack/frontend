'use strict';

angular.module('buddyClientApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ui.router',
    'ui.bootstrap',
    'angularMoment',
    'angularUtils.filters.ordinalDate'
])
    .constant('APIHost', '')
    .constant('AccessLevels',{
        anon: 0,
        user: 1,
        serviceUser: 2,
        clinician: 3,
        clinicianAdmin: 4
    })
    .run(function($rootScope, $state, Auth){
        $rootScope._ = _;
        $rootScope.$on('$stateChangeStart', function(event, toState) {
            if (!Auth.authorize(toState.data.access)) {
                event.preventDefault();
                $state.go('anon.login');
            }
        });
    })
    .config(function ($urlRouterProvider, $locationProvider, $httpProvider, $stateProvider, AccessLevels, $uiViewScrollProvider) {
        /* without useAnchorScroll() the application scrolls to where
         * the child <ui-view> is. This is not the behaviour that we
         * want */
        $uiViewScrollProvider.useAnchorScroll();
        /* Fix IE stupid caching */
        $httpProvider.defaults.headers.common['Cache-Control'] = 'no-cache';
        /* Cross domain AJAX requests? probably have to remove this
         * because IE *still* doesnt like this */
        $httpProvider.defaults.useXDomain = true;
        $httpProvider.interceptors.push('AuthInterceptor');
        delete $httpProvider.defaults.headers.common['X-Requested-With'];

        $stateProvider.state('anon', {
            abstract: true,
            template: '<div ui-view="" autoscroll="true"></div>',
            data: {
                access: AccessLevels.anon
            }
        }).state('anon.home', {
            url: '/',
            templateUrl: 'views/main.html',
            controller: 'MainCtrl',
            activetab: 'home'
        }).state('anon.login', {
            url: '/login',
            templateUrl: '/views/login.html',
            controller: 'LoginCtrl',
            activetab: 'login'
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
            template: '<div ui-view="" autoscroll="true">',
            data: {
                access: AccessLevels.user
            }
        }).state('user.dashboard', {
            url: '/dashboard',
            templateUrl: '/views/user_dashboard.html',
            controller: 'UserDashboardCtrl',
            activetab: 'dashboard'
        });

        $stateProvider.state('serviceUser', {
            abstract: true,
            template: '<div ui-view="" autoscroll="true">',
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
            template: '<div ui-view="" autoscroll="true">',
            data: {
                access: AccessLevels.clinician
            }
        }).state('clinician.serviceUsers', {
            url: '/service_users',
            templateUrl: '/views/service_users/index.html',
            controller: 'ServiceUsersCtrl',
            activetab: 'serviceUsers'
        }).state('clinician.newServiceUser', {
            url: '/service_users/new',
            templateUrl: '/views/service_users/new.html',
            controller: 'NewServiceUsersCtrl',
            activetab: 'serviceUsers'
        }).state('clinician.serviceUserDiary', {
            url: '/service_users/:id',
            templateUrl: '/views/service_users/show.html',
            controller: 'ServiceUserDiaryCtrl',
            activetab: 'serviceUsers'
        }).state('clinician.editServiceUser', {
            url: '/service_users/:id/edit',
            templateUrl: '/views/service_users/edit.html',
            controller: 'EditServiceUserCtrl',
            activetab: 'serviceUsers'
        }).state('clinician.deactivateServiceUser', {
            url: '/service_users/:id/deactivate?returnTo',
            templateUrl: '/views/service_users/deactivate.html',
            controller: 'DeactivateServiceUserCtrl',
            activetab: 'serviceUsers'
        }).state('clinician.teams', {
            url: '/teams',
            templateUrl: '/views/teams/index.html',
            controller: 'TeamsCtrl',
            activetab: 'teams'
        }).state('clinician.team', {
            url: '/teams/:team_id',
            templateUrl: '/views/teams/show.html',
            controller: 'TeamCtrl',
            activetab: 'teams'
        }).state('clinician.search', {
            url: '/search/:search',
            templateUrl: '/views/search.html',
            controller: 'SearchCtrl'
        });

        $stateProvider.state('clinicianAdmin', {
            abstract: true,
            template: '<div ui-view="" autoscroll="true">',
            data: {
                access: AccessLevels.clinicianAdmin
            }
        }).state('clinicianAdmin.clinicians', {
            url: '/clinicians',
            templateUrl: '/views/clinicians/index.html',
            controller: 'CliniciansCtrl',
            activetab: 'clinicians'
        }).state('clinicianAdmin.editClinician', {
            url: '/clinicians/:id/edit',
            templateUrl: '/views/clinicians/edit.html',
            controller: 'EditClinicianCtrl',
            activetab: 'clinicians'
        }).state('clinicianAdmin.addClinician', {
            url: '/clinicians/new',
            templateUrl: '/views/clinicians/new.html',
            controller: 'NewClinicianCtrl',
            activetab: 'clinicians'
        });

        $urlRouterProvider.otherwise('/');
        $locationProvider.html5Mode(true);

    });


String.prototype.pad = function(width, z) {
    z = z || '0';
    return this.length >= width ? this : new Array(width - this.length + 1).join(z) + this;
};


if(!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(needle) {
        for(var i = 0; i < this.length; i++) {
            if(this[i] === needle) {
                return i;
            }
        }
        return -1;
    };
}

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};
