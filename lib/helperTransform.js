var sh_mongo = require('mongojs');
const sh_Chance = require('chance');
var sh_crypto = require('crypto');
var sh_chance = new sh_Chance();
var sh_S = require("string");
var sh_moment = require("moment")
var sh_Logger = require('logger-switch');
var sh_logger = new sh_Logger('sh-transform');

var HelperTransform = function(debug) {
    sh_logger[debug ? 'activate' : 'deactivate']();
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
        sh_logger.err(err)
        return null;
    }
}

HelperTransform.prototype.toInt = function(data) {
    return parseInt(data);
}

HelperTransform.prototype.toFloat = function(data, dec) {
    return parseFloat(parseFloat(data).toFixed(dec || 5));
}

HelperTransform.prototype.toDate = function(dateStr) {
    try {
        return new Date(dateStr)
    } catch (err) {
        sh_logger.error(err)
        return null
    }
}

HelperTransform.prototype.toMoment = function(dateStr) {
    try {
        return moment(dateStr)
    } catch (err) {
        sh_logger.error(err)
        return null
    }
}

HelperTransform.prototype.toSaltHash = function(pwd) {

    var self = this;
    var salt = sh_chance.string({
        length: 16,
        pool: 'abcde1234567890'
    });
    var salted = salt + sh_crypto.createHmac('sha256', salt).update(pwd).digest('hex')
    return salted;

}

HelperTransform.prototype.stripXss = function(str) {
    if (str.contructor == String)
        return str.replace(/(<.*>(.*)<\/?.*>)/, "");
    else {
        sh_logger.error("Invalid Type for stripXss");
        return "";
    }
}

module.exports = HelperTransform;