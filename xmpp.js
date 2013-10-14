var xmpp = require('node-xmpp');
var loglevel = require('./loglevel.js');

var Xmpp = function() {
	this.client = null;
	this.users = [ ];
	this.jid = '';
}

Xmpp.prototype = {
	respondToPings: function() {
		var self = this;
		self.client.on('stanza', function(stanza) {
			if (stanza.is('iq') && stanza.children.length == 1 && stanza.children[0].is('ping')) {
				var pong = new xmpp.Element('iq', {
					from: stanza.attrs.to,
					to: stanza.attrs.from,
					id: stanza.attrs.id,
					type: 'result'
				});
				self.client.send(pong);
			}
		});
	},
	connect: function(jid, password) {
		var self = this;

		self.jid = jid;
		self.client = new xmpp.Client({
			jid: jid,
			password: password
		});
		self.client.setMaxListeners(100);
		self.client.connection.socket.setTimeout(0);
		self.client.connection.socket.setKeepAlive(true, 10000);
		self.respondToPings();

		self.client.on('error', function(e) {
			console.error(e);
			process.exit(1);
		});
	},
	setAvailable: function() {
		var self = this;
		self.client.on('online', function() {
			self.client.send(
				new xmpp.Element('presence',{
					type: 'chat'
				}).c('show').t('chat').up()
			);
		});
	},
	registerCommand: function(command) {
		var self = this;
		if (Array.isArray(command)) {
			for (var i in command)
				self.registerCommand(command[i]);
			return;
		}

		self.client.on('stanza', function(stanza) {
			var body = stanza.getChild('body');
			if (!stanza.is('message') || stanza.attrs.type !== 'chat' || body == undefined)
				return;

			var msg = body.getText();
			var args = msg.split(/\s+/);
			if (args[0] === command.name)
				command.call(self, args, stanza);
		});
	},
	sendMessage: function(to, msg) {
		this.client.send(new xmpp.Element('message', {
			to: to,
			type: 'chat'
		}).c('body').t(msg));
	},
	log: function(msg) {
		for (var i in this.users) {
			var user = this.users[i];
			if (user.projectName == msg.projectName && user.logLevel <= msg.logLevel)
				this.sendMessage(user.jid, msg.body);
		}
	},
	getLevel: function(projectName) {
		return this.users.filter(function(user) {
			return user.projectName === projectName;
		}).map(function(user) {
			return user.logLevel;
		}).reduce(function(minLevel, level) {
			return Math.min(minLevel, level);
		}, loglevel.OFF);
	}
}

module.exports = Xmpp;
