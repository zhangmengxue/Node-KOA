var fs = require('fs');
var path = require('path');

module.exports = function(dir,cb){
  fs.readdir(dir,function(err,files){
    if(err) return cb(err);
    var paths = files.map(function(file){
      return path.join(dir,file);
    });

    getStats(paths,function(err,stats){
      if(err) return cb(err);
      var largestFile = getLargestFile(files,stats);
      cb(null,largestFile);
    });

  });
}

//获取文件的相关信息
function getStats(paths,cb){
  var counter = paths.length;
  var errored = false;
  var stats = [];
  paths.forEach(function(path,index){
    fs.stat(path,function(err,stat){
      //查看对应文件的相关信息
      //console.log(path+':'+ JSON.stringify(stat));
      if(err) return ;
      if(err){
        errored = true;
        return cb(err);
      }
      stats[index] = stat;
      if(--counter == 0){
        cb(null,stats);
      }
    });
  });
}

//获取最大的文件
function getLargestFile(files,stats){
  var largest = stats
    .filter(function(stat){return stat.isFile()})
    .reduce(function(prev,next){
      if(prev.size > next.size) return prev;
      return next;
    })
    return files[stats.indexOf(largest)];
}
