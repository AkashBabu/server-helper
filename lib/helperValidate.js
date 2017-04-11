









var sh_mongo = require('mongojs')
var sh_moment = require('moment');

var sh_Logger = require('logger-switch');
var sh_logger = new sh_Logger('sh-validate');

var HelperValidate = function (debug) {
    sh_logger[debug ? 'activate' : 'deactivate']();
    return this;
}

HelperValidate.prototype.range = function (data, min, max) {
    if (data >= min && data <= max) {
        return true;
    }
    return false;
}

HelperValidate.prototype.length = function (data, min, max) {
    var len = data.length;
    if (max) {

        if (len >= min && len <= max) {
            return true;
        }
        return false;
    } else {
        return len >= min;
    }
}

HelperValidate.prototype.isMongoId = function (id) {
    try {
        sh_mongo.ObjectId(id);
        return true;
    } catch (err) {
        return false;
    }
}

HelperValidate.prototype.in = function (data, arr) {
    return (arr.indexOf(data) != -1);
}

HelperValidate.prototype.isName = function (name) {
    return /^([a-zA-Z0-9]|[-_ ]|\.)+$/.test(name);
}

HelperValidate.prototype.isEmail = function (email) {
    return /^([a-zA-Z0-9._%+-])+@[a-zA-Z.-]+\.[a-zA-Z]{2,}$/.test(email);
}

HelperValidate.prototype.isAlpha = function (data) {
    return /^[a-zA-Z ]+$/.test(data);
}

HelperValidate.prototype.isNumeric = function (data) {
    return /^[0-9.]+$/.test(data);
}

HelperValidate.prototype.isAlphaNumeric = function (data) {
    return /^[a-zA-Z0-9]+$/.test(data);
}

HelperValidate.prototype.isDate = function (dateStr, format) {
    if (format) {
        try {
            sh_moment(dateStr, format)
            return true;
        } catch (err) {
            return false;
        }
    } else {

        try {
            sh_moment(dateStr);
            return true;
        } catch (err) {
            return false;
        }
    }
}

HelperValidate.prototype.isRegex = function (data, regexStr) {
    var regex = new RegExp(regexStr);
    return regex.test(data);
}

module.exports = HelperValidate;
