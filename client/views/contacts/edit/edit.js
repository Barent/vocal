var pageSession = new ReactiveDict();

Template.ContactsEdit.rendered = function() {
	
};

Template.ContactsEdit.events({
	
});

Template.ContactsEdit.helpers({
	
});

Template.ContactsEditEditForm.rendered = function() {
	

	pageSession.set("contactsEditEditFormInfoMessage", "");
	pageSession.set("contactsEditEditFormErrorMessage", "");

	$(".input-group.date").each(function() {
		var format = $(this).find("input[type='text']").attr("data-format");

		if(format) {
			format = format.toLowerCase();
		}
		else {
			format = "mm/dd/yyyy";
		}

		$(this).datepicker({
			autoclose: true,
			todayHighlight: true,
			todayBtn: true,
			forceParse: false,
			keyboardNavigation: false,
			format: format
		});
	});

	$("input[type='file']").fileinput();
	$("select[data-role='tagsinput']").tagsinput();
	$(".bootstrap-tagsinput").addClass("form-control");
	$("input[autofocus]").focus();
};

Template.ContactsEditEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("contactsEditEditFormInfoMessage", "");
		pageSession.set("contactsEditEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var contactsEditEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(contactsEditEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("contactsEditEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("contacts", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("contactsEditEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				Contacts.update({ _id: t.data.contact._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("contacts", {});
	},
	"click #form-close-button": function(e, t) {
		e.preventDefault();

		/*CLOSE_REDIRECT*/
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		/*BACK_REDIRECT*/
	}

	
});

Template.ContactsEditEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("contactsEditEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("contactsEditEditFormErrorMessage");
	}
	
});
