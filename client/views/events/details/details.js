var pageSession = new ReactiveDict();

Template.EventsDetails.rendered = function() {
	
};

Template.EventsDetails.events({
	
});

Template.EventsDetails.helpers({
	
});

Template.EventsDetailsDetailsForm.rendered = function() {
	

	pageSession.set("eventsDetailsDetailsFormInfoMessage", "");
	pageSession.set("eventsDetailsDetailsFormErrorMessage", "");

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

Template.EventsDetailsDetailsForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("eventsDetailsDetailsFormInfoMessage", "");
		pageSession.set("eventsDetailsDetailsFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var eventsDetailsDetailsFormMode = "read_only";
			if(!t.find("#form-cancel-button")) {
				switch(eventsDetailsDetailsFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("eventsDetailsDetailsFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("eventsDetailsDetailsFormErrorMessage", message);
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

		Router.go("events", {});
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		Router.go("events", {});
	}

	
});

Template.EventsDetailsDetailsForm.helpers({
	"infoMessage": function() {
		return pageSession.get("eventsDetailsDetailsFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("eventsDetailsDetailsFormErrorMessage");
	}
	
});
