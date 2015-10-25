define(function (require) {
	return '' +
		'<div class=\'container\'>' +
		'	<h4 class=\'edu-title\'><%= x %></h4>' +
		'	<p>' + require("./output-ejs-2") + '</p>' +
		'</div>';
});