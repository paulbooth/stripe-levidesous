var express = require('express');
var router = express.Router();
var request = require('request');
var _ = require('lodash');

var stripeKey = process.env.STRIPE_API_KEY;
console.log(stripeKey)

if (!stripeKey) {
	throw 'StripeTokenNotDefined';
}

var stripe = require('stripe')(stripeKey);

var DOLLARS_TO_CENTS = 100;

router.post('/buy', function(req, res, next) {
	var stripeToken = req.body.token;
	var name = req.body.name;
	var email = req.body.email;
	var price = 5 * DOLLARS_TO_CENTS;
	stripe.customers.create({
	  source: stripeToken,
	  description: name,
	  email: email
	}).then(function(customer) {
		return stripe.charges.create({
			amount: price, // amount in cents, again
			currency: 'usd',
			customer: customer.id
		});
	}).then(function(charge) {
		console.log({
			customer: charge.customer,
			charge: charge.id,
			name: name,
			email: email});

		// request({
		//   url: 'https://script.google.com/macros/s/AKfycbz1ThaaXXJk1Of3SmdR4pYVTcmWAj_qswmGLzUjpnZS3F7f19Pp/exec',
		//   method: 'POST',
		//   //Lets post the following key/values as form
		//   form: _.extend(enrollment, {customer: charge.customer, charge: charge.id})
		// }, function(error, response, body){
	 //      res.send(200);
		// });
	}).catch(function(error) {
		console.log('ERROR', error);
		res.send(error.statusCode, {message: error.message});
		return;
	});
});

router.post('/enroll', function(req, res, next) {
	var enrollment = req.body.enrollment_data;
	var stripeToken = req.body.token;

	var price = checkCouponCode(req.body.enrollment_data['Discount Code']);

	var email = enrollment['Parent Email'];
	var name = enrollment['Parent Name'];

	console.log('email', email, name);
	stripe.customers.create({
	  source: stripeToken,
	  description: name,
	  email: email
	}).then(function(customer) {
		return stripe.charges.create({
			amount: price, // amount in cents, again
			currency: 'usd',
			customer: customer.id
		});
	}).then(function(charge) {
		request({
		  url: 'https://script.google.com/macros/s/AKfycbz1ThaaXXJk1Of3SmdR4pYVTcmWAj_qswmGLzUjpnZS3F7f19Pp/exec',
		  method: 'POST',
		  //Lets post the following key/values as form
		  form: _.extend(enrollment, {customer: charge.customer, charge: charge.id})
		}, function(error, response, body){
	      res.send(200);
		});
	}).catch(function(error) {
		console.log('ERROOOR', error);
		res.send(error.statusCode, {message: error.message});
		return;
	});
});

router.post('/confirmation', function(req, res, next) {
	var enrollment = req.body;
	sessionNumber = enrollment.Session;

	if (sessionNumber === '1') {
		enrollment.Session = '6/20 - 7/1: Design Tech High School, Millbrae';
	} else if (sessionNumber === '2') {
		enrollment.Session = '7/11 - 7/22: Union Square, San Francisco';
	} else {
		enrollment.Session = '7/27 - 8/9: Cubberley Community Center, Palo Alto';
	}

	var coupon = getCoupon(req.body['Discount Code']);

	res.render('confirmation.jade', _.extend({data: enrollment, sessionNumber: sessionNumber}, coupon));
});

router.get('/invoice', function(req, res, next) {
	var amount = req.param('amount') || 0;
	var reason = req.param('reason') || '';

	res.render('invoice.jade', {amount: amount, reason: reason});
});

router.post('/invoice', function(req, res, next) {
	var stripeToken = req.body.token;

	var amount = req.body.amount;
	var reason = req.body.reason;

	var email = req.body.email;

	console.log('about to make the charge');

	stripe.customers.create({
	  source: stripeToken,
	  email: email
	}).then(function(customer) {
		return stripe.charges.create({
			amount: amount,
			currency: 'usd',
			description: reason,
			customer: customer.id
		});
	}).then(function(charge) {
      	res.send(200);
	}).catch(function(error) {
		console.log('ERROOOR', error);
		res.send(error.statusCode, {message: error.message});
		return;
	});
});

var seventyFivePercent = ['brianna', 'tria'];
var fiftyPercent = ['la', 'bc', 'dtech'];
var thirtyPercent = ['crystal', 'liyan'];
var twentyPercent = ['parab', 'gwc', 'gunn', 'farley', 'sell', 'start', 'dooley', 'bui', 'chen'];
var fifteenPercent = ['hickman', 'launch', 'wang', 'hu', 'liu', 'saheli', 'search', 'shetty', 'allen'];

function checkCouponCode(code) {
	if (seventyFivePercent.indexOf(code.toLowerCase()) > -1) {
		return 30000;
	} else if (fiftyPercent.indexOf(code.toLowerCase()) > -1) {
		return 60000;
	} else if (thirtyPercent.indexOf(code.toLowerCase()) > -1) {
		return 84000;
	} else if (twentyPercent.indexOf(code.toLowerCase()) > -1) {
		return 96000;
	} else if (fifteenPercent.indexOf(code.toLowerCase()) > -1) {
		return 102000;
	} else {
		return 120000;
	}
}

function getCoupon(code) {
	if (seventyFivePercent.indexOf(code.toLowerCase()) > -1) {
		return {price: '$300.00', discount: '75%'};
	} else if (fiftyPercent.indexOf(code.toLowerCase()) > -1) {
		return {price: '$600.00', discount: '50%'};
	} else if (thirtyPercent.indexOf(code.toLowerCase()) > -1) {
		return {price: '$840.00', discount: '30%'};
	} else if (twentyPercent.indexOf(code.toLowerCase()) > -1) {
		return {price: '$960.00', discount: '20%'};
	} else if (fifteenPercent.indexOf(code.toLowerCase()) > -1) {
		return {price: '$1,020.00', discount: '15%'};
	} else {
		return {price: '$1,200.00'};
	}
}

module.exports = router;
