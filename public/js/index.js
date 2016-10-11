$(function(){
	if (!window.matchMedia("(max-device-width: 768px)").matches) {
		var olinDtechConnector = jsPlumb.getInstance();
		olinDtechConnector.setContainer($(".explanation-section"));

		var dtechLaunchCampConnector = jsPlumb.getInstance();
		dtechLaunchCampConnector.setContainer($(".explanation-section"));

		olinDtechConnector.importDefaults({
			Connector:[ "Flowchart"],
			Anchors : [ "Bottom", "Top" ],
			Endpoint: "Blank",
			EndpointStyle : { fillStyle: "#567567"  },
			PaintStyle: { strokeStyle: "#FF9185", lineWidth: 5 }
			// Anchor : [ 0.5, 0.5, 1, 1 ]
		});

		dtechLaunchCampConnector.importDefaults({
			Connector:[ "Flowchart"],
			Anchors : [ "Bottom", "Top" ],
			Endpoint: "Blank",
			EndpointStyle : { fillStyle: "#567567"  },
			PaintStyle: { strokeStyle: "#FF9185", lineWidth: 5 }
			// Anchor : [ 0.5, 0.5, 1, 1 ]
		});	

		olinDtechConnector.connect({
			source:"olin-logo-container",
			target:"dtech-logo-container"
		});	

		dtechLaunchCampConnector.connect({
			source:"dtech-logo-container",
			target:"launch-camp-logo-container"
		});				
	}

	$(".email-submit").click(function(e) {
		var email = $(".email-input").val();
		if (email) {
			submitFormSpree({ email_address: email}, function() {				
				$(".newsletter-thankyou").show()
				$(".email-input").attr("disabled", true);
				$(".email-submit").attr("disabled", true);				
			})

			fbq && fbq('track', 'Lead');
		}
	})	

	// var submitInfoSession = $(".info-session-submit");	
	// var infoSuccess = $(".info-session-success");
	// var signupForm = $(".info-session-signup");	

	// signupForm.validate({		
	// 	errorPlacement: function(error, element) {
	// 		console.log("error", element);
	// 		if (element.attr("name") == "info session") {
	// 			$(".info-session-error").html(error);
	// 		}

	// 		if (element.attr("name") == "email") {
	// 			$(".email-error").html(error);
	// 		}			

	// 		repaint()  			
	// 	},
	// 	submitHandler: function(form) {			
	// 		submitInfoSession.html("Submitting...").removeClass("btn-primary").addClass("btn-warning");						
	// 		submitInfoSession.attr("disabled", true);      				
 //      		$.ajax({
 //      			url: "https://script.google.com/macros/s/AKfycbwsyTAgdJ49o48qLj5WCmwfhXbv_bsXarR4lvQ4WnMlXDIzIitl/exec",
 //      			method: "POST",
 //      			data: $(form).serialize(),
 //      			success: function() {      				
 //      				signupForm.find("input").attr("disabled", true);
 //      				$(".last-info-session-text").removeClass("last-info-session-text");
 //      				submitInfoSession.html("Success!").removeClass("btn-warning").addClass("btn-success")      				
 //      				infoSuccess.show();
 //      				infoSuccess.addClass("last-info-session-text");   

 //      				repaint()  			
 //      			}
 //      		})
 //      		return false;      		
 //    	}
	// });	

	// signupForm.find("input[type='radio']").click(function() {
	// 	// wait for 100 ms for the error message to be reomved
	// 	setTimeout(repaint, 100);
	// });
	// signupForm.find("input[type='email']").keydown(repaint).blur(repaint)

	function repaint() {
		console.log("repsinging");
		if (olinDtechConnector && dtechLaunchCampConnector) {						
			olinDtechConnector.repaintEverything();
			dtechLaunchCampConnector.repaintEverything();
		}
	}
})