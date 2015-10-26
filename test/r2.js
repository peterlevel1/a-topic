var rscriptHead = /<script[^>]*>/;
var rscriptTail = /([^'"]*|)<\/script>/;
var rquote = /('[\']*?'|"[^"]*")/;
var rnotQuote = /[^'"]*(?!<\/script>)/;



// var rTail = /[^'"]*?(?:'[\']*?'|"[^"]*?"|)<\/script>/;
var stack = [];
var one;
var index = 0;

var str =
		'<div> aaa </div>'
	+	'<script>'
	+ 	'var $node1 = $("<script></script>")'
	+ 	'var $node2 = $("<script/>")'
	+ 	'var $node3 = $("<script>")'
	+ 	'var $node4 = $("</script>")'
	+   'var a = b;'
	+	'</script>'
	+	'<script>'
	+		'var a = function () {'
	+		'	var b = "<script></script>" '
	+		'};'
	+	'</script>';

var one;

var r1 = /<script[^>]*>/g;
var arr1 = [];
while(one = r1.exec(str)) {
	arr1.push(one);
}
var r3 = /['"]/;
var a = arr1.shift();
while() {
	one = arr1[0];
	var b =
	if (r3.test(one)) {

	}

	arr1.push(one);
}
// var r2 = /<\/script>/g;
// var arr2 = [];
// while(one = r2.exec(str)) {
// 	arr2.push(one);
// }

console.log(arr1);
// console.log(arr2);

// function s(str) {
// 	if (one = str.match(rscriptHead)) {
// 		stack.push(str.slice(0, one.index + one[0].length));
// 		str = str.slice(one.index + one[0].length);

// 		while (one = str.match(rpart)) {
// 			console.log(one[1]);
// 			stack.push(str.slice(0, one.index + one[0].length));
// 			str = str.slice(one.index + one[0].length);
// 		}

// 		console.log(stack);
// 	}
// }

// s(str);

/**
 * 1) script head
 * 2 - 1) rnotQuote ?! scriptTail
 * 2 - 1 - 1) rquote
 * 2 - 1 - 2) 211 -> 212 -> 211 -> 212 -> ...
 * 2 - 1 - 3) (rnotQuote|) + scriptTail
 * 2 - 2) (rnotQuote|) + scriptTail
 */
