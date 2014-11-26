angular.module('buddyClientApp')
    .factory('HopscotchTour', function() {
        return {
            tour: function(state) {
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
                        showNextButton: false
                    }
                    ]
                }
            }
        };
});
