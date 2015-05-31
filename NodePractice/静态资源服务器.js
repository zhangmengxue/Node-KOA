var PORT = 8000;
var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');

var server = http.createServer(function(request,response){
	var pathname = url.parse(request.url).pathname;
    var realPath = pathname;
    path.exists(realPath, function (exists) {
        if (!exists) {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });

            response.write("This request URL " + pathname + " was not found on this server.");
            response.end();
        } else {
            fs.readFile(realPath, "binary", function (err, file) {
                if (err) {
                    response.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });

                    response.end(err);
                } else {
                    response.writeHead(200, {
                        'Content-Type': 'text/html'
                    });

                    response.write(file, "binary");

                    response.end();
                }
            });
        }
    });
});

server.listen(PORT);
console.log("Server runing at port: " + PORT + ".");