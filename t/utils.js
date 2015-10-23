var utils = module.exports;

var rtag = /<(\/)?([\w]+)([^>]+|)?>/;
utils.rtag = rtag;

var rtag_g = /<[^>]+>/g;
utils.rtag_g = rtag_g;

var singleTags = 'link br hr meta input img base param'.split(' ');
utils.singleTags = singleTags;

var isSingle = function (tag, tagName) {
	return tag[tag.length - 2] === '/' ||
		( (tagName ||
			(tagName = (rtag.exec(tag) || [])[2]) ) &&
			singleTags.indexOf(tagName) >= 0 );
};
utils.isSingle = isSingle;

var rattr = / +([\w-]+)(?:=\"([^\"]+)\"|=\'([^\']+)\'|)?/g;
utils.rattr = rattr;

var makeAttributes = function (str) {
	var one;
	var node = {};
	while ((one = rattr.exec(str))) {
		node[one[1]] = one[2] || true;
	}
	return node;
};
utils.makeAttributes = makeAttributes;

var isTag = function (tag) {
	return rtag.test(tag);
};
utils.isTag = isTag;

var matchTag = function (tag) {
	return isTag(tag) && tag.match(rtag);
};
utils.matchTag = matchTag;

var isTagEnd = function (tag) {
	return isTag(tag) && tag[1] === '/';
};
utils.isTagEnd = isTagEnd;

var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
utils.rtrim = rtrim;

var trim = function (text) {
	return text == null
		? ""
		: ( text + "" ).replace( rtrim, "" );
};
utils.trim = trim;

//not greedy match
var rscript = /<script[^>]*>([\s\S]+?(?=\<\/script\>)|)?<\/script>/ig;
utils.rscript = rscript;

var rcomment = /<!--([\s\S]+?(?=\-\-\>)|)?-->/ig;
utils.rcomment = rcomment;

var rbody = /<body[^>]*>[\s\S]+<\/body>/;
utils.rbody = rbody;

var getBody = function (str) {
	str = (str.match(rbody) || [])[0];

	if (!str)
		throw new Error('getBody: str no body!');

	return str;
};
utils.getBody = getBody;