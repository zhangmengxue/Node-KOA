var http = require('http');
var https = require('https');
var fs = require('fs');

http.get("http://www.cnblogs.com/hustskyking/", function(res) {
  console.log("响应：" + res.statusCode);
  //console.log(res);
  var body = [], len = 0;

  res.on("data", function(chunk){
  	body.push(chunk);
  	len += chunk.length;
  });
  res.on("end", function(){
  	body = Buffer.concat(body, len);
  	var bodyStr = body.toString();
  	getTitle(bodyStr);
  	//console.log(bodyStr);
  });
}).on('error', function(e) {
  console.log("错误：" + e.message);
});

var getTitle = function(bodyStr){
 //var matches = bodyStr.match(/href=".*?\.html"/g);
 var matches = bodyStr.match(/<a(.*?)class="PostTitle"(.*?)<\/a>/g);
  console.log(matches);
  var res = matches.join('\n');
  writeIntoFile(res);

};

var writeIntoFile = function(str){
	fs.writeFile('index.txt', str, function (err) {
	    if (err) throw err;
	    console.log('数据已保存～');
	});
}