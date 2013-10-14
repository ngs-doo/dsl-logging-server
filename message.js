var qs = require('querystring');
var url = require('url');

var Message = function(request, body) {
	var query = url.parse(request.url, true).query;

	this.body = body;
	this.projectName = query.projectName;
	this.logLevel = query.level;
}

module.exports = Message;
