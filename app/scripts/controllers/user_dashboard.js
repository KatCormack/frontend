'use strict';

angular.module('buddyClientApp')
    .controller('UserDashboardCtrl', function ($scope, CurrentUser, Entry, ServiceUser, Auth, $state, Clinician, HopscotchTour) {
        
        $scope.user = CurrentUser.user();
        $scope.auth = Auth;
        $scope.search = function() {
            $state.go('clinician.search', {search: $scope.search_term});
        };

        $scope.clinicians = Clinician.query();
        if (hopscotch.getState() === 'welcome-to-buddy:1') {
        	hopscotch.getCurrTour();
        	var tourStep = hopscotch.getCurrStepNum();
        	hopscotch.startTour(HopscotchTour.tour(), tourStep);
        }
        $scope.addServiceUser = function() {
        	var tourStep = hopscotch.getCurrStepNum();
        	state.go('clinician.newServiceUser');
        	if (tourStep === 2) {
        		hopscotch.showStep(3);
        	}
        }
    });
