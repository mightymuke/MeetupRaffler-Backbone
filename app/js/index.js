var IndexView = Backbone.View.extend({
 	isEditing: false,

	initialize: function() {
		this.model.on('change', function() {
			this.render();
		}, this);
	},

	events: {
		'click button': 'handleClick',
		'change input': 'updateTitle'
	},

	handleClick: function() {
		//if (this.isEditing) {
			this.isEditing = !this.isEditing;
			this.render();
		//}
	},

	updateTitle: function() {
		this.model.set('title', this.$el.find(input).val());
	},

	render: function() {
		var template = $('#index').html();
		this.$el.html(_.template(template, this.model.toJSON()));
		return this;
	}
})

var indexModel = new Backbone.Model({
	title: 'Dashboard'
});

var index = new IndexView({
	model: indexModel,
	el: '#template'
});


// var TitleView = Backbone.View.extend({
// 	initialize: function() {
// 		this.model.on('change', function() {
// 			this.render();
// 		}, this);
// 	},
// 	render: function() {
// 		this.$el.html(this.model.get('title'));
// 		return this;
// 	}
// });

// var title = new Backbone.Model({title: 'Dashboard'});

// var tv = new TitleView({
// 	model: title,
// 	el: '#page-title'
// })

// tv.render();

// var TitleEditorView = Backbone.View.extend({
// 	isEditing: false,
// 	events: {
// 		'click button': 'handleClick',
// 		'change input': 'updateTitle'
// 	},
// 	handleClick: function() {
// 		//if (this.isEditing) {
// 			this.isEditing = !this.isEditing;
// 			this.render();
// 		//}
// 	},
// 	updateTitle: function() {
// 		this.model.set('title', this.$el.find(input).val());
// 	},
// 	render: function() {
// 		if (this.isEditing) {
// 			this.$el.html('<button>Done</button><div id="title-edit"><input type="text" ng-model="title"></input></div>');
// 		} else {
// 			this.$el.html('<button>Edit</button>');
// 		}
// 		return this;
// 	}
// });

// var tev = new TitleEditorView({
// 	model: title
// });
// $('.index-edit').append(tev.render().el);
