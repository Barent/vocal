var pageSession = new ReactiveDict();

Template.EventsEdit.rendered = function() {
	
};

Template.EventsEdit.events({
	
});

Template.EventsEdit.helpers({
	
});

Template.EventsEditEditForm.rendered = function() {
	

	pageSession.set("eventsEditEditFormInfoMessage", "");
	pageSession.set("eventsEditEditFormErrorMessage", "");

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

Template.EventsEditEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("eventsEditEditFormInfoMessage", "");
		pageSession.set("eventsEditEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var eventsEditEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(eventsEditEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("eventsEditEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("events", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("eventsEditEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				Events.update({ _id: t.data.event._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("events", {});
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

Template.EventsEditEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("eventsEditEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("eventsEditEditFormErrorMessage");
	}
	
});
