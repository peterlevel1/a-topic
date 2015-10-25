var buildTree = require('../t/buildTree.js');

var str = '<div id="div-1">  <link rel="stylesheet" href="#" /> <ul> <li> <a href="#"> aaa </a> </li> </ul> </div>'

var tree = buildTree(str);
console.log(tree[0].children.length);