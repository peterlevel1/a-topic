define(function () {
	return '' +
		'<div class="container">' +
		'	<h4 class="edu-title">aaa:</h4>' +
		'	<% cv.edu.during.forEach(function (one) { %>' +
		'		<h4><%= one.years %></h4>' +
		'		<h4 class="edu-title">bbb:</h4>' +
		'		<p><%= one.college %></p>' +
		'		<h4 class="edu-title">ccc:</h4>' +
		'		<p><%= one.major %></p>' +
		'		<h4 class="edu-title">ddd:</h4>' +
		'		<p><%= one.certificate %></p>' +
		'	<% }); %>' +
		'</div>';
});