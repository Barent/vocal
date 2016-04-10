this.Events = new Mongo.Collection("events");

this.Events.userCanInsert = function(userId, doc) {
	return Users.isInRoles(userId, ["admin","manager","user"]);
};

this.Events.userCanUpdate = function(userId, doc) {
	return userId && (doc.createdBy == userId || Users.isInRoles(userId, ["admin","manager"]));
};

this.Events.userCanRemove = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["admin","manager"]);
};

this.Schemas = this.Schemas || {};

this.Schemas.Events = new SimpleSchema({
	title: {
		label: "Title",
		type: String
	},
	startdate: {
		label: "Start Date",
		type: String
	},
	starttime: {
		label: "Start Time",
		type: String
	},
	contactId: {
		label: "contact",
		type: String,
		optional: true
	},
	Notes: {
		label: "Notes",
		type: String,
		optional: true
	}
});

this.Events.attachSchema(this.Schemas.Events);
