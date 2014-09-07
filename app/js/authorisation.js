var AuthorisationModel = Backbone.Model.extend({

	initialize: function() {
		this.fetch();
		this.on('change', this.save, this);
	},

	userIsLoggedIn: function() {
		if (!this.get('isLoggedIn')) {
			this.login();
			return false;
		}
		return true;
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
		var loginUrl = "https://secure.meetup.com/oauth2/authorize?client_id=m61ttgfkb90dvso8choqa8sltr&response_type=token&redirect_uri=http%3A%2F%2Flocalhost:8003%2Fapp%2Findex.html%23%2Flogin";
		if (!MeetupRaffler.useMeetupWebServices) {
			loginUrl = "/app/index.html#/login#expires_in=3600&token_type=bearer&access_token=offline";
		}

		var logoutUrl = "/app/index.html#/logout";

		if (!this.model.get('isLoggedIn')) {
			this.$el.html('<a href="' + loginUrl + '" class="login">Login</a>');
		} else {
			this.$el.html('<a href="' + logoutUrl + '" class="logout">Logout</a>');
		}

		return this;
	}
});
