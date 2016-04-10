Meteor.publish("events", function() {
	if(Users.isInRoles(this.userId, ["admin"])) {
		return Events.publishJoinedCursors(Events.find({}, {}));
	}
	return Events.publishJoinedCursors(Events.find({createdBy:this.userId}, {}));
});

Meteor.publish("events_empty", function() {
	if(Users.isInRoles(this.userId, ["admin"])) {
		return Events.publishJoinedCursors(Events.find({_id:null}, {}));
	}
	return Events.publishJoinedCursors(Events.find({_id:null,createdBy:this.userId}, {}));
});

Meteor.publish("event", function(Id) {
	if(Users.isInRoles(this.userId, ["admin"])) {
		return Events.publishJoinedCursors(Events.find({_id:Id}, {}));
	}
	return Events.publishJoinedCursors(Events.find({_id:Id,createdBy:this.userId}, {}));
});

