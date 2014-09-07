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

	login: function() {
		window.location.replace("https://secure.meetup.com/oauth2/authorize?client_id=m61ttgfkb90dvso8choqa8sltr&response_type=token&redirect_uri=http%3A%2F%2Flocalhost:8003%2Fapp%2Findex.html%23%2Flogin");
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
	 	MeetupRaffler.Notifier.notify('information', 'Successfully logged in!');
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

	events: {
		'click a.login': 'login',
		'click a.logout': 'logout',
	},

	login: function() {
		authorisationModel.login();
	},

	logout: function() {
		this.model.set('isLoggedIn', false);
		this.model.set('access_token', '');
		this.render();
		MeetupRaffler.Notifier.notify('information', 'Thanks for visiting. You have been signed out.');
		MeetupRafflerRouter.navigate("/", true);
	},

	render: function() {
		if (!this.model.get('isLoggedIn')) {
			this.$el.html('<a href="#" class="login">Login</a>');
		} else {
			this.$el.html('<a href="#" class="logout">Logout</a>');
		}
		return this;
	}
});
