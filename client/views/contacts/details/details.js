var pageSession = new ReactiveDict();

Template.ContactsDetails.rendered = function() {
	
};

Template.ContactsDetails.events({
	
});

Template.ContactsDetails.helpers({
	
});

Template.ContactsDetailsDetailsForm.rendered = function() {
	

	pageSession.set("contactsDetailsDetailsFormInfoMessage", "");
	pageSession.set("contactsDetailsDetailsFormErrorMessage", "");

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

Template.ContactsDetailsDetailsForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("contactsDetailsDetailsFormInfoMessage", "");
		pageSession.set("contactsDetailsDetailsFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var contactsDetailsDetailsFormMode = "read_only";
			if(!t.find("#form-cancel-button")) {
				switch(contactsDetailsDetailsFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("contactsDetailsDetailsFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("contactsDetailsDetailsFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		/*CANCEL_REDIRECT*/
	},
	"click #form-close-button": function(e, t) {
		e.preventDefault();

		Router.go("contacts", {});
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		Router.go("contacts", {});
	}

	
});

Template.ContactsDetailsDetailsForm.helpers({
	"infoMessage": function() {
		return pageSession.get("contactsDetailsDetailsFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("contactsDetailsDetailsFormErrorMessage");
	}
	
});
