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
html = utils.trim(html);

//comments
html = utils.handleComments(html).reduce(add, '');
html = utils.trim(html);

//script comments
html = html.replace(utils.rscriptCommentLine, '')
	.replace(utils.rscriptCommentAll, '');
html = utils.trim(html);

//script replace
html = utils.handleScripts(html).reduce(add, '');
html = utils.trim(html);

//tree
var tree = build(html);
console.log(tree[0]);