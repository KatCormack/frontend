angular.module('buddyClientApp')
    .factory('HopscotchTour', function() {
        return {
                id: "hello-hopscotch",
                steps: [
                {
                    title: "Buddy",
                    content: "Follow this quick tutorial to find out how to use Buddy.",
                    target: ".navbar-brand",
                    placement: "bottom"
                }
                ]
            };;
});
