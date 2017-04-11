











var moment = require('moment');

/**
 * Logger Function
 * @constructor
 * @param {string} name - Prefix to be used while printing
 * @param {logger} logger - Logger to be used 
 */
var Logger = function (name, logger) {
    this.name = name ? name : 'Log';
    this.logger = logger ? logger : console;
    this.active = true;
    this.tsFormat = null;

    var self = this;

    ['log', 'info', 'debug', 'warn', 'error'].forEach(function (type) {
        self[type] = function () {
            self.active ? self.logger[type].apply(null, [self.getPrefix()].concat(Array.prototype.slice.call(arguments))) : null;
        }
    })

    return this;
}

/**
 * @type {Logger~getPrefix}
 * @return The prefix to be used while logging
 */
Logger.prototype.getPrefix = function() {
    var self = this;
    return self.name + (self.tsFormat ? ' (' + moment().format(self.tsFormat) + ')' : "") + ":";
}

/**
 * Activate the logging activity
 * @type {Logger~activate}
 */
Logger.prototype.activate = function () {
    this.active = true;
}

/**
 * Deactive logging activity
 * @type {Logger~deactivate}
 */
Logger.prototype.deactivate = function () {
    this.active = false;
}

/**
 * Enable/disable timestamp logging
 * @type {Logger~timestamp}
 * @param {string} tsFormat - momentjs type format string
 */
Logger.prototype.timestamp = function (tsFormat) {
    this.tsFormat = tsFormat;
}

module.exports = Logger;
