Meteor.publish("contacts", function() {
	if(Users.isInRoles(this.userId, ["admin","manager"])) {
		return Contacts.find({}, {});
	}
	return Contacts.find({createdBy:this.userId}, {});
});

Meteor.publish("contacts_empty", function() {
	if(Users.isInRoles(this.userId, ["admin","manager"])) {
		return Contacts.find({_id:null}, {});
	}
	return Contacts.find({_id:null,createdBy:this.userId}, {});
});

Meteor.publish("contact", function(contactId) {
	if(Users.isInRoles(this.userId, ["admin","manager"])) {
		return Contacts.find({_id:contactId}, {});
	}
	return Contacts.find({_id:contactId,createdBy:this.userId}, {});
});

