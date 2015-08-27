var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
//database
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/restdata');

//app.use()里面没有函数
app.use(bodyParser.urlencoded({ extended : true}));
app.use(bodyParser.json());

app.use(express.static(__dirname+'/public'));

var collectorder = db.get('orderlist');
var collectuser = db.get('userlist');


app.get('/orders',function(req,res){
  collectorder.find({},{limit:20},function(err,orders){
    res.json(orders);
  });
});
app.get('/users',function(req,res){
  collectuser.find({},{},function(err,users){
    res.json(users);
  });
});

app.get('/users/:name',function(req,res){
  //var collection = db.get(req.params.name);
  //console.log(req.params.name);
  collectuser.find({name:req.params.name},{},function(err,docs){
    res.json(docs);
  });
});

//客户端通过请求adduser接口post数据进入数据库
// app.post('/adduser',function(req,res){
//   var db = req.db;
//   collectuser.insert(req.body,function(err,result){
//     res.send(
//       (err == null) ? {msg:''}:{msg:err}
//       );
//   });
// });




app.listen(3000);


