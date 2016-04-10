var pageSession = new ReactiveDict();

Template.Contacts.rendered = function() {
	
};

Template.Contacts.events({
	
});

Template.Contacts.helpers({
	
});

var ContactsViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("ContactsViewSearchString");
	var sortBy = pageSession.get("ContactsViewSortBy");
	var sortAscending = pageSession.get("ContactsViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["name", "phone", "email", "note"];
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

var ContactsViewExport = function(cursor, fileType) {
	var data = ContactsViewItems(cursor);
	var exportFields = ["name", "phone", "email", "note"];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.ContactsView.rendered = function() {
	pageSession.set("ContactsViewStyle", "table");
	
};

Template.ContactsView.events({
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
				pageSession.set("ContactsViewSearchString", searchString);
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
					pageSession.set("ContactsViewSearchString", searchString);
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
					pageSession.set("ContactsViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("contacts.insert", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		ContactsViewExport(this.contacts, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		ContactsViewExport(this.contacts, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		ContactsViewExport(this.contacts, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		ContactsViewExport(this.contacts, "json");
	}

	
});

Template.ContactsView.helpers({

	"insertButtonClass": function() {
		return Contacts.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.contacts || this.contacts.count() == 0;
	},
	"isNotEmpty": function() {
		return this.contacts && this.contacts.count() > 0;
	},
	"isNotFound": function() {
		return this.contacts && pageSession.get("ContactsViewSearchString") && ContactsViewItems(this.contacts).length == 0;
	},
	"searchString": function() {
		return pageSession.get("ContactsViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("ContactsViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("ContactsViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("ContactsViewStyle") == "gallery";
	}

	
});


Template.ContactsViewTable.rendered = function() {
	
};

Template.ContactsViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("ContactsViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("ContactsViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("ContactsViewSortAscending") || false;
			pageSession.set("ContactsViewSortAscending", !sortAscending);
		} else {
			pageSession.set("ContactsViewSortAscending", true);
		}
	}
});

Template.ContactsViewTable.helpers({
	"tableItems": function() {
		return ContactsViewItems(this.contacts);
	}
});


Template.ContactsViewTableItems.rendered = function() {
	
};

Template.ContactsViewTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("contacts.details", {Id: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		Contacts.update({ _id: this._id }, { $set: values });

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
						Contacts.remove({ _id: me._id });
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
		Router.go("contacts.edit", {Id: this._id});
		return false;
	}
});

Template.ContactsViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Contacts.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Contacts.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
