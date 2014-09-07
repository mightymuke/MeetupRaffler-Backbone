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
		'login#:credentials': 'authorisation'
	},

	authorisation: function(credentials) {
		authorisationModel.saveAuthorisation(credentials);
		this.navigate("/meetups", {trigger: true});
	},

	index: function() {
		var indexView = new IndexView({
			model: indexModel
		});
		indexView.render();
	},

	meetups: function() {
		if (authorisationModel.userIsLoggedIn()) {
			// var meetupsView = new MeetupsView({
			// 	collection: new MeetupsCollection(dataMeetups.results)
			// });

			var meetupsCollection = new MeetupsCollection();
			meetupsCollection.fetch({
				success: function(collection) {
					var meetupsView = new MeetupsView({
						collection: collection
					});
					meetupsView.render();
				}
			});
			// meetupsCollection.fetch().then(
			// 	function(response) {
			// 		var meetupsView = new MeetupsView({
			// 			collection: response.results
			// 		});
			// 		meetupsView.render();
			// 	});
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

MeetupRaffler.initialize();

var router = new MeetupRafflerRouter();
Backbone.history.start();

var loginView = new LoginView();
loginView.render();
