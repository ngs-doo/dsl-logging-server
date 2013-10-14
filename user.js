var loglevel = require('./loglevel.js');
var User = function(jid, projectName, logLevel) {
	this.jid = jid;
	this.projectName = projectName;
	this.logLevel = logLevel;
}
module.exports = User;
