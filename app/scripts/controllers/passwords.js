'use strict';

angular.module('buddyClientApp')
    .controller('PasswordForgotCtrl', function($scope, $state, Password) {
        $scope.password = {};
        $scope.forgotPassword = function() {
            Password.save($scope.password, function() {
                $state.go('anon.passwordSent', {email_or_mobile: $scope.password.email_or_mobile});
            });
        };
    }).controller('PasswordSentCtrl', function($scope, $state) {
        $scope.email_or_mobile = $state.params.email_or_mobile;
    }).controller('EmailPasswordResetCtrl', function($scope, Clinician, ServiceUser, $state, Auth, Password) {
        $scope.password = {};
        $scope.forgotPassword = function() {
            Password.save($scope.password, function() {
                $state.go('anon.passwordSent', {email_or_mobile: $scope.password.email_or_mobile});
            });
        };
        $scope.user = ServiceUser.get({id: $state.params.userId, token: $state.params.token}, function() {
            /* success */
        }, function() {
            /* failed - this person is maybe a clinician */
            $scope.user = Clinician.get({id: $state.params.userId, token: $state.params.token}, function() {
                /* success */
            }, function() {
                /* no idea who this user is */
            });
        });

        $scope.resetPassword = function() {
            $scope.user.password_error =
                $scope.user.password_confirmation_error =
                false;
            var user = {};
            user.id = $scope.user.id;
            user.password = $scope.user.password;
            user.password_confirmation = $scope.user.password_confirmation;
            $('#password_confirmation').popover('destroy');

            var factory = $scope.user.type === 'Clinician' ? Clinician : ServiceUser;
            factory.update({id: $state.params.userId, token: $state.params.token, user: user}, function() {
                Auth.login({user_session: $scope.user}).success(function() {
                    $state.go('user.dashboard');
                });
            }, function(result) {

                if (result.data.password) {
                    $scope.user.password_error = true;
                } else {
                    if (result.data.password_confirmation) {
                        $scope.user.password_confirmation_error = true;
                        $('#password_confirmation').popover('show');
                    }
                }
            });
        };

    }
                 );
