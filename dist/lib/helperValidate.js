"use strict";
const sh_mongo = require("mongojs");
const sh_moment = require("moment");
const sh_Logger = require("logger-switch");
class HelperValidate {
    constructor(debug) {
        this.logger = new sh_Logger("sh-validate");
        this.logger[debug ? "activate" : "deactivate"]();
        return this;
    }
    range(data, min, max) {
        if (data >= min && data <= max) {
            return true;
        }
        return false;
    }
    length(data, min, max) {
        let len = data.length;
        if (max) {
            if (len >= min && len <= max) {
                return true;
            }
            return false;
        }
        else {
            return len >= min;
        }
    }
    isMongoId(id) {
        try {
            sh_mongo.ObjectId(id);
            return true;
        }
        catch (err) {
            return false;
        }
    }
    in(data, arr) {
        return (arr.indexOf(data) != -1);
    }
    isName(name) {
        return /^([a-zA-Z0-9]|[-_ ]|\.)+$/.test(name);
    }
    isEmail(email) {
        return /^([a-zA-Z0-9._%+-])+@[a-zA-Z.-]+\.[a-zA-Z]{2,}$/.test(email);
    }
    isAlpha(data) {
        return /^[a-zA-Z ]+$/.test(data);
    }
    isNumeric(data) {
        return /^[0-9.]+$/.test(data);
    }
    isAlphaNumeric(data) {
        return /^[a-zA-Z0-9]+$/.test(data);
    }
    isDate(dateStr, format) {
        return sh_moment(dateStr, format)._isValid;
    }
    isRegex(data, regexStr) {
        let regex = new RegExp(regexStr);
        return regex.test(data);
    }
}
exports.HelperValidate = HelperValidate;
