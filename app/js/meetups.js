var MeetupsCollection = Backbone.Collection.extend({
	model: Meetup,

	url: function() {
		var url = 'https://api.meetup.com/2/groups?member_id=' + MeetupRaffler.userMeetupId + '&access_token=' + authorisationModel.get('access_token');
		if (!MeetupRaffler.useMeetupWebServices) {
			url = '/app/data/meetups.json';
		}
		return url;
	},

	comparator: function(meetup) {
		return meetup.get('name');
	},

	parse: function(response) {
		return response.results;
	}
});

var MeetupsView = Backbone.View.extend({
	el: '#template',
	render: function() {
		var template = $('#meetups').html();
		this.$el.html(_.template(template));
		var itemlist = this.$el.find('#meetups-list');
		_(this.collection.models).each(function(meetup) {
			itemlist.append(new MeetupsItemView({model: meetup}).render().el);
		}, this);
		return this;
	}
});

var MeetupsItemView = Backbone.View.extend({
	render: function() {
		var template = $('#meetups-item').html();
		this.$el.html(_.template(template, this.model.toJSON()));
		return this;
	}
});
