var http = require('http');
var Message = require('./message.js');
var credentials = 'superusr1245!:passpasspass123';

var HttpServer = function(xmpp) {
	var server = http.createServer();

	server.on('request', function(request, response) {
		var auth = request.headers.authorization;
		if (auth === undefined || new Buffer(auth.replace(/Basic /, ''), 'base64').toString('utf-8') !== credentials) {
			response.writeHead(401);
			response.end('Not authorized.');
			return;
		}

		if (request.method === 'GET') {
			var projectName = require('url').parse(request.url).path.substring(1);
			var level = xmpp.getLevel(projectName).toString();
			response.writeHead(200);
			response.end(level, 'utf-8');
		} else {
			var body = '';
			request.on('data', function(chunk) {
				body += chunk;
			});

			request.on('end', function() {
				xmpp.log(new Message(request, body));
				response.writeHead(200);
				response.end();
			});
		}
	});

	return server;
}

module.exports = HttpServer;
