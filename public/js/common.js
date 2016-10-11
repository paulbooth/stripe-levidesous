$(function() {
	var dropdownToggled = false
	var dropdownButton = $(".dropdown-toggle");
	var dropdown = $(".dropdown-menu");

	dropdownButton.click(function() {	
		if (dropdownToggled) {
			dropdownToggled = false;
			dropdown.hide();
		} else {
			dropdown.show();
			dropdownToggled = true
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


