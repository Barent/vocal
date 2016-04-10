this.Contacts = new Mongo.Collection("contacts");

this.Contacts.userCanInsert = function(userId, doc) {
	return Users.isInRoles(userId, ["admin","manager","user"]);
};

this.Contacts.userCanUpdate = function(userId, doc) {
	return userId && (doc.createdBy == userId || Users.isInRoles(userId, ["admin","manager"]));
};

this.Contacts.userCanRemove = function(userId, doc) {
	return userId && (doc.createdBy == userId || Users.isInRoles(userId, ["admin"]));
};

this.Schemas = this.Schemas || {};

this.Schemas.Contacts = new SimpleSchema({
	name: {
		label: "Name",
		type: String
	},
	phone: {
		label: "Phone",
		type: String,
		optional: true
	},
	email: {
		label: "E-mail",
		type: String,
		regEx: SimpleSchema.RegEx.Email,
		optional: true
	},
	note: {
		label: "Note",
		type: String,
		optional: true
	}
});

this.Contacts.attachSchema(this.Schemas.Contacts);
