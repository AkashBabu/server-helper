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
    /**
     * Transforms the given string to Lower Case
     * @param data Data to be transformed
     *
     * @returns upperCased string
     */
    toLowerCase(data) {
        return data.toLowerCase();
    }
    /**
     * Transforms the given string to Upper Case
     * @param data Data to be transformed
     *
     * @returns lowerCase string
     */
    toUpperCase(data) {
        return data.toUpperCase();
    }
    /**
     * Transforms mongo id to Mongo Object id
     * @param id Mongo Document id in string
     *
     * @returns MongoObjectId
     */
    toMongoId(id) {
        try {
            return sh_mongo.ObjectId(id);
        }
        catch (err) {
            this.logger.error(err);
            return null;
        }
    }
    /**
     * Transforms the given string to Date Object
     * @param dateStr Date string
     *
     * @returns Date Object
     */
    toDate(dateStr) {
        return new Date(dateStr);
    }
    /**
     * Transforms the given string to moment object
     * @param dateStr Moment Date String
     *
     * @returns moment object
     */
    toMoment(dateStr) {
        try {
            return moment(dateStr);
        }
        catch (err) {
            this.logger.error(err);
            return null;
        }
    }
    /**
     * Parse string to number
     * @param data number in string
     *
     * @returns parsed number
     */
    toInt(data) {
        return parseInt(data);
    }
    /**
     * Parses string to float
     * @param data float in string
     * @param dec decimal points
     *
     * @return parsed float
     */
    toFloat(data, dec) {
        return parseFloat(parseFloat(data).toFixed(dec || 5));
    }
    /**
     * Adds salt and hashes the given the string
     * @param pwd Password
     *
     * @return salth hashed password
     */
    toSaltHash(pwd) {
        let salt = this.chance.string({
            length: 16,
            pool: "abcde1234567890"
        });
        let salted = salt + sh_crypto.createHmac("sha256", salt).update(pwd).digest("hex");
        return salted;
    }
    /**
     * Removes all the html tags and the data inbetween the tags
     * @param str
     *
     * @return string without tags
     */
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
