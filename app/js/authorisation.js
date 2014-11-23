var AuthorisationModel = Backbone.Model.extend({

	initialize: function() {
		this.fetch();
		this.on('change', this.save, this);
	},

	userIsLoggedIn: function() {
		return this.get('isLoggedIn');
	},

	clearAuthorisation: function() {
		var attributes = {};
		attributes['access_token'] = '';
		attributes['isLoggedIn'] = false;
		this.set(attributes);
	},

	saveAuthorisation: function(queryString) {
		var attributes = {};
		var dataItems = queryString.split('&');
		for (var i in dataItems) {
			var dataItem = dataItems[i].split('=');
			if (dataItem.length !== 2) {
				continue;
			}
			attributes[dataItem[0]] = dataItem[1];
		}
		attributes['isLoggedIn'] = true;
		this.set(attributes);
	},

	fetch: function() {
		this.set(JSON.parse(localStorage.getItem(this.id)));
	},

	save: function(attributes) {
		localStorage.setItem(this.id, JSON.stringify(this.toJSON()));
	},

	destroy: function(options) {
		localStorage.removeItem(this.id);
	}
});

var authorisationModel = new AuthorisationModel({
	isLoggedIn: false
});

var LoginView = Backbone.View.extend({
	el: 'li.authentication',

	model: authorisationModel,

	render: function() {
		if (!this.model.get('isLoggedIn')) {
			this.$el.html('<a href="' + MeetupRaffler.urls.login() + '" class="login">Login</a>');
		} else {
			this.$el.html('<a href="' + MeetupRaffler.urls.logout() + '" class="logout">Logout</a>');
		}
		return this;
	}
});
