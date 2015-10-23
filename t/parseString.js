var utils = require('./utils.js');

module.exports = function parseString(str) {
	str = utils.trim(str);
	var tags = str.match(utils.rtag_g);
	var texts = str.split(utils.rtag_g);
	texts.pop();
	texts.shift();

	if (texts.length + 1 !== tags.length) {
		throw new Error('parseString: not standard input str');
	}

	var ret = [];
	ret.tagNames = [];

	var tagName;
	var stack = [];
	var tag;
	var startTagName;
	var match;

	for (var i = 0, l = tags.length; i < l; i++) {
		tag = tags[i];
		match = utils.rtag.exec(tag);
		tagName = match[2];

		if (!match[1]) {
			if (!~ret.tagNames.indexOf(tagName)) {
				ret.tagNames.push(tagName);
			}
		}

		ret.push(tag, texts[i]);

		if (!utils.isSingle(tag, tagName)) {
			stack.push(tagName);
			if (match[1]) {
				stack.pop();
				startTagName = stack.pop();
				if (startTagName !== tagName) {
					console.log(startTagName, tagName, i, stack);
					throw new Error('parseString: startTagName !== endTagName');
				}
			}
		}
	}
	ret.pop();

	if (stack.length) {
		console.log(stack);
		throw new Error('parseString: stack no empty');
	}

	return ret;
}