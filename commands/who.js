var loglevel = require('../loglevel.js');
var Command = require('../command.js');

var XmppWho = function(args, stanza) {
	var msg = this.users.filter(function(user) {
		return user.logLevel != loglevel.OFF;
	}).reduce(function(str, user) {
		var level = loglevel(user.logLevel);
		return str + user.jid + ' ' + level + ' ' + user.projectName + '\n';
	}, '');

	if (msg.length === 0)
		this.sendMessage(stanza.attrs.from, 'No one is listening.');
	else
		this.sendMessage(stanza.attrs.from, msg);
}

module.exports = [ '!w', '!who' ].map(function(name) {
	return new Command(name, XmppWho);
});
