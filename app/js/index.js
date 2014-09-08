var indexModel = new Backbone.Model({
	isEditing: false,
	title: 'Dashboard'
});

var IndexView = Backbone.Epoxy.View.extend({
	el: '#template',

	bindings: "data-bind",

	events: {
		'click button': 'handleClick'
	},

	handleClick: function() {
		this.model.set('isEditing', !this.model.get('isEditing'));
		this.render();
	},

	render: function() {
		var template = $('#index').html();
		this.$el.html(_.template(template, this.model.toJSON()));
		this.applyBindings();
		return this;
	}
});
