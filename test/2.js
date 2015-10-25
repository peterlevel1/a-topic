var utils = require('../t/utils.js');
var fs = require('fs');
var str = fs.readFileSync('./111.html', 'utf8');
var ret = utils.handleScripts(str);
console.log(ret);

var ret = utils.handleComments(str);
console.log(ret);

var str =
	'<!-- <!--[if lt IE 9]>\
	<script src="http://static.zhihu.com/static/components/respond/dest/respond.min.js"></script>\
	<link href="http://static.zhihu.com/static/components/respond/cross-domain/respond-proxy.html" id="respond-proxy" rel="respond-proxy" />\
	<link href="/static/components/respond/cross-domain/respond.proxy.gif" id="respond-redirect" rel="respond-redirect" />\
	<script src="/static/components/respond/cross-domain/respond.proxy.js"></script>\
	<![endif]--> aaa--> asas';

var ret = utils.handleComments(str);
console.log(ret);