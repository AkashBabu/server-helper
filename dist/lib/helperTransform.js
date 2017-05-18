"use strict";
const sh_mongo = require("mongojs");
const sh_Chance = require("chance");
const sh_crypto = require("crypto");
const moment = require("moment");
const sh_Logger = require("logger-switch");
class HelperTransform {
    constructor(debug) {
        this.sh_logger = new sh_Logger("sh-transform");
        this.sh_chance = new sh_Chance();
        this.sh_logger[debug ? 'activate' : 'deactivate']();
    }
    /**
     * Converts the given string to lower case letters
     * @param {string} data - input string
     * @return {string} - converted string
     */
    toLowerCase(data) {
        return data.toLowerCase();
    }
    toUpperCase(data) {
        return data.toUpperCase();
    }
    toMongoId(id) {
        try {
            return sh_mongo.ObjectId(id);
        }
        catch (err) {
            this.sh_logger.error(err);
            return null;
        }
    }
    toDate(dateStr) {
        return new Date(dateStr);
    }
    toMoment(dateStr) {
        try {
            return moment(dateStr);
        }
        catch (err) {
            this.sh_logger.error(err);
            return null;
        }
    }
    toInt(data) {
        return parseInt(data);
    }
    toFloat(data, dec) {
        return parseFloat(parseFloat(data).toFixed(dec || 5));
    }
    toSaltHash(pwd) {
        var salt = this.sh_chance.string({
            length: 16,
            pool: 'abcde1234567890'
        });
        var salted = salt + sh_crypto.createHmac('sha256', salt).update(pwd).digest('hex');
        return salted;
    }
    stripXss(str) {
        if (str.constructor == String)
            return str.replace(/(<.*>(.*)<\/?.*>)/, "");
        else {
            this.sh_logger.error("Invalid Type for stripXss");
            return "";
        }
    }
}
exports.HelperTransform = HelperTransform;
