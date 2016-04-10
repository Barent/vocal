var pageSession = new ReactiveDict();

Template.Events.rendered = function() {
	
};

Template.Events.events({
	
});

Template.Events.helpers({
	
});

var EventsViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("EventsViewSearchString");
	var sortBy = pageSession.get("EventsViewSortBy");
	var sortAscending = pageSession.get("EventsViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["title", "startdate", "starttime", "contactId", "Notes"];
		filtered = _.filter(raw, function(item) {
			var match = false;
			_.each(searchFields, function(field) {
				var value = (getPropertyValue(field, item) || "") + "";

				match = match || (value && value.match(regEx));
				if(match) {
					return false;
				}
			})
			return match;
		});
	}

	// sort
	if(sortBy) {
		filtered = _.sortBy(filtered, sortBy);

		// descending?
		if(!sortAscending) {
			filtered = filtered.reverse();
		}
	}

	return filtered;
};

var EventsViewExport = function(cursor, fileType) {
	var data = EventsViewItems(cursor);
	var exportFields = ["title", "startdate", "starttime", "Notes"];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.EventsView.rendered = function() {
	pageSession.set("EventsViewStyle", "table");
	
};

Template.EventsView.events({
	"submit #dataview-controls": function(e, t) {
		return false;
	},

	"click #dataview-search-button": function(e, t) {
		e.preventDefault();
		var form = $(e.currentTarget).parent();
		if(form) {
			var searchInput = form.find("#dataview-search-input");
			if(searchInput) {
				searchInput.focus();
				var searchString = searchInput.val();
				pageSession.set("EventsViewSearchString", searchString);
			}

		}
		return false;
	},

	"keydown #dataview-search-input": function(e, t) {
		if(e.which === 13)
		{
			e.preventDefault();
			var form = $(e.currentTarget).parent();
			if(form) {
				var searchInput = form.find("#dataview-search-input");
				if(searchInput) {
					var searchString = searchInput.val();
					pageSession.set("EventsViewSearchString", searchString);
				}

			}
			return false;
		}

		if(e.which === 27)
		{
			e.preventDefault();
			var form = $(e.currentTarget).parent();
			if(form) {
				var searchInput = form.find("#dataview-search-input");
				if(searchInput) {
					searchInput.val("");
					pageSession.set("EventsViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("events.insert", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		EventsViewExport(this.events, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		EventsViewExport(this.events, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		EventsViewExport(this.events, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		EventsViewExport(this.events, "json");
	}

	
});

Template.EventsView.helpers({

	"insertButtonClass": function() {
		return Events.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.events || this.events.count() == 0;
	},
	"isNotEmpty": function() {
		return this.events && this.events.count() > 0;
	},
	"isNotFound": function() {
		return this.events && pageSession.get("EventsViewSearchString") && EventsViewItems(this.events).length == 0;
	},
	"searchString": function() {
		return pageSession.get("EventsViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("EventsViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("EventsViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("EventsViewStyle") == "gallery";
	}

	
});


Template.EventsViewTable.rendered = function() {
	
};

Template.EventsViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("EventsViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("EventsViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("EventsViewSortAscending") || false;
			pageSession.set("EventsViewSortAscending", !sortAscending);
		} else {
			pageSession.set("EventsViewSortAscending", true);
		}
	}
});

Template.EventsViewTable.helpers({
	"tableItems": function() {
		return EventsViewItems(this.events);
	}
});


Template.EventsViewTableItems.rendered = function() {
	
};

Template.EventsViewTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("events.details", {Id: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		Events.update({ _id: this._id }, { $set: values });

		return false;
	},

	"click #delete-button": function(e, t) {
		e.preventDefault();
		var me = this;
		bootbox.dialog({
			message: "Delete? Are you sure?",
			title: "Delete",
			animate: false,
			buttons: {
				success: {
					label: "Yes",
					className: "btn-success",
					callback: function() {
						Events.remove({ _id: me._id });
					}
				},
				danger: {
					label: "No",
					className: "btn-default"
				}
			}
		});
		return false;
	},
	"click #edit-button": function(e, t) {
		e.preventDefault();
		Router.go("events.edit", {Id: this._id});
		return false;
	}
});

Template.EventsViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Events.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Events.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
