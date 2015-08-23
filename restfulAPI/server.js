var express = require('express');
var app = express();
var bodyParser = require('body-parser');

//app.use()里面没有函数
app.use(bodyParser.urlencoded({ extended : true}));
app.use(bodyParser.json());

var port = 8080;

var router = express.Router();

router.get('/',function(req,res){
  res.json({message:'hi,its my api!'});
});

app.use('/api/',router);

app.listen(port,function(){
console.log('our port start');

});
