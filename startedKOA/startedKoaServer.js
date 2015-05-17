var koa = require('koa');
var app = koa();
var router = require('koa-router');

app.use(router(app));

var requestTime = function(headerName){
	return function *(next){
		var start = new Date();
		yield next;
		var end = new Date();
		var ms = end - start;
		this.set(headerName,ms+'ms');
	}
}

app.use(requestTime('Response-time'));

// app.use(function *(){
// 	console.log(this.request);
// 	var url = this.request.url;
// 	if(url === '/'){
// 		this.body = 'Hello koajs';
// 	}else if( url === '/date'){
// 		this.body = new Date();
// 	}else{
// 		this.status = 404;
// 		this.body = 'sorry,i have nothing found';
// 	}

// });

app.get('/',function *(){
	this.body = 'hello koajs';
});

app.get('/date',function *(){
	this.body = new Date();
});

app.listen(3000);