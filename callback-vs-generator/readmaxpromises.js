var fs = require('fs');
var path = require('path');
var Q = require('q');
var fs_readdir = Q.denodeify(fs.readdir);
var fs_stat = Q.denodeify(fs.stat);

module.exports = function(dir){
  return fs_readdir(dir)
    .then(function(files){
      var promises = files.map(function(file){
        return fs_stat(path.join(dir,file));
      })
      return Q.all(promises).then(function(stats){
        return [files,stats];
      })
    })
    .then(function(data){
      var files = data[0];
      var stats = data[1];
      console.log(stats);
      console.log(files);
      var largest = stats
        .filter(function(stat){return stat.isFile()})
        .reduce(function(prev,next){
          if(prev.size > next.size) return prev
           return next
        })
      return files[stats.indexOf(largest)];
    })
}
