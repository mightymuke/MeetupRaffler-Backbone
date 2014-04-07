var Meetup = Backbone.Model.extend();

var meetup = new Meetup(dataMeetup.results[0]);
meetup.set('rsvps', dataMeetupRsvps.results);
console.log(meetup.toJSON());
