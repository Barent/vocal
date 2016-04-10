var pageSession = new ReactiveDict();

Template.ContactsInsert.rendered = function() {
	
};

Template.ContactsInsert.events({
	
});

Template.ContactsInsert.helpers({
	
});

Template.ContactsInsertInsertForm.rendered = function() {
	

	pageSession.set("contactsInsertInsertFormInfoMessage", "");
	pageSession.set("contactsInsertInsertFormErrorMessage", "");

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

Template.ContactsInsertInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("contactsInsertInsertFormInfoMessage", "");
		pageSession.set("contactsInsertInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var contactsInsertInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(contactsInsertInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("contactsInsertInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("contacts", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("contactsInsertInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				newId = Contacts.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
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

Template.ContactsInsertInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("contactsInsertInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("contactsInsertInsertFormErrorMessage");
	}
	
});
