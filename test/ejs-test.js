var addQuote = require('../t/addQuote.js');
var opts = {
	input : 'ejs-1.html',
	output : 'output-ejs-1.js',
	itab : 2
};
var opts2 = {
	input : 'ejs-2.html',
	output : 'output-ejs-2.js',
	itab : 2
};
// addQuote(opts, function (err, str) {
// 	console.log(err || str);
// });
addQuote.amd(opts, function (err, str) {
	console.log(err || str);
});
addQuote.amd(opts2, function (err, str) {
	console.log(err || str);
});