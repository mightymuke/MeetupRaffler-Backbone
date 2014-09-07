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

var MeetupRafflerRouter = Backbone.Router.extend({
	routes: {
		'': 'index',
		'meetups': 'meetups',
		'meetups/:groupId': 'meetup',
		'login#:credentials': 'authorisation',
		'logout': 'logout'
	},

	authorisation: function(credentials) {
		authorisationModel.saveAuthorisation(credentials);
		if (authorisationModel.userIsLoggedIn()) {
			MeetupRaffler.Notifier.notify('information', 'Successfully logged in!');
			loginView.render();
			this.navigate("/meetups", {trigger: true});
		}
	},

	logout: function() {
		authorisationModel.clearAuthorisation();
		MeetupRaffler.Notifier.notify('information', 'Thanks for visiting. You have been signed out.');
		loginView.render();
		this.navigate("/", {trigger: true});
	},

	index: function() {
		var indexView = new IndexView({
			model: indexModel
		});
		indexView.render();
	},

	meetups: function() {
		if (authorisationModel.userIsLoggedIn()) {
			var meetupsCollection = new MeetupsCollection();
			meetupsCollection.fetch({
				success: function(meetups) {
					var meetupsView = new MeetupsView({
						collection: meetups
					});
					meetupsView.render();
				}
			});
		}
	},

	meetup: function(groupId) {
		if (authorisationModel.userIsLoggedIn()) {
			// var meetupModel = new Meetup(dataMeetup.results[0]);
			// meetupModel.set('rsvps', dataMeetupRsvps.results);
			// var meetupView = new MeetupView({
			// 	model: meetupModel,
			// });
			// meetupView.render();

			var meetupModel = new Meetup({
				id: groupId
			});
			meetupModel.fetch()
				.then(
					function(meetupDetails) {
						meetupModel.set(meetupDetails.results[0]);
						var rsvpsModel = new MeetupRsvp({
							id: meetupModel.get('id')
						});
						return rsvpsModel.fetch();
					})
				.then(
					function(rsvps) {
						meetupModel.set('rsvps', MeetupRsvp.explodeTheGuests(rsvps.results));
						var meetupView = new MeetupView({
							model: meetupModel
						});
						meetupView.render();
					});
		}
	}
});

var OfflineBannerView = Backbone.View.extend({
	el: 'div.offline-alert',

	render: function() {
		if (!MeetupRaffler.useMeetupWebServices) {
			this.$el.html('<p>Offline Mode</p>');
			this.$el.removeClass('hide-me');
		}
		return this;
	}
});

MeetupRaffler.initialize();

var offlineBannerView = new OfflineBannerView();
offlineBannerView.render();

var loginView = new LoginView();
loginView.render();

var router = new MeetupRafflerRouter();
Backbone.history.start();
