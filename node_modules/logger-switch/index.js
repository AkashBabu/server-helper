












var Logger = function(name, logger) {
    this.name = name || 'Log';
    this.logger = logger || console;

    var self = this;

    ['log', 'info', 'debug', 'warn', 'error'].forEach(function(type) {
        self[type] = function(){
            self.active ? self.logger[type].apply(null, [self.name + ':'].concat(Array.prototype.slice.call(arguments))) : noop();
        }
    })

    return this;
}
Logger.prototype.activate = function(){
    this.active = true;
}
Logger.prototype.deactivate = function(){
    this.active = false;
}

module.exports = Logger;
