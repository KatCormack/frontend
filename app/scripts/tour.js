angular.module('buddyClientApp')
    .factory('HopscotchTour', function() {
        return {
            tour: function(state, scope) {
                return {
                    id: "welcome-to-buddy",
                    steps: [
                        {
                            title: "Buddy",
                            content: "Follow this quick tutorial to find out how to use Buddy.",
                            target: ".navbar-brand",
                            placement: "bottom",
                            multipage: true,
                            onNext: function() {
                                state.go('user.dashboard');
                                return false;
                            }
                        },
                        {
                            title: "Dashboard",
                            content: "From here you can access all the different parts of Buddy. The first thing you will need to do is add a Service User",
                            target: ".dashboard-header",
                            placement: "left"
                        },
                        {
                            title: "Add Service User",
                            content: "Click here to create a new Service User",
                            target: ".add-service-user",
                            placement: "bottom",
                            showNextButton: false,
                            multipage: true
                        },
                        {
                            title: "Adding a Service User",
                            content: "Just fill out the basic details, set your next session time",
                            target: ".create-service-user",
                            placement: "bottom",
                            multipage: true,
                            onNext: function() {
                                state.go('clinician.serviceUsers');
                                return false;
                            }
                        },
                        {
                            title: "Users",
                            content: "Here we have the list of users, you can see just your users by clicking on the sessions tab or all the users in your team by clicking on the A-Z tab",
                            target: ".navbar-brand",
                            placement: "bottom"
                        },
                        {
                            title: "Users",
                            content: "You can reschedule a Service Users next appointment, change their settings or view their diary by clicking on their name. Click on the example user to continue",
                            target: ".list-row .name",
                            placement: "bottom",
                            showNextButton: false,
                            multipage: true
                        },
                        {
                            title: 'Buddy Diary',
                            content: 'This is an example of what the Diary would look like once the Service User has added some entries',
                            target: '.nav-item.diaryEntries .title',
                            placement: 'right'
                        },
                        {
                            title: 'Scroll to view entries',
                            content: 'From here you can look back over the week to see what your client has been up to. Click on a Session to see the diary entries leading up to it and a Session Plan if the user has created one',
                            target: '#diaryEntries .session:first',
                            placement: 'left'
                        },
                        {
                            title: 'Filter entries',
                            content: 'Use the filters to help spot patterns in your service users behaviour',
                            target: '.rating-selector-one',
                            placement: 'right',
                            onNext: function() {
                                scope.show('textMessage');
                            }
                        },
                        {
                            title: 'Text Message',
                            content: 'You can change the frequency or the message of your text that your user will receive',
                            target: '.nav-item.textMessage',
                            placement: 'bottom',
                            onNext: function() {
                                scope.show('goals');
                            }
                        },
                        {
                            title: 'Goals',
                            content: 'Add goals that your service user is working towards. You can even set up text reminders for a goal',
                            target: '.nav-item.goals',
                            placement: 'bottom'
                        }
                    ]
                };
            }
        };
    });
