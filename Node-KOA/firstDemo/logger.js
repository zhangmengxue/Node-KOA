var koa = require('koa');
var app = koa();
var Logger = require('mini-logger');
var config = require('./config/config.js');
//dir:指定日志放在哪里 categories:自定义日志的分类 format:日志文件名格式
app.use(function *(){
    var logger = Logger({
        dir: config.logDir,
        categories:['router','model','controller'],
        format:'YYYY-MM-DD-[{category}][.log]'
    });

    if(logger){
        this.body = 'true';
    }
});
app.listen(3366);

