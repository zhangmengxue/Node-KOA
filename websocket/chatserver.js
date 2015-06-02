var http = require('http');
var WebSocketServer = require('websocket').server;

var clientui = require('fs').readFileSync('chatclient.html');

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    server.on('request',function(request,response){
		if(request.url === '/'){
			response.writeHead(200,{"Content-Type":"text/html"});
			response.write(clientui);
			response.end();
		}else{
			response.writeHead(404);
			response.end();
		}
	});
});
server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

wsserver = new WebSocketServer({
    httpServer: server,
});

// wsserver.on('connection',function(socket){
// 	socket.send('welcome to chat room');
// 	socket.on('message',function(msg){
// 		wsserver.broadcast(msg);
// 	});
// });

wsserver.on('request', function(request) {
    connection.send('welcome to chat room');
    connection.on('message', function(message) {
        console.log('Received Message: ' + message.utf8Data);
        connection.sendUTF(message.utf8Data);
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});
