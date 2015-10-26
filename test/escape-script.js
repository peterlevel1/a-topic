// var str = '"';
// console.log(escapeString(str));
var utils = require('../t/utils.js');
var str =
		'<script>' + 			//8 8
			'"a"' +					//3 11
		'</script>' + 		//9 20
		'<script>' +			//8 28
			'"b"' + 				//3 31
			'"<script></script>"' + // 1 + 8 + 9 + 1 = 19: 50
		'</script>'; // 9

// console.time('aaa');
var ret = utils.handleScripts(str);
// console.timeEnd('aaa');
// console.log(ret.length);
// console.log(ret);