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

var port = 8080;

var router = express.Router();

router.get('/',function(req,res){
  //res.json({message:'hi,its my api!'});
  var collection = db.get('orderlist');
  collection.find({},function(e,docs){
    res.json(docs);
  });
});


app.use('/api/',router);

app.listen(port,function(){
console.log('PORT start....');

});
