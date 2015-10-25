var utils = require('../t/utils.js');
var fs = require('fs');
var str = fs.readFileSync('./111.html', 'utf8');
var ret = utils.handleScripts(str);
console.log(ret);

var ret = utils.handleComments(str);
console.log(ret);