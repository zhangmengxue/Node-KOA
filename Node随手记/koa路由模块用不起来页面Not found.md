
###访问的问题:

当get的第一个参数'/'时候,访问的路径要写成这样：http://localhost:3333/

```javascript
app.use(router(app)).get('/',function *(next){
    this.body = config.env;
});
```
当get的第一个参数'/config'时候,访问的路径要写成这样：http://localhost:3333/config

```javascript
app.use(router(app)).get('/config',function *(next){
    this.body = config.env;
});
app.listen(3333);
```