'use strict';

angular.module('buddyClientApp')
    .factory('ExampleServiceUser', function() {
        return {
            generate: function(user) {
                var now = new Date();
                var current = new Date(now.getFullYear(), now.getMonth()+1, 1, 12, 30, 0);
                return {
                    id: 'example',
                    full_name: 'Example User',
                    first_name: 'Example',
                    last_name: 'User',
                    buddy_id: 'TU.12345',
                    clinician_id: user.id,
                    current_session_time: current.toString(),
                    sessionScheduledTime: current.toString(),
                    sessions: [
                        {
                            entries: [
                                {
                                    rating: 1,
                                    body: 'Not so good a day - I fell down, hurt my arm',
                                    created_at: now,
                                    rating_class: 'rating-one'

                                }
                            ],
                            scheduled_time: current,
                            index: 2,
                            progress: {
                                'rating-one': '{width: "100%"}'
                            }
                        },
                        {
                            scheduled_time: new Date(2014, 10, 15, 12, 30, 0),
                            entries: [
                                {
                                    rating: 5,
                                    body: 'Very good, I had a really good day at school, got an A on my Math test',
                                    created_at: new Date(2014, 10, 14),
                                    rating_class: 'rating-five'
                                },
                                {
                                    rating: 4,
                                    body: 'Not bad - mom made my favourite, Spaghetti!',
                                    created_at: new Date(2014, 10, 13),
                                    rating_class: 'rating-four'
                                },
                            ],
                            progress: {
                                'rating-four': '{width: "50%"}',
                                'rating-five': '{width: "50%"}'
                            },
                            index: 1

                        }
                    ]
                };
            }
        };

    });
