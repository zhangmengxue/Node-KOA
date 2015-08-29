var koa = require('koa');
var route = require('koa-route');
var app = module.exports = koa();
var monk = require('monk');
var wrap = require('co-monk');
var db = monk('localhost:27017/apitest');
var books = wrap(db.get('books'));

app.use(route.get('/book',list));
app.use(route.get('/book/:title',show));

function *list(){
  var res = yield books.find({});
  this.body = res;
}

function *show(){
  title = decodeURI(title);
  var res = yield books.find({title:title});
  this.body = res;
}

if(!module.parent) app.listen(3000);
