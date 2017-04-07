var sh_mongo = require('mongojs');
const Chance = require('chance');
var crypto = require('crypto');
var chance = new Chance();

var Logger = require('logger-switch');
var logger = new Logger('server-helper-transform');

var HelperTransform = function(debug) {

    // this.logger = new Logger('server-helper-transform');
    logger[debug ? 'activate' : 'deactivate']();
    return this;
}

HelperTransform.prototype.toLowerCase = function(data) {
    return data.toLowerCase();
}

HelperTransform.prototype.toUpperCase = function(data) {
    return data.toUpperCase();
}

HelperTransform.prototype.toMongoId = function(id) {
    try {
        return sh_mongo.ObjectId(id);
    } catch (err) {
        return null;
    }
}

HelperTransform.prototype.toDate = function(dateStr) {
    return new Date(dateStr);
}

HelperTransform.prototype.toMoment = function(dateStr) {
    return moment(dateStr);
}

HelperTransform.prototype.toInt = function(data) {
    return parseInt(data);
}

HelperTransform.prototype.toFloat = function(data, dec) {
    // logger.log(data, dec);
    return parseFloat(parseFloat(data).toFixed(dec || 5));
}

HelperTransform.prototype.toSaltHash = function(pwd) {
    var self = this;
    var salt = chance.string({
        length: 16,
        pool: 'abcde1234567890'
    });
    var salted = salt + crypto.createHmac('sha256', salt).update(pwd).digest('hex')
    logger.log('salted:', salted);
    return salted;
    // return salt + crypto.createHmac('sha256', salt).update(pwd).digest('hex')
}

module.exports = HelperTransform;
