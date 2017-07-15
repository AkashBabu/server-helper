"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sh_mongo = require("mongojs");
const sh_moment = require("moment");
const sh_Logger = require("logger-switch");
class HelperValidate {
    constructor(debug) {
        this.logger = new sh_Logger("sh-validate");
        this.logger[debug ? "activate" : "deactivate"]();
        return this;
    }
    /**
     * Validate the range of the number
     * @param data
     * @param min lower limit
     * @param max upper limit
     *
     * @returns isValid/not
     */
    range(data, min, max) {
        if (data >= min && data <= max) {
            return true;
        }
        return false;
    }
    /**
     * Validate the length of the string/array
     * @param data
     * @param min Lower length limit
     * @param max Upper length limit
     *
     * @returns isValid/not
     */
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
    /**
     * Validates if the given string is a valid mongoId
     * @param id MongoDB Document _id
     *
     * @returns isValid/not
     */
    isMongoId(id) {
        try {
            sh_mongo.ObjectId(id);
            return true;
        }
        catch (err) {
            return false;
        }
    }
    /**
     * Checks if the data is present in the given array
     * @param data
     * @param arr
     *
     * @returns isValid/not
     */
    // TODO Add support for checking data if the type is Object or array
    in(data, arr) {
        if (Array.isArray(data)) {
            return arr.some(item => {
                if (Array.isArray(item)) {
                    if (data.length == item.length) {
                        return item.every(elem => data.indexOf(elem) > -1);
                    }
                    return false;
                }
                return false;
            });
        }
        else if (typeof data == 'object') {
            return arr.some(item => {
                if (typeof item == 'object') {
                    return Object.keys(item).every(key => item[key] == data[key]);
                }
                return false;
            });
        }
        return (arr.indexOf(data) != -1);
    }
    /**
     * validate if the given string matches the Name format
     * @param name
     *
     * @returns isValid/not
     */
    isName(name) {
        return /^([a-zA-Z0-9]|[-_ ]|\.)+$/.test(name);
    }
    /**
     * validate if the given string matches the Eamil format
     * @param email
     *
     * @returns isValid/not
     */
    isEmail(email) {
        return /^([a-zA-Z0-9._%+-])+@[a-zA-Z.-]+\.[a-zA-Z]{2,}$/.test(email);
    }
    /**
     * validate if the given string contains only Alphabets
     * @param data
     *
     * @returns isValid/not
     */
    isAlpha(data) {
        return /^[a-zA-Z ]+$/.test(data);
    }
    /**
     * validate if the given string contains only numbers
     * @param data
     *
     * @returns isValid/not
     */
    isNumeric(data) {
        return /^[0-9.]+$/.test(data);
    }
    /**
     * validate if the given string is Alphabets and numbers
     * @param data
     *
     * @returns isValid/not
     */
    isAlphaNumeric(data) {
        return /^[a-zA-Z0-9]+$/.test(data);
    }
    /**
     * Validate if the given string is in Data format
     * @param dateStr
     * @param format Moment date format
     *
     * @returns isValid/not
     */
    isDate(dateStr, format) {
        return sh_moment(dateStr, format)._isValid;
    }
    /**
     * Check if the data matches the regexStr pattern
     * @param data
     * @param regexStr
     *
     * @returns isValid/not
     */
    isRegex(data, regexStr) {
        let regex = new RegExp(regexStr);
        return regex.test(data);
    }
}
exports.HelperValidate = HelperValidate;
