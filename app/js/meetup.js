var Meetup = Backbone.Model.extend({
	defaults: {
		isSelectingPrizeWinner: false
	},

	url: function() {
		var url = 'https://api.meetup.com/2/events?&status=upcoming&limited_events=true&page=1&group_id=' + this.get('id') + '&access_token=' + authorisationModel.get('access_token');
		if (!MeetupRaffler.useMeetupWebServices) {
			url = '/app/data/meetup.json';
		}
		return url;
	}
});

var MeetupRsvp = Backbone.Model.extend({
	url: function() {
		var url = 'https://api.meetup.com/2/rsvps?&rsvp=yes&event_id=' + this.get('id') + '&access_token=' + authorisationModel.get('access_token');
		if (!MeetupRaffler.useMeetupWebServices) {
			url = '/app/data/rsvps.json';
		}
		return url;
	}
},
{
	explodeTheGuests: function(rsvps) {
		return MeetupRaffler.Helpers.explodeTheGuests(rsvps);
	}
});

var Winners = Backbone.Model.extend({
	url: function() {
		return '/app/data/winners.json';
	}
});

var MeetupRsvpsCollection = Backbone.Collection.extend({
	model: MeetupRsvp,

	comparator: function(rsvp) {
		return rsvp.get('member').name;
	}
});

var MeetupView = Backbone.View.extend({
	el: '#template',

	render: function() {
		var template = $('#meetup').html();
		this.$el.html(_.template(template, this.model.toJSON()));
		this.$el.find('div.random-member-selector').append(new RandomMemberSelectorView({
			model: this.model
		}).render().el);
		this.$el.find('#member-listings').append(new MeetupRsvpsView({
			collection: new MeetupRsvpsCollection(this.model.get('rsvps'))
		}).render().el);
		return this;
	}
});

var MeetupRsvpsView = Backbone.View.extend({
	render: function() {
		var rsvplist = '';
		var template = $('#meetup-rsvps').html();
		_(this.collection.models).each(function(rsvp) {
			rsvplist += _.template(template, rsvp.toJSON());
		}, this);
		this.$el.html(rsvplist);
		return this;
	}
});

var RandomMemberSelectorView = Backbone.View.extend({
	el: 'div.random-member-selector',

	events: {
		'click .select-winner': 'getRandomMember',
		'click .reset-tiles': 'resetMemberTiles'
	},

	getRandomMember: function() {
		MeetupRaffler.Helpers.getRandomMember(this.model, this.model.get('winners'));
		this.render();
		return false;
	},

	resetMemberTiles: function() {
		MeetupRaffler.Helpers.clearWinner();
		this.model.set('isSelectingPrizeWinner', false);
		this.render();
		return false;
	},

	render: function() {
		if (this.model.get('isSelectingPrizeWinner')) {
			this.$el.html('<a href="" class="reset-tiles">Reset</a>');
		} else {
			this.$el.html('<a href="" class="select-winner">Random Member</a>');
		}
		return this;
	}
});
