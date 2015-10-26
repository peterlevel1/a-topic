var utils = require('../t/utils.js');
var build = require('../t/buildTree.js');
var fs = require('fs');
var rf = fs.readFileSync;
var html = rf('./replace-script.html', 'utf8');
var add = function (memo, one) {
	if (!one.isPart) {
		memo += one.str;
	}
	return memo;
};

//rdoc
html = html.replace(utils.rdoc, '');

//comments
html = utils.handleComments(html).reduce(add, '');

// script comments
html = html.replace(utils.rscriptCommentLine, '')
	.replace(utils.rscriptCommentAll, '');

//script replace
html = utils.handleScripts(html).reduce(add, '');

//tree
var tree = build(html);
console.log(tree[0]);