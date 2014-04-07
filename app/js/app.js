var MeetupRafflerRouter = Backbone.Router.extend({
	routes: {
		'': 'index',
		'meetups': 'meetups'
	},
	index: function() {
		index.render();
	},
	meetups: function() {
		meetupsView.render();
	} 
});

var router = new MeetupRafflerRouter();
Backbone.history.start();
