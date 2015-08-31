var fs = require('fs');
var async = require('async');
var path = require('path');

module.exports = function(dir,cb){
  //async.waterfall 提供一系列的执行，data可以从一个函数传递到下一个函数中，通过名为next的callback
  async.waterfall([
    function(next){
      fs.readdir(dir,next);
    },
    function(files,next){
      var paths = files.map(function(file){ return path.join(dir,file) });
      //async.map 可以并行的执行fs.stat然后返回一个结果数组
      async.map(paths,fs.stat,function(err,stats){
        next(err,files,stats);
      })
    },
    function(files,stats,next){
      console.log(stats);
      var largest = stats
        .filter(function(stat){return stat.isFile()})
        .reduce(function(prev,next){
          if(prev.size > next.size) return prev;
            return next;
        })
        next(null,files[stats.indexOf(largest)]);
    }
  ],cb)
}
