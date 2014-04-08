var Meetup = Backbone.Model.extend({
	url: function() {
		return 'https://api.meetup.com/2/events?&status=upcoming&limited_events=true&page=1&group_id=' + this.get('id') + '&access_token=' + authorisationModel.get('access_token');
	}
});

var MeetupRsvp = Backbone.Model.extend({
	url: function() {
		return 'https://api.meetup.com/2/rsvps?&rsvp=yes&event_id=' + this.get('id') + '&access_token=' + authorisationModel.get('access_token');
	}
},{
	explodeTheGuests: function(rsvps) {
		var guests = rsvps.filter(function(rsvp) {
			return rsvp.guests > 0;
		});

		guests.forEach(function(rsvp) {
			for (var guest = 0; guest < rsvp.guests; guest++) {
				rsvps.push({
					member: {
						name: rsvp.member.name + ' (Guest #' + (guest + 1) + ')',
						member_id: rsvp.member_id
					},
					group: rsvp.group,
					rsvp_id: rsvp.rsvp_id
				});
			}
		});

		return rsvps;
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
		console.log(this.model.toJSON());
		this.$el.html(_.template(template, this.model.toJSON()));
		this.$el.find('#meetups-rsvps').append(new MeetupRsvpsView({
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
