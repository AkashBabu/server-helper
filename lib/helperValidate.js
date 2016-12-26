









var sh_mongo = require('mongojs')

var HelperValidate = function () {
    return this;
}

HelperValidate.prototype.range = function (data, min, max) {
    if (data >= min && data <= max) {
        return false;
    }
    return true;
}

HelperValidate.prototype.length = function (data, min, max) {
    var len = data.length;
    if (max) {

        if (len >= min && len <= max) {
            return false;
        }
        return true;
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

HelperValidate.prototype.isDate = function (dateStr) {
    try {
        new Date(dateStr);
        return true;
    } catch (err) {
        return false;
    }
}

HelperValidate.prototype.isRegex = function(data, regexStr){
    var regex = new RegExp(regexStr);
    return regex.test(data);
}

module.exports = HelperValidate;