### 知识点

+ 1.koa使用app.use（）注入中间件；
+ 2.所有的koa中间件不许时generator function也就是说必须是function *(){}的写法，不然会报错的；
+ 3.中间件上下文的this指向用户当前的请求（this中的信息很多的）；
+ 4.this.body用于控制输出到页面中的内容；
+ 5.app.use()其实就是将中间件放入一个数组中，真正的执行逻辑是：

```javascript
    app.listen(3366);
```
koa的listen()除了指定http的服务端口号之外，还会启动http server等价于：

```javascript
    var http = require('http');
    http.createServer(app.callback()).listen(3366);
```
那这种复杂的写法有什么作用呢？在启动https的服务的时候就很有用：

```javascript
    var http = require('http');
    http.createServer(app.callback()).listen(3366);
```

### 问题：

+ 报错： Error: listen EADDRINUSE
+ 原因： 监听的端口已经被占用
+ 解决： 更换监听的端口
