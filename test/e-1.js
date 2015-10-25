require(['./output-ejs-1', './ejs'], function (o, ejs) {
	console.log(o);
	console.log(ejs);
	var data = {
		x : '11111111111',
		y : '22222222222'
	};
	var str = ejs.render(o, data);
	console.log(str);
})