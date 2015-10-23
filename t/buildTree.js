var parseString = require('./parseString.js');
var utils = require('./utils.js');
module.exports = buildTree;

function buildTree(str) {
	var stack = typeof str === 'string'
		? parseString(str)
		: Array.isArray(str) && str.tagNames
		? str
		: null;
	if (!stack) {
		throw new Error('buildTree: not standard input arg');
	}

	var tracker = [];
	var parentIndex = false;
	var map = {};

	//the tree
	var tree = stack.reduce(function (memo, tag, index) {
		if (tag[0] !== '<' || !utils.rtag.test(tag)) {
			return memo;
		}

		var match = utils.rtag.exec(tag);
		if (!match) {
			throw new Error('buildTree: miss match tag: ' + tag);
		}

		var tagName = match[2];
		if (!tagName) {
			throw new Error('buildTree: miss match tagName: ' + tag);
		}

		var node = {
			istackStart : null,
			istackEnd : index,
			tagName : tagName,
			textContent : '',
			_attr : null,
			attributes : null,
			single : false,
			nodeType : 1,
			parentNode : null,
			children : [],
			parentIndex : parentIndex,
			tagString : tag,
			itab : 0
		};

		var single = utils.isSingle(tag, tagName);
		if (single) {
			node.single = true;
			node.istackStart = node.istackEnd;
			node.attributes = utils.makeAttributes(tag);
			node.children = null;
			node._attr = (match[3] || '').replace(/\/$/, '');
			memo.push(node);
			return memo;
		}

		var isEnd = !!match[1];
		tracker.push({
			tagName : tagName,
			index : index,
			parentIndex : parentIndex,
			attributes : !isEnd && utils.makeAttributes(tag),
			tagString : tag,
			_attr : !isEnd && (match[3] || '').replace(/\/$/, '');
		});
		if (!isEnd) {
			parentIndex = index;
			return memo;
		}

		var endTag = tracker.pop();
		var startTag = tracker.pop();
		if (endTag.tagName !== startTag.tagName) {
			console.log(startTag);
			console.log(endTag);
			throw new Error('buildTree: ' + endTag.tagName + ' !== ' + startTag.tagName);
		}

		node.attributes = startTag.attributes;
		node.istackStart = startTag.index;
		node.textContent = stack.slice(node.istackStart + 1, node.istackEnd).join('');
		node.parentIndex = node.istackStart === 0 ? false : startTag.parentIndex || 0;
		node.tagString = startTag.tagString + '{{ninja}}' + node.tagString;
		node._attr = startTag._attr;

		map[node.istackStart] = node;
		parentIndex = startTag.parentIndex;

		memo.push(node);
		return memo;
	}, [])
	.sort(function (a, b) {
		return a.istackStart - b.istackStart;
	})
	.map(function (node, index) {
		if (index > 0) {
			node.parentNode = map[node.parentIndex];
			map[node.parentIndex].children.push(node);
			node.itab = node.parentNode.itab + 1;
		}

		return node;
	});

	if (tracker.length) {
		console.log(tracker);
		throw new Error('buildTree: tracker not empty');
	}

	tree.stack = stack;
	tree.indexMap = map;
	tree.renderStack = stack.slice();

	return tree;
}