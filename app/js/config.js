window.MeetupRaffler = {

	useMeetupWebServices: false,     // If false will used cached data files

	userMeetupId: 69467752,          // Users meetup ID

	htmlTemplates: [
		'partials/index.html',
		'partials/meetups.html',
		'partials/meetup.html'
	],

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
