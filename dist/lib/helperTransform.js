"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sh_mongo = require("mongojs");
const sh_Chance = require("chance");
const sh_crypto = require("crypto");
const moment = require("moment");
const sh_Logger = require("logger-switch");
class HelperTransform {
    constructor(debug) {
        this.logger = new sh_Logger("sh-transform");
        this.chance = new sh_Chance();
        this.logger[debug ? "activate" : "deactivate"]();
        return this;
    }
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
            this.logger.error(err);
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
            this.logger.error(err);
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
        let salt = this.chance.string({
            length: 16,
            pool: "abcde1234567890"
        });
        let salted = salt + sh_crypto.createHmac("sha256", salt).update(pwd).digest("hex");
        return salted;
    }
    stripXss(str) {
        if (typeof str == "string") {
            return str.replace(/(<.*>(.*)<\/?.*>)/, "");
        }
        else {
            this.logger.error("Invalid Type for stripXss");
            return "";
        }
    }
}
exports.HelperTransform = HelperTransform;
