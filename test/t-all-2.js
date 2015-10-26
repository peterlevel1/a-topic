
var utils = require('../t/utils.js');

// var str = '<script> asas var a = "<script></script>"; </script>'
// 	+ '<div> aaa </div>'
// 	+ '<script> var $a = $("<script> sdsd </script>") </script>'
// 	+ '<script> var str = "<div></div>"; </script>'
// 	+ '<div> bbb </div>'
// 	+ '<link rel="stylesheet" href="#" />';

// var arr = utils.handleScripts(str);
// console.log(arr);

//----
var buildTree = require('../t/buildTree.js');
var utils = require('../t/utils.js');
//----
var fs = require('fs');
var html = fs.readFileSync('./test-all.html');
function regParts(reg, str) {
	var one;
	var ret = [];
	while (one = reg.exec(str)) ret.push(one);
	ret.str = str;
	return ret;
}

html = utils.trim(html);

var doc = utils.rdoc.exec(html);
if (doc) {
	html = html.slice(doc[0].length);
	html = utils.trim(html);
	console.log('doc is ', doc[1]);
}


var comments = utils.handleComments(html);
if (comments.length) {
	// console.log('comments.length', comments);
	html = comments.reduce(function (memo, one) {
		if (!one.isPart) {
			memo += one.str;
		}
		return memo;
	}, '');
}

var scripts = utils.handleScripts(html);
if (scripts.length) {
	console.log('scripts.length', scripts);
	html = scripts.reduce(function (memo, one) {
		if (!one.isPart) {
			memo += one.str;
		}
		return memo;
	}, '');
}

console.log('================');
console.log(html);

console.log('================');
var tree = buildTree(html);
console.log(tree[0]);