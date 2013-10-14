var loglevel = require('../loglevel.js');
var User = require('../user.js');
var Command = require('../command.js');

module.exports = Object.keys(loglevel).map(function(key) {
	var value = loglevel[key];
	return new Command('!' + key.toLowerCase(), function(args, stanza) {
		var jid = stanza.attrs.from;
		var projectName = args[1];

		this.users = this.users.filter(function(user) {
			return user.jid !== jid;
		});
		this.users.push(new User(jid, projectName, value));

		if (value == loglevel.OFF)
			this.sendMessage(jid, 'Won\'t bother you anymore');
		else
			this.sendMessage(jid, 'Sending logs ' + key + ' for project "' + projectName + '"');
	});
});
