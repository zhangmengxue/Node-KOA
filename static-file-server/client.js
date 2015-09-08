
var fs = require('fs');
var path = require('path');

  var dir = './';
  fs.readdir(dir,function(err,files){
    files.forEach(function(filename){
      var filepath = path.join(dir,filename);
      fs.stat(filepath,function(err,stat){
        console.log(filename);
      });
    });
  });

