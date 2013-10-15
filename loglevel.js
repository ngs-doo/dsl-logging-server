var loglevel = function(value) {
	return Object.keys(loglevel).filter(function(key) {return loglevel[key] === value})[0];
}
loglevel.TRACE = 0;
loglevel.DEBUG = 1;
loglevel.INFO  = 2;
loglevel.WARN  = 3;
loglevel.ERROR = 4;
loglevel.OFF   = 5;

module.exports = loglevel;
