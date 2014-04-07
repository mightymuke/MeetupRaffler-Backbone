var MeetupRafflerRouter = Backbone.Router.extend({
	routes: {
		'': 'index',
		'meetups': 'meetups',
		'meetups/:groupId': 'meetup'
	},
	index: function() {
		var indexView = new IndexView({
			model: indexModel,
		});
		indexView.render();
	},
	meetups: function() {
		var meetupsView = new MeetupsView({
			collection: new MeetupsCollection(dataMeetups.results),
		});
		meetupsView.render();
	},
	meetup: function(groupId) {
		var meetupModel = new Meetup(dataMeetup.results[0]);
		meetupModel.set('rsvps', dataMeetupRsvps.results);
		var meetupView = new MeetupView({
			model: meetupModel,
		});
		meetupView.render();
	}
});

var router = new MeetupRafflerRouter();
Backbone.history.start();
