var koa = require('koa');
var app = koa();

//获取当前请求的路径
app.use(function *(){
    //var path = this.path;
    this.body = '<span>this is test</span>';
});

app.listen(3366);

