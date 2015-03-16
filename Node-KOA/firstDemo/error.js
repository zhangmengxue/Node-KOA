var koa = require('koa');
//优化错误信息的中间件koa-onerror
var onerror = require('koa-onerror');
var app = koa();
onerror(app);

//err-错误对象 ctx-发生请求的上下文
//process.env.NODE_ENV 是环境变量配置  process.env.NODE_ENV != 'test' 表示不是单元测试环境时
app.on('error',function(err,ctx){
    if(process.env.NODE_ENV != 'test'){
        console.log(err.message);
        console.log(err);
    }
});
app.use(function *(){
    //抛出异常必须是Error的实例
    throw new Error('demo error');
});
app.listen(3366);