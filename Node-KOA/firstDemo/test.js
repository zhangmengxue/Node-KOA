var app = require('koa')();
var router = require('koa-router');
var config = require('./config/config');

//app.use(router(app)).get('/',function *(next){
//    this.body = config.env;
//});
app.use(router(app)).get('/config',function *(next){
    this.body = config.env;
});
app.listen(3333);