var selectedSession;
var selectedSessionNumber;

var couponCodes = ["gunn", "dtech", "hickman", "crystal", "gwc", "parab", "launch", "farley", "wang", "hu", "liyan", "sell", "la", "liu", "bc", "saheli", "search", "brianna", "start", "tria", "shetty", "dooley", "bui", "chen", "allen"];

$(function() {
	$(".session-choice").click(function(e) {
		$(".session-choice").removeClass("focus");
		var clickedSession = $(e.target);
		clickedSession.addClass("focus");
		selectedSession = clickedSession.html();
		selectedSessionNumber = clickedSession.data("number")
		$(".no-session").hide();
		$(".general-error").hide();
	})

	$(".submit-application").click(function() {			
		// first validate all the inputs		
		
		if (!selectedSession) {
			$(".no-session").show();
			$(".general-error").show();
		} else if (!$(".application-form").valid()) {
			$(".info-error").show();
			$(".general-error").show();
		} else {
			var price;

			var couponCode = $("#coupon-code").val()
			if (couponCode && !(couponCodes.indexOf(couponCode.toLowerCase()) >  -1)) {
				$(".coupon-error").show();	
				return 				
			}

			$("#session-number").val(selectedSessionNumber);

			submitFormSpree($(".application-form").serialize(), function() {				
				$(".application-form").submit();
			})				
		}	
	})

	$(".email-submit").click(function(e) {
		var email = $(".email-input").val();
		if (email) {
			submitFormSpree({ email_address: email}, function() {				
				$(".email-entry-header").html("Thanks! We'll be in touch soon.");
				$(".email-input").attr("disabled", true);
				$(".email-submit").attr("disabled", true);				
			})
		}
	})
})

function submitFormSpree(data, callback) {
	$.ajax({				
		type: "post",
		url: "//formspree.io/info@thelaunchcamp.com",
		data: data,
		"dataType": "text",
		complete: callback
	})
}


