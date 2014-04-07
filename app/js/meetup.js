var Meetup = Backbone.Model.extend();
var MeetupRsvp = Backbone.Model.extend();

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
