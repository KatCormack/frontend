'use strict';

angular.module('buddyClientApp')
    .controller('MainCtrl', function ($scope, $state, Auth) {
        $scope.myInterval = 0;
        var slides = $scope.slides = [{
            image: '/images/vision-chart.png',
            title: 'The future is bridging formal and informal care',
            text_1: "Buddy believes the best outcomes are realised when we bring together formal professional-led services, and informal people-powered care.",
            text_2: "We want to see the NHS benefit from the emergence of cheaper, accessible, consumer technologies, and we want to see technology benefit from the experience and human support that professionals can best provide.",
        },
        {
            image: '/images/vision-chart2.png',
            title: 'Services should wrap around life, not life around therapy',
            text_1: "We believe the rise of mobile phones is giving us an opportunity for therapy to be more than something you go to. Or even something that you sit in front of a computer and do, somehow apart from the rest of your life.",
            text_2: "Buddy uses SMS to make keeping a record of how you are feeling and how you are doing, a simple task that can be accomplished whenever, wherever you are, quickly and discretely. This is care with the person and their life at the centre.",
        },
        {
            image: '/images/vision-chart3.png',
            title: 'Give people control of their sessions and they will come',
            text_1: "In this time of constraint, it has never been more important to improve service efficiencies, and the high number of missed appointments is a key problem. Our insight is that the problem isn\'t people forgetting, but that they don\'t feel in control of the sessions.",
            text_2: "Buddy is built on the principle that appointment reminders are good (which is why we have them), but that people are more likely to turn up if we can enable them to set the agenda for their session and they are driving their own care.",
        },
        {
            image: '/images/vision-chart4.png',
            title: 'Just enough technology. Never enough design.',
            text_1: "Health software has too often been built from a systems-centric view, and rarely considers a user\'s point of view. This is the road to expensive IT projects that people never wanted to or can\'t use.",
            text_2: "Buddy believes in starting with users and giving them a delightful experience. We\'ll never succumb to building lots of features, or assuming everyone has a smartphone, which is why we\'ve focused Buddy on really simple text messaging.",
        }
        ];
    });
