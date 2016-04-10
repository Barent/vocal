var pageSession = new ReactiveDict();

Template.EventsInsert.rendered = function() {
	
};

Template.EventsInsert.events({
	
});

Template.EventsInsert.helpers({
	
});

Template.EventsInsertInsertForm.rendered = function() {
	

	pageSession.set("eventsInsertInsertFormInfoMessage", "");
	pageSession.set("eventsInsertInsertFormErrorMessage", "");

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

Template.EventsInsertInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("eventsInsertInsertFormInfoMessage", "");
		pageSession.set("eventsInsertInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var eventsInsertInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(eventsInsertInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("eventsInsertInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("events", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("eventsInsertInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				newId = Events.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
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

Template.EventsInsertInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("eventsInsertInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("eventsInsertInsertFormErrorMessage");
	}
	
});
