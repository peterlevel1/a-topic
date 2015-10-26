

// var str = '<!--[if lt IE 9]>\
// <script src="http://static.zhihu.com/static/components/respond/dest/respond.min.js"></script>\
// <link href="http://static.zhihu.com/static/components/respond/cross-domain/respond-proxy.html" id="respond-proxy" rel="respond-proxy" />\
// <link href="/static/components/respond/cross-domain/respond.proxy.gif" id="respond-redirect" rel="respond-redirect" />\
// <script src="/static/components/respond/cross-domain/respond.proxy.js"></script>\
// <![endif]-->'
// + '  aaaaaaaaaa <div>aasasa</div>'

// + '<!--[if lt IE 9]>\
// <script src="http://static.zhihu.com/static/components/respond/dest/respond.min.js"></script>\
// <link href="http://static.zhihu.com/static/components/respond/cross-domain/respond-proxy.html" id="respond-proxy" rel="respond-proxy" />\
// <link href="/static/components/respond/cross-domain/respond.proxy.gif" id="respond-redirect" rel="respond-redirect" />\
// <script src="/static/components/respond/cross-domain/respond.proxy.js"></script>\
// <![endif]-->';

// var output = str.replace(rcomment, '');
// console.log(output);
// var rscript2 = /<script[^>]*>([\s\S]+?(?=\<\/script\>)|)?[^'"]*<\/script>/ig;
// var str = '<div>bbb</div> <script> "<script> heihei </script> jijiji" </script> aaaa';
// var output = str.replace(rscript2, '');
// console.log(output);

// var rscriptHead = /<script[^>]*>[^'"]*(?!<\/script>)/g;
// var rscriptTail = /<\/script>/g;
// var one;
// var ret = [];
// while (one = rscriptHead.exec(str)) {
// 	console.log(one);
// }
// while (one = rscriptTail.exec(str)) {
// 	console.log(one);
// }
var str =
	'<div>'
	+ '<script>'
	+ ' aaa "<script> ddd </script>" ccc'
	+ '</script>'
	+ '<script> asasas </script>'
	+'</div>';

function regParts(reg, str) {
	var ret = [];
	ret.str = str;

	var one;
	while (one = reg.exec(str)) ret.push(one);

	return ret;
}

var rscriptHead = /<script[^>]*>/ig;
var rscriptTail = /<\/script>/ig;
function handleScripts(str) {
	return handleParts(rscriptHead, rscriptTail, str);
}

var rcommentHead = /<!--/ig;
var rcommentTail = /-->/ig;
function handleComments(str) {
	return handleParts(rcommentHead, rcommentTail, str);
}

function handleParts(rhead, rtail, str) {
	var head = regParts(rhead, str);
	var tail = regParts(rtail, str);

	if (!head.length)
		throw new Error('handleParts: no parts');

	if (head.length !== tail.length)
		throw new Error('handleParts: len not equal: ' + head.length + ' !== ' + tail.length);

	var ret = [];
	ret.str = str;

	var start = 0;
	var end = 0;
	var tmpEnd;

	while (head[0] != null) {
		start = head[0].index;
		ret.push({ isPart : false, str : str.slice(end, start) });
		tmpEnd = tail[0].index;

		while (head[0] != null && head[0].index < tmpEnd) {
			 head.shift();
			 end = tail.shift();
			 end = end.index + end[0].length;
		}
		ret.push({ isPart : true, str : str.slice(start, end) });
	}

	ret.push({ isPart : false, str : str.slice(end) });
	return ret;
}

// var ret = handleScripts(str)
// console.log(ret);

var fs = require('fs');
var str = fs.readFileSync('./111.html', 'utf8');
// var ret = handleScripts(str);
var ret = handleComments(str);
console.log(ret);

// var rscript = /(<script[^>]*>)([\s\S]+?(?=\<\/script\>)|)?(<\/script>)/i;
// var rleft = /(?:[\s\S]+?(?=\<\/script\>)|)?<\/script>/i;

// var ret = [];
// var d = true;
// var g = true;
// var end = 0;

// while (g) {
// 	g = false;
// 	d = false;

// 	str2.replace(rscript, function (all, a, b, c, index) {
// 		g = true;
// 		if (/["']/.test(b)) {
// 			d = true;
// 		}
// 		else {
// 			d = false;
// 		}
// 		ret.push(str.slice(end, end + index));
// 		ret.push(str.slice(end + index, end + index + all.length));
// 		end += index + all.length;
// 	});

// 	if (d) {
// 		g = false;
// 		str2.replace(rleft, function (all, index) {
// 			g = true;
// 			ret[ret.length - 1] += all;
// 			end += index + all.length;
// 		});

// 		if (!g) {
// 			throw new Error('has \'\" but not capture');
// 		}
// 	}

// 	if (g) {
// 		str2 = str2.slice(end);
// 	}
// }
// ret.push(str.slice(end));
// console.log(ret);

	// console.log(c);
	// console.log(index);
	// console.log(index + c.length);
	// console.log(a);
	// console.log(b);
	// console.log(c);
	// console.log(index);
	// console.log(str.slice(0, index));
	// console.log(str.slice(index, index + a.length + b.length + c.length));
	// console.log(str.slice(index + a.length + b.length + c.length));


	utils.handleScripts2 = function(str) {
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

var _bad = bad[0];
index = bad.index;
bad = escapeString(_bad);
str = str.replace(_bad, bad);
var delta = bad.length - _bad.length;
var l;

l = head.length;
while (l--) {
if (head[l].index >= index) head[l].index += delta;
else break;
}

l = tail.length;
while (l--) {
if (tail[l].index >= index) tail[l].index += delta;
else break;
}

var rcommentHead = utils.rcommentHead = /<!--/ig;
var rcommentTail = utils.rcommentTail = /-->/ig;
utils.handleComments = function(str) {
	return handleParts(rcommentHead, rcommentTail, str);
};

//script only match two exist together;
var rquote = /['"]/;
var rscriptHead = utils.rscriptHead = /<script[^>]*>/ig;
var rscriptTail = utils.rscriptTail = /<\/script>/ig;
utils.handleScripts = function(str) {
	var tail = regParts(rscriptTail, str);
	var head = regParts(rscriptHead, str);
	var end;
	var start;
	var tmpEnd;
	var tmpStart;
	var stack = [];
	var bad;
	var index;

	while (start = start || head.shift()) {
		tmpStart = start;
		tmpEnd = tail.shift();

		if (tmpEnd) {
			index = tmpEnd.index;
			while (tmpStart && tmpStart.index < index) {
				end = tail.shift();
				tmpStart = head.shift();
			}
		}

		if (end) {
			index = start.index + start[0].length;
			if (end.index > index) {
				bad = str.slice(index, end.index);
				//bug here:
				if (!rquote.test(bad)) {
					stack.push({ start : index, end : end.index, str : bad });
				}
			}
			end = null;
		}
		start = null;
	}

	if (stack.length) {
		end = 0;
		// [end 	+     start str] end...
		//start + [<script>| bad |</script>]... + tail
		str = stack.reduce(function (memo, one) {
			memo += (one.start > end
				? str.slice(end, one.start)
				: '')
				+ escapeString(one.str);
			end = one.end;
			return memo;
		}, '') + str.slice(end);
	}

	while (end = tail.shift()) {
		str = escapeBad(str, end);
	}

	head = regParts(rscriptHead, str);
	tail = regParts(rscriptTail, str);

	return handleParts(head, tail, str);
};
