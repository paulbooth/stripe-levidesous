$(function() {
	var amountString = String(amount)
	var cents = amountString.slice(amountString.length - 2, amountString.length);
	var dollars = amountString.slice(0, amountString.length - 2);
	var prettyAmount = "$" + dollars + "." + cents;

	$(".charge-final").html(prettyAmount)

	var $form = $('#payment-form');
	$form.find('.subscribe').on('click', payWithStripe);
	
	function payWithStripe(e) {		
	    e.preventDefault();	   

	    /* Visual feedback */
	    $form.find('.subscribe').html('Validating <i class="fa fa-spinner fa-pulse"></i>').prop('disabled', true);
	    
	    var key;
	    if (location.host.indexOf("localhost") > -1) {
	    	key = 'pk_test_BxqisMyL0ZKapZjhgfNpzHhr'
	    } else {
	    	key = 'pk_live_KEOmKcPh5aQq39FAOTGjNLfh'
	    }

	    Stripe.setPublishableKey(key);
	    
	    /* Create token */
	    var expiry = $form.find('[name=cardExpiry]').payment('cardExpiryVal');
	    var ccData = {
	        number: $form.find('[name=cardNumber]').val().replace(/\s/g,''),
	        cvc: $form.find('[name=cardCVC]').val(),
	        exp_month: expiry.month, 
	        exp_year: expiry.year
	    };
	    
	    Stripe.card.createToken(ccData, function stripeResponseHandler(status, response) {
	        if (response.error) {
	            /* Visual feedback */
	            $form.find('.subscribe').html('Try again').prop('disabled', false);
	            /* Show Stripe errors on the form */
	            $form.find('.payment-errors').text(response.error.message);
	            $form.find('.payment-errors').closest('.row').show();
	        } else {
	            /* Visual feedback */
	            $form.find('.subscribe').html('Processing <i class="fa fa-spinner fa-pulse"></i>');
	            /* Hide Stripe errors on the form */
	            $form.find('.payment-errors').closest('.row').hide();
	            $form.find('.payment-errors').text("");
	            // response contains id and card, which contains additional card details            	            
	            var token = response.id;
	            // Send the form here
	            submitInfo(token);
	        }
	    });
	}
	/* Fancy restrictive input formatting via jQuery.payment library*/
	$('input[name=cardNumber]').payment('formatCardNumber');
	$('input[name=cardCVC]').payment('formatCardCVC');
	$('input[name=cardExpiry').payment('formatCardExpiry');

	/* Form validation using Stripe client-side validation helpers */
	jQuery.validator.addMethod("cardNumber", function(value, element) {
	    return Stripe.card.validateCardNumber(value);
	}, "Please specify a valid credit card number.");

	jQuery.validator.addMethod("cardExpiry", function(value, element) {    
	    /* Parsing month/year uses jQuery.payment library */
	    value = $.payment.cardExpiryVal(value);
	    return Stripe.card.validateExpiry(value.month, value.year);
	}, "Invalid expiration date.");

	jQuery.validator.addMethod("cardCVC", function(value, element) {
	    return Stripe.card.validateCVC(value);
	}, "Invalid CVC.");

	validator = $form.validate({
	    rules: {
	        cardNumber: {
	            required: true,
	            cardNumber: true            
	        },
	        cardExpiry: {
	            required: true,
	            cardExpiry: true
	        },
	        cardCVC: {
	            required: true,
	            cardCVC: true
	        },
	        email: {
	            required: true,
	            email: true            
	        }
	    },
	    highlight: function(element) {
	        $(element).closest('.form-control').removeClass('success').addClass('error');
	    },
	    unhighlight: function(element) {
	        $(element).closest('.form-control').removeClass('error').addClass('success');
	    },
	    errorPlacement: function(error, element) {
	        $(element).closest('.form-group').append(error);
	    }
	});

	paymentFormReady = function() {
	    if ($form.find('[name=cardNumber]').hasClass("success") &&
	        $form.find('[name=cardExpiry]').hasClass("success") &&
	        $form.find('[name=email]').hasClass("success") &&
	        $form.find('[name=cardCVC]').val().length > 1) {
	        return true;
	    } else {
	        return false;
	    }
	}

	$form.find('.subscribe').prop('disabled', true);
	var readyInterval = setInterval(function() {
	    if (paymentFormReady()) {
	        $form.find('.subscribe').prop('disabled', false);
	        clearInterval(readyInterval);
	    }
	}, 250);
	
	// submit info

	function submitInfo(token) {					
		$form.find("input").prop('disabled', true);

		$.ajax({
			url: "/invoice",
			method: "POST",			
			data: {reason: reason, token: token, amount: amount, email: $form.find("[name=email]").val()}
		})
		.done(function(data) {	
			$(".payment-success").show();
	    	$form.find('.subscribe').html('Successfull Paid <i class="fa fa-check"></i>');
	    	trackConversions();
		})
		.fail(function(data) {
		    $form.find('.subscribe').html('There was a problem.').removeClass('success').addClass('error');
		    /* Show Stripe errors on the form */
		    console.log("data", data);
		    $form.find('.payment-errors').text(data.responseJSON.message + " Please reload and try again.");
		    $form.find('.payment-errors').closest('.row').show();
		});
	}	
})
