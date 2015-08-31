var fs = require('fs');
var path = require('path');

module.exports = function(dir,cb){
  //获取当前目录下的所有文件
  fs.readdir(dir,function(err,files){
    if(err) return cb(err);
    //用于标识所有的文件IO操作已完成
    var counter = files.length;
    //为了避免出错时的callback被调用多次
    var errored = false;
    var stats = [];
    files.forEach(function(file,index){

      fs.stat(path.join(dir,file),function(err,stat){
        //console.log(stat);
        //stat（中文：统计）中包含了文件的一些相关信息
        if(errored) return;
        if(err){
          errored = true;
          return cb(err);
        }
        stats[index] = stat;

        if(--counter == 0){
          var largest = stats
            .filter(function(stat){return stat.isFile()})
            .reduce(function(prev,next){
              if(prev.size > next.size) return prev;
              return next;
            })
          cb(null,files[stats.indexOf(largest)]);
        }
      });

    });
  });
}
