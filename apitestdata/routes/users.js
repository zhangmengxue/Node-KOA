var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/userlist', function(req, res) {
  var db = req.db;
  var collection = db.get('userlist');
  collection.find({},{},function(e,docs){
    res.json(docs);
  });
});

router.post('/adduser',function(req,res){
  var db = req.db;
  var collection = db.get('userlist');
  collection.insert(req.body,function(err,result){
    res.send(
      (err == null) ? {msg:''} : {msg:err}
      );
  });
});

router.delete('/deleteuser/:id',function(req,res){
  var db = req.db;
  var collection = db.get('userlist');
  //通过请求传过来的要删除的user的id
  var userToDelete = req.params.id;
  collection.remove({'_id':userToDelete},function(err){
    res.send((err == null)?{msg:''}:{msg:'error'+err});
  });
});

module.exports = router;
