var parseString = require('./parseString.js');
var utils = require('./utils.js');
var _util = require('util');
module.exports = buildTree;

function Node(opts) {
	this.textContent = '';
	this.nodeType = 0;
	this.parentNode = null;
	this.children = null;
}

// 1	Element	代表元素	Element, Text, Comment, ProcessingInstruction, CDATASection, EntityReference
// 2	Attr	代表属性	Text, EntityReference
// 3	Text	代表元素或属性中的文本内容。	None
// 4	CDATASection	代表文档中的 CDATA 部分（不会由解析器解析的文本）。	None
// 5	EntityReference	代表实体引用。	Element, ProcessingInstruction, Comment, Text, CDATASection, EntityReference
// 6	Entity	代表实体。	Element, ProcessingInstruction, Comment, Text, CDATASection, EntityReference
// 7	ProcessingInstruction	代表处理指令。	None
// 8	Comment	代表注释。	None
// 9	Document	代表整个文档（DOM 树的根节点）。	Element, ProcessingInstruction, Comment, DocumentType
// 10	DocumentType	向为文档定义的实体提供接口	None
// 11	DocumentFragment	代表轻量级的 Document 对象，能够容纳文档的某个部分	Element, ProcessingInstruction, Comment, Text, CDATASection, EntityReference
// 12	Notation	代表 DTD 中声明的符号。	None
Node.ELEMENT_NODE = 1;
Node.ATTRIBUTE_NODE = 2;
Node.TEXT_NODE = 3;
Node.CDATA_SECTION_NODE = 4;
Node.ENTITY_REFERENCE_NODE = 5;
Node.ENTITY_NODE = 6;
Node.PROCESSING_INSTRUCTION_NODE = 7;
Node.COMMENT_NODE = 8;
Node.DOCUMENT_NODE = 9;
Node.DOCUMENT_TYPE_NODE = 10;
Node.DOCUMENT_FRAGMENT_NODE = 11;
Node.NOTATION_NODE = 12;

Node.createElement = function (tagName) {};
Node.createTextNode = function (str) {};

Node.prototype.helloWorld = function () {
	console.log('helloWorld, I am: ' + this.tagName + ', attr: ' + this._attr);
};

function ElementNode(opts) {
	Node.call(this, opts);

	this.istackEnd = opts.istackEnd || null;
	this.tagName = opts.tagName || '';
	this.parentIndex = opts.parentIndex || false;
	this.tagString = opts.tagString || '';

	this.istackStart = opts.istackStart || null;
	this._attr = opts._attr || '';
	this.single = opts.single || false;
	this.depth = opts.depth || 0;

	this.textContent = opts.textContent || '';
	this.attributes = opts.attributes || {};
	this.children = opts.children || [];
	this.parentNode = opts.parentNode || null;
	this.nodeType = Node.ELEMENT_NODE;

	this.innerHTML = '';
	this.nodeName = '';
	this.nodeValue = '';
	this.style = {};
}

_util.inherits(ElementNode, Node);
ElementNode.prototype.addEventListener = function () {};
ElementNode.prototype.removeEventListener = function () {};
ElementNode.prototype.querySelector = function () {};
ElementNode.prototype.querySelectorAll = function () {};
ElementNode.prototype.contains = function () {};
ElementNode.prototype.matches = function () {};
ElementNode.prototype.replaceChild = function () {};
ElementNode.prototype.insertBefore = function () {};
ElementNode.prototype.appendChild = function () {};
ElementNode.prototype.removeChild = function () {};
ElementNode.prototype.getElementsByTagName = function () {};
ElementNode.prototype.createAttribute = function () {};
ElementNode.prototype.getAttribute = function () {};
ElementNode.prototype.setAttribute = function () {};
ElementNode.prototype.removeAttribute = function () {};

// DocumentElementNode.prototype.createElement = function () {};
// DocumentElementNode.prototype.createTextNode = function () {};
// DocumentElementNode.prototype.getElementById = function () {};

function setSingleNode(node, map, tag, match) {
	node.single = true;
	node.istackStart = node.istackEnd;
	node.attributes = utils.makeAttributes(tag);
	node.children = null;
	node._attr = (match[3] || '').replace(/\/$/, '');
	map[node.istackStart] = node;
}

function setNode(node, map, startTag, stack) {
	node.attributes = startTag.attributes;
	node.istackStart = startTag.index;
	node.textContent = stack.slice(node.istackStart + 1, node.istackEnd).join('');
	node.parentIndex = node.istackStart === 0 ? false : startTag.parentIndex || 0;
	node.tagString = startTag.tagString + '{{ninja}}' + node.tagString;
	node._attr = startTag._attr || '';
	map[node.istackStart] = node;
}

function getNewElementNode(opts) {
	return new ElementNode(opts);
}

function getStack(str) {
	return typeof str === 'string' ? parseString(str) :
		Array.isArray(str) && str.tagNames ? str :
		null;
}

function buildStructure(stack, tracker, parentIndex, map) {
	return function (memo, tag, index) {
		if (tag[0] !== '<' || !utils.rtag.test(tag))
			return memo;

		var match = utils.rtag.exec(tag);
		var tagName = (match || [])[2];
		if (!match || !tagName)
			throw new Error('buildTree: miss match tag: ' + tag);

		var node = getNewElementNode({
			istackEnd: index,
			tagName: tagName,
			parentIndex: parentIndex,
			tagString: tag
		});

		if (utils.isSingle(tag, tagName)) {
			setSingleNode(node, map, tag, match);
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
			_attr : match[3] || ''
		});
		if (!isEnd) {
			parentIndex = index;
			return memo;
		}

		var endTag = tracker.pop();
		var startTag = tracker.pop();
		if (endTag.tagName !== startTag.tagName)
			throw new Error('buildTree: ' + endTag.tagName + ' !== ' + startTag.tagName);

		setNode(node, map, startTag, stack);
		parentIndex = startTag.parentIndex;
		memo.push(node);
		return memo;
	};
}

function sortNodesOrder(a, b) {
	return a.istackStart - b.istackStart;
}

function setNodesRelation(map) {
	return function (node, index) {
		if (index > 0) {
			node.parentNode = map[node.parentIndex];
			node.parentNode.children.push(node);
			node.depth = node.parentNode.depth + 1;
		}
		return node;
	};
}

function buildTree(str) {
	var stack = getStack(str);
	if (!stack)
		throw new Error('buildTree: not standard input arg');

	var tracker = [], parentIndex = false, map = {},
		__buildStructure = buildStructure(stack, tracker, parentIndex, map),
		__setNodesRelation = setNodesRelation(map),
		tree = stack.reduce(a, []).sort(sortNodesOrder).map(b);

	if (tracker.length)
		throw new Error('buildTree: tracker not empty: ' + tracker.join(''));

	__buildStructure = null;
	__setNodesRelation = null;

	tree.stack = stack;
	tree.indexMap = map;
	tree.renderStack = stack.slice();

	return tree;
}

// var str = '<div> <ul id="ul-1"> asas </ul> </div>';
// var tree = buildTree(str);
// console.log(tree);
// tree[1].helloWorld();