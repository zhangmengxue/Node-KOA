var app = require('koa')();
var router = require('koa-router');
var config = require('./config/config');

//特别需要注意的是get的第一个参数'/'时候,访问的路径要写成这样：http://localhost:3333/
//app.use(router(app)).get('/',function *(next){
//    this.body = config.env;
//});
//特别需要注意的是get的第一个参数'/config'时候,访问的路径要写成这样：http://localhost:3333/config
app.use(router(app)).get('/config',function *(next){
    this.body = config.env;
});
app.listen(3333);