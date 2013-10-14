var loglevel = require('../loglevel.js');
var Command = require('../command.js');

var XmppWho = function(args, stanza) {
	var jid = stanza.attrs.from;

	var user = this.users.filter(function(user) { return user.jid === jid; })[0];
	if (user === undefined || user.logLevel === loglevel.OFF) {
		this.sendMessage(jid, 'No logs are sent to you.');
		return;
	}

	var levelName = loglevel(user.logLevel);
	this.sendMessage(jid, 'You are receiving logs ' + levelName + ' for project "' + user.projectName + '"');
}

module.exports = [ '!st', '!status' ].map(function(name) {
	return new Command(name, XmppWho);
});
