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

//not greedy match, inner script tag: two script tag should exist together
utils.rscript = /(<script[^>]*(?!\/)>)([\s\S]+?(?=\<\/script\>)|)?(<\/script>)/g;
utils.rscriptCommentLine = /\/\/([^\n]*?\n)/g;
utils.rscriptCommentAll = /\/\*([\s\S]+?(?=\*\/)|)?\*\//g;
utils.rcomment = /<!--([\s\S]+?(?=\-\-\>)|)?-->/g;

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

var rquote = /['"]/;
var rscriptHead = utils.rscriptHead = /<script[^>]*>/ig;
var rscriptTail = utils.rscriptTail = /<\/script>/ig;
utils.handleScripts = function(str) {
	var tail = regParts(rscriptTail, str);
	var head = regParts(rscriptHead, str);
	var end;
	var start;
	var tmpEnd;
	var stack = [];
	var bad;
	while (start = head[0]) {
		end = false;
		while (head[0] &&
			(tmpEnd = tmpEnd || tail[0].index) > head[0].index) {
			head.shift();
			end = tail.shift();
		}
		tmpEnd = null;

		if (!end)
			break;

		bad = str.slice(
			start.index + start[0].length,
			end.index
		);
		if (rquote.test(bad)) {
			stack.push({
				start : start.index + start[0].length,
				end : end.index,
				str : bad
			});
		}
	}

	end = 0;
	str = !stack.length
		? str
			// [end 	+     start str] end...
			//start + [<script>| bad |</script>]... + tail
		: stack.reduce(function (memo, one) {
				memo += (one.start > end
					? str.slice(end, one.start)
					: '')
					+ escapeString(one.str);
				end = one.end;
				return memo;
			}, '') + str.slice(end);

	head = !stack.length ? head : regParts(rscriptHead, str);
	tail = !stack.length ? tail : regParts(rscriptTail, str);

	return handleParts(head, tail, str);
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

var oescape = {
	'&' : '&amp;',
	'<' : '&lt;',
	'>' : '&gt;',
	'"' : '&quot;',
	"'" : '&#x27;',
	'/' : '&#x2F;'
};

var rescape = /[&<>"'\/]/g;

function _replace(one) {
	return oescape[one];
}

function escapeString(str) {
	return str.replace(rescape, _replace);
}

var ounescape = {
	'&amp;'  : '&',
	'&lt;'   : '<',
	'&gt;'   : '>',
	'&quot;' : '"',
	'&#x27;' : "'",
	'&#x2F;' : '/'
};

var runescape = /(?:&amp;|&lt;|&gt;|&quot;|&#x27;|&#x2F;)/g;

function _unescape(one) {
	return ounescape[one];
}

function unescapeString(str) {
	return str.replace(runescape, _unescape);
}

function escapeBad(str, bad) {
	return str.slice(0, bad.index)
		+ escapeString(bad[0])
		+ str.slice(bad.index + bad[0].length);
}

function handleParts(rhead, rtail, str) {
	var head = Array.isArray(rhead) ? rhead : regParts(rhead, str);
	var tail = Array.isArray(rtail) ? rtail : regParts(rtail, str);
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

	if (!head.length) {
		if (!head.length) console.warn('handleParts: no head part');
		if (!tail.length) console.warn('handleParts: no tail part');
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

		while (head[0] != null &&
			(tmpEnd = tmpEnd || tail[0].index) > head[0].index) {
			head.shift();
			end = tail.shift();
			end = end.index + end[0].length;
		}

		if (end > start)
			ret.push({ isPart : true, index : start, str : str.slice(start, end) });
		tmpEnd = null;
	}

	if (end < str.length)
		ret.push({ isPart : false, index : end, str : str.slice(end) });

	ret.str = str;
	return ret;
}