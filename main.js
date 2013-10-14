var config = require('./config.json');

var Xmpp = require('./xmpp.js');
var commands = Array.prototype.concat(
	require('./commands/register.js'),
	require('./commands/status.js'),
	require('./commands/who.js')
);

var xmpp = new Xmpp();
xmpp.connect(config.jid, config.password);
xmpp.setAvailable();
xmpp.registerCommand(commands);

var Server = require('./server.js');
var server = new Server(xmpp);
server.listen(config.port, config.host);
