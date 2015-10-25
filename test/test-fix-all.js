//----
var buildTree = require('../t/buildTree.js');
var utils = require('../t/utils.js');
//----
var fs = require('fs');
var html = fs.readFileSync('./test-all.html');

html = utils.trim(html);

var doc = utils.rdoc.exec(html);
if (doc) {
	html = html.slice(doc[0].length);
	html = utils.trim(html);
	console.log('doc is ', doc[1]);
}
function regParts(reg, str) {
	var one;
	var ret = [];
	while (one = reg.exec(str)) ret.push(one);
	ret.str = str;
	return ret;
}

// var rcommentHead = utils.rcommentHead = /<!--/ig;
// var rcommentTail = utils.rcommentTail = /-->/ig;
// var ret = regParts(rcommentHead, html);
// console.log(ret);
// var ret2 = regParts(rcommentTail, html);
// console.log(ret2);
// console.log(html);

var comments = utils.handleComments(html);
if (comments.length) {
	console.log('comments.length', comments.length);
	html = comments.reduce(function (memo, one) {
		if (!one.isPart) {
			memo += html.slice(one.index, one.index + one.str.length);
		}
		return memo;
	}, '');
}

var scripts = utils.handleScripts(html);
if (scripts.length) {
	console.log('scripts.length', scripts.length);
	html = scripts.reduce(function (memo, one) {
		if (!one.isPart) {
			memo += html.slice(one.index, one.index + one.str.length);
		}
		return memo;
	}, '');
}

console.log('================');
console.log(html);

console.log('================');
var tree = buildTree(html);
console.log(tree[0]);