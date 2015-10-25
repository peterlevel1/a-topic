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

utils.rdoc = /<[!?]?(doctype|xml)[^>]+>/i;
utils.rxmlHead = /<\?[^>]+\?>/ig;
//not greedy match, inner script tag no "<script> ... </script>"
utils.rscript = /(<script[^>]*>)([\s\S]+?(?=\<\/script\>)|)?(<\/script>)/ig;
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
	ret.str = str;
	while (one = reg.exec(str)) ret.push(one);

	return ret;
}

function handleParts(rhead, rtail, str) {
	var head = regParts(rhead, str);
	var tail = regParts(rtail, str);
	var ret = [];
	ret.str = str;

	if (head.length && tail.length) {
		if (head.length > tail.length) {
			console.log('handleParts: head.length > tail.length');
			while (head.length > tail.length) head.shift();
		} else if (head.length < tail.length) {
			console.log('handleParts: head.length < tail.length');
			while (head.length < tail.length) tail.pop();
		}
	}

	if (!head.length || !tail.length) {
		if (!head.length) console.warn('handleParts: no head part');
		if (!tail.length) console.warn('handleParts: no tail part');
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

	return ret;
}