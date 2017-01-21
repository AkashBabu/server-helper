var sh_mongo = require('mongojs')
var moment = require('moment');

var Logger = require('logger-switch');
var logger = new Logger('sh-validate');

var HelperValidate = function (debug) {
    logger[debug ? 'activate' : 'deactivate']();
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
        return len == min;
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
    // console.log('listArr:', arr);
    data = data.toUpperCase();
    // console.log('data:', data);
    // logger.log('validate arr:', arr);
    // logger.log('validate data:', data);
    // return true;
    return (arr.indexOf(data) != -1);

}

HelperValidate.prototype.isName = function (name) {
    // console.log('name pass');
    // return true;
    return /^([a-zA-Z0-9]|[-_ ]|\.)*$/.test(name);
}

HelperValidate.prototype.isEmail = function (email) {
    return /^([a-zA-Z0-9_]|\.)+@[a-zA-Z]*\.[a-z]*$/.test(email);
}

HelperValidate.prototype.isAlpha = function (data) {
    return /^[a-zA-Z ]+$/.test(data);
}

HelperValidate.prototype.isNumeric = function (data) {
    return /[0-9]+/.test(data);
}

HelperValidate.prototype.isAlphaNumeric = function (data) {
    return /[a-zA-Z0-9]+/.test(data);
}

HelperValidate.prototype.isDate = function (dateStr, format) {
    if (format) {
        try {
            moment(dateStr, format)
            return true;
        } catch (err) {
            return false;
        }
    } else {

        try {
            moment(dateStr);
            return true;
        } catch (err) {
            return false;
        }
    }
}

HelperValidate.prototype.isRegex = function (data, regexStr) {
    // logger.log('regexStr:', regexStr);
    var regex = new RegExp(regexStr);
    return regex.test(data);
}

module.exports = HelperValidate;
