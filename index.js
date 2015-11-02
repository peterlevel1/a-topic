var argv = process.argv.slice(2);
var topic = argv[0] || 'http://www.zhihu.com/question/27331509';
var INTERVAL = argv[1] && (argv[1] -= 0) >= 3 * 1000
  ? argv[1]
  : 10 * 1000;
var cmd = 'curl -o page-main.html ' + topic;
var exec = require('child_process').exec;
var assert = require('assert');
var fs = require('fs');
var readFile = fs.readFile;
var writeFile = fs.writeFile;
var inputFile = './page-main.html';
var outputFile = './page-out.html';
var prevLen = null;
var curLen = null;
var tmpl_1 = fs.readFileSync('./tmpl-1.html', 'utf8');
var goOn = true;
var prevRet = [];
var child;
//----
var t = require('t');
var parseString = t.parseString;
var buildTree = t.buildTree;
var utils = t.utils;
var treeWalker = t.treeWalker;

curlCmd(cmd);

function curlCmd(cmd) {
  var opt = { maxBuffer : 200 * 1024 };
  exec(cmd, opt, function (err, stdout, stderr) {
    if (err != null) {
      return console.log('exec error: ' + err);
    }

    readFile(inputFile, 'utf8', function (err, str) {
      if (err != null) {
        throw err;
      }
      str += '';

      //set curLen
      curLen = str.length;

      //if same
      if (prevLen === curLen) {
        console.log('not change');
        setTimeout(curlCmd, INTERVAL, cmd);
        return;
      }
      prevLen = curLen;

      setContent(str);

      if (goOn) {
        setTimeout(curlCmd, INTERVAL, cmd);
      } else {
        console.log('not go on! sth err!');
      }
    });
  });
}

function setContent(str) {
  var output = utils.getBody(str)
    .replace(utils.rscript, '')
    .replace(utils.rcomment, '');
  var arr = parseString(output);
  var tree = buildTree(arr);
  var rootNode = tree.indexMap[0];
  var target = 'zm-item-answer ';
  var ret = [];
  var isOut = false;

  treeWalker(rootNode, function (node, y, x) {
    var attr = node.attributes;
    var clazz = attr && attr['class'];
    if (clazz && (clazz += ' ').indexOf(target) >= 0) {
      ret.push(node.tagString.replace('{{ninja}}', node.textContent));
    }
  });

  try {
    assert.deepEqual(ret, prevRet, 'prev is the same with cur');
  } catch (err) {
    isOut = true;
  }
  prevRet = ret;

  if (!isOut) {
    console.log('prev equals cur');
    return;
  }

  var result = tmpl_1.replace('{{content}}', ret.join(''));

  writeFile(outputFile, result, function (err, str) {
    if (err != null) {
      goOn = false;
      throw err;
    }

    console.log('outputFile done');
  });
}