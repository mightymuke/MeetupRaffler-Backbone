var AuthorisationModel = Backbone.Model.extend({
	access_token: '',
	isLoggedIn: false,
	userIsLoggedIn: function() {
		if (!this.get('isLoggedIn')) {
			this.login();
			return false;
		}
		return true;
	},
	saveAuthorisation: function(queryString) {
		var dataItems = queryString.split('&');
		for (var i in dataItems) {
			var dataItem = dataItems[i].split('=');
			if (dataItem.length !== 2) {
				continue;
			}
			this.set(dataItem[0], dataItem[1]);
		}
		this.set('isLoggedIn', true);
	},
	login: function() {
		window.location.replace("https://secure.meetup.com/oauth2/authorize?client_id=m61ttgfkb90dvso8choqa8sltr&response_type=token&redirect_uri=http%3A%2F%2Flocalhost:8003%2Fapp%2Findex.html%23%2Flogin");
	}
});

var authorisationModel = new AuthorisationModel();

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
