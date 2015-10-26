var utils = require('../t/utils.js');
var build = require('../t/buildTree.js');
var fs = require('fs');
var rf = fs.readFileSync;
var html = rf('./parts.html', 'utf8');
var sr1 = (/[^>]*/).source;
var div = 'ul';
var r1 = new RegExp('<'  + div + sr1 + '>', 'g');
var r2 = new RegExp('</' + div + '>', 'g');
html = utils.handleParts(r1, r2, html).reduce(function (a, b) {
	if (b.isPart) a += b.str;
	return a;
}, '');
console.log(html);