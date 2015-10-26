var script1 = '\<script[^\>]*\>';
var rnotQuote = '[^\'\"]*?';
var rq1 = '(\'[^\']*\')';
var rq2 = '(\"[^\"]*\")';
// var rnotQuote = '[^\'\"]*?';
var rnoTail = '(?!\<\/script>)';
var rTail = '<\/script>';

var str3 = '<script> '
	+ 'var a = "aaa";'
	+ 'var $node = $("<script></script>")'
	+ '</script>';

var index;

var rq9 = new RegExp(rTail);

var rq10 = new RegExp(script1);

var rq11 = new RegExp(
		+ rnotQuote
		+ '(?:' + rq1 + '|' + rq2 + ')'
, 'g');

str3 = str3.replace(rq10, function (all) {
	console.log(arguments);
	return '';
});
console.log(str3);

// console.log(str2.match(rq11));
// console.log(str1.match(rq11));
str3 = str3.replace(rq11, function (all, a, b, c) {
	console.log(arguments);
	return '';
});
console.log(str3);

str3 = str3.replace(rq11, function (all, a, b, c) {
	console.log(arguments);
	return '';
});
console.log(str3);
