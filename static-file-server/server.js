var fs = require('fs');
var path = require('path');
var http = require('http');

var dir = './';

http.createServer(function(request,response){
  response.writeHead(200, {'Content-Type': 'text/html' });
  //response.write(new Buffer(names));
  fs.readdir(dir,function(err,files){
    files.forEach(function(filename){
      var filepath = path.join(dir,filename);
      response.write('<a href="'+dir+filename+'">'+filename+'</a><br>');
      // fs.stat(filepath,function(err,stat){
      //   if(stat.isDirectory()){
      //     //readFile(filename);
      //   }else{
      //     http.get("http://localhost:8000/"+filename, function(res) {
      //     fs.readFile(filepath,function(err,data){
      //         response.write(data.toString());
      //       });
      //     }).on('error', function(e) {
      //       console.log("错误：" + e.message);
      //     });
      //   }
      // });

    });
    response.end();
  });
}).listen(8000);





