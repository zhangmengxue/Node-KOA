var koa = require('koa');
var app = koa();
var router = require('koa-router');
app.use(router(app));
var config = require('./config/config');

app.use(function *(next){
    if(!this.config){
        this.config = config;
    }
    //this.body = this.config;
    yield  next;
});
app.get('/config',function *(){
    this.body = config;
});
app.listen(3333);