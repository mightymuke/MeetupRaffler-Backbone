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
			var meetupsView = new MeetupsView({
				collection: new MeetupsCollection(dataMeetups.results),
			});
			meetupsView.render();
		}
	},
	meetup: function(groupId) {
		if (authorisationModel.userIsLoggedIn()) {
			var meetupModel = new Meetup(dataMeetup.results[0]);
			meetupModel.set('rsvps', dataMeetupRsvps.results);
			var meetupView = new MeetupView({
				model: meetupModel,
			});
			meetupView.render();
		}
	}
});

var router = new MeetupRafflerRouter();
Backbone.history.start();

var loginView = new LoginView();
loginView.render();
