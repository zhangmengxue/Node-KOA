var kc = require('..');
var koa = require('koa');

var app = koa();
app.use(kc.tools());
app.use(kc.router({
  routesPath: __dirname+'/routes.js',
  controllerPath: __dirname+'/{controller}.js',
  constraintPath: __dirname+'/{constraint}.js'
}));
app.listen(3001);
