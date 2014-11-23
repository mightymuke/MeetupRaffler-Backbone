window.MeetupRaffler = {

	useMeetupWebServices: true,       // If false will used cached data files

	userMeetupId: 69467752,           // Users meetup ID

	htmlTemplates: [
		'partials/index.html',
		'partials/meetups.html',
		'partials/meetup.html'
	],

	urls: {
		meetup: function(userId, authToken) {
			var url = '/app/data/meetup.json';
			if (MeetupRaffler.useMeetupWebServices) {
				url = 'https://api.meetup.com/2/events?&status=upcoming&limited_events=true&page=1&group_id=' + userId + '&access_token=' + authToken;
			}
			return url;
		},

		meetups: function(userId, authToken) {
			var url = '/app/data/meetups.json';
			if (MeetupRaffler.useMeetupWebServices) {
				url = 'https://api.meetup.com/2/groups?member_id=' + userId + '&access_token=' + authToken;
			}
			return url;
		},			

		meetupRsvps: function(userId, authToken) {
			var url = '/app/data/rsvps.json';
			if (!MeetupRaffler.useMeetupWebServices) {
				var url = 'https://api.meetup.com/2/rsvps?&rsvp=yes&event_id=' + userId + '&access_token=' + authToken;
			}
			return url;
		},

		winners: function() {
			return '/app/data/winners.json';
		},

		login: function() {
			var url = "/app/index.html#/login#expires_in=3600&token_type=bearer&access_token=offline";
			if (MeetupRaffler.useMeetupWebServices) {
				url = "https://secure.meetup.com/oauth2/authorize?client_id=m61ttgfkb90dvso8choqa8sltr&response_type=token&redirect_uri=http%3A%2F%2Flocalhost:8003%2Fapp%2Findex.html%23%2Flogin";
			}
			return url;
		},

		logout: function() {
			return "/app/index.html#/logout";
		}
	},

	initialize: function() {
		// Load up all the HTML templates
		$.each(this.htmlTemplates, function() {
			$.ajax({
				async: false,
				type: 'GET',
				url: this,
				success: function(resp) {
					$('body').append(resp);
				}
			});
		});
	}
};

MeetupRaffler.Notifier = new NotificationManager(MeetupRaffler);

MeetupRaffler.Helpers = {};

MeetupRaffler.initialize();
