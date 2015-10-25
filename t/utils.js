var utils = module.exports;

var rtag = utils.rtag = /<(\/)?([\w]+)([^>]+|)?>/;
var rtag_g = utils.rtag_g = /<[^>]+>/g;

var singleTags = utils.singleTags = 'link br hr meta input img base param'.split(' ');
var isSingle = utils.isSingle = function (tag, tagName) {
	return tag[tag.length - 2] === '/' ||
		( (tagName ||
			(tagName = (rtag.exec(tag) || [])[2]) ) &&
			singleTags.indexOf(tagName) >= 0 );
};

var rattr = utils.rattr = /[\s\t]+([\w-]+)(?:=\"([^\"]+)\"|=\'([^\']+)\'|)?/g;
var makeAttributes = utils.makeAttributes = function (str) {
	var one;
	var node = {};
	while ((one = rattr.exec(str))) {
		node[one[1]] = one[2] || true;
	}
	return node;
};

var isTag = utils.isTag = function (tag) {
	return rtag.test(tag);
};
var matchTag = utils.matchTag = function (tag) {
	return isTag(tag) && tag.match(rtag);
};
var isTagEnd = utils.isTagEnd = function (tag) {
	return isTag(tag) && tag[1] === '/';
};

var rtrim = utils.rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
utils.trim = function (text) {
	return text == null
		? ""
		: ( text + "" ).replace( rtrim, "" );
};

utils.rdoc = /^<[!?]?(doctype|xml)[^>]+>/i;
utils.rxmlHead = /<\?[^>]+\?>/ig;
//not greedy match, inner script tag no "<script> ... </script>"
utils.rscript = /(<script[^>]*(?!\/)>)([\s\S]+?(?=\<\/script\>)|)?(<\/script>)/ig;
utils.rcomment = /<!--([\s\S]+?(?=\-\-\>)|)?-->/ig;

var rbody = utils.rbody = /<body[^>]*>[\s\S]+<\/body>/;
utils.getBody = function (str) {
	return getMain(rbody, str);
};

var rhead = utils.rhead = /<head[^>]*>[\s\S]+<\/head>/;
utils.getHead = function (str) {
	return getMain(rhead, str);
};

function getMain(reg, str) {
	return (str.match(reg) || [''])[0];
}

var rscriptHead = utils.rscriptHead = /<script[^>]*>/ig;
var rscriptTail = utils.rscriptTail = /<\/script>/ig;
utils.handleScripts = function(str) {
	return handleParts(rscriptHead, rscriptTail, str);
};

var rcommentHead = utils.rcommentHead = /<!--/ig;
var rcommentTail = utils.rcommentTail = /-->/ig;
utils.handleComments = function(str) {
	return handleParts(rcommentHead, rcommentTail, str);
};

function regParts(reg, str) {
	var one;
	var ret = [];
	while (one = reg.exec(str)) ret.push(one);
	ret.str = str;
	return ret;
}

var rquote = /['"]/;

var oescape = {
	'&' : '&amp;',
	'<' : '&lt;',
	'>' : '&gt;',
	'"' : '&quot;',
	"'" : '&#x27;',
	'/' : '&#x2F;'
};

var ounescape = {
	'&amp;'  : '&',
	'&lt;'   : '<',
	'&gt;'   : '>',
	'&quot;' : '"',
	'&#x27;' : "'",
	'&#x2F;' : '/'
};

var rescape = /[&<>"'\/]/g;

function _replace(one) {
	return oescape[one];
}

function escapeString(str) {
	return str.replace(rescape, _replace);
}

function escapeBad(str, bad) {
	return str.slice(0, bad.index)
		+ escapeString(bad[0])
		+ str.slice(bad.index + bad[0].length);
}

function handleParts(rhead, rtail, str) {
	var head = regParts(rhead, str);
	var tail = regParts(rtail, str);
	var ret = [];
	var bad;

	if (head.length !== tail.length) {
		console.warn('handleParts: head.length !== tail.length');
		if (head.length && rtag.test(head[0][0])) {
			var len = head.length;
			while (len--) {
				bad = head[len];
				if (bad[0][bad[0].length - 2] === '/') {
					str = escapeBad(str, bad);
					head.splice(len, 1);
				}
			}
		}

		while (head.length !== tail.length) {
			bad = head.length > tail.length
				? head.shift()
				: tail.pop();
			str = escapeBad(str, bad);
		}
	}

	if (!head.length || !tail.length) {
		if (!head.length) console.warn('handleParts: no head part');
		if (!tail.length) console.warn('handleParts: no tail part');
		var one = head || tail;
		if (one.length) {
			while (bad = one.shift()) str = escapeBad(str, bad);
		}
		ret.str = str;
		return ret;
	}

	var start = 0;
	var end = 0;
	var tmpEnd;

	while (head[0] != null) {
		start = head[0].index;
		if (start > end)
			ret.push({ isPart : false, index : end,  str : str.slice(end, start) });

		tmpEnd = tail[0].index;
		while (head[0] != null && head[0].index < tmpEnd) {
			 head.shift();
			 end = tail.shift();
			 end = end.index + end[0].length;
		}

		ret.push({ isPart : true, index : start, str : str.slice(start, end) });
	}

	if (end < str.length)
		ret.push({ isPart : false, index : end, str : str.slice(end) });

	ret.str = str;
	return ret;
}