var http = require('http');
var cookies = require('../t/cookies.js');

var server = http.createServer(function (req, res) {
	// console.log(req.headers);
	// console.log(req.rawHeaders);
	// var c = 'type="ninja", "language=javascript"'
	// response.setHeader("Set-Cookie", []);
	// console.log(res.setHeader.toString());
	console.log(req.headers);
	var cookies = 'sessionid="111"; Expires=100000; Domain=www.baidu.com; Path=/foo;';
	res.setHeader("Set-Cookie", cookies);
	res.setHeader('aaaa', 'bbbb');
	res.end('hello');
});

server.listen(8000, 'localhost', function () {
	console.log(3);
})