var addQuote = require('../t/addQuote.js');
var input = 'ejs-1.html';
var output = 'output-ejs-1.js';
var opts = {
	input : input,
	output : output,
	itab : 2
};
// addQuote(opts, function (err, str) {
// 	console.log(err || str);
// });
addQuote.amd(opts, function (err, str) {
	console.log(err || str);
});