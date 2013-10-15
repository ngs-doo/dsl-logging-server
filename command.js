var Command = function(name, func) {
	this.name = name;
	this.func = func;
}

Command.prototype.call = function(self, args, stanza) {
	this.func.call(self, args, stanza);
}

module.exports = Command;
