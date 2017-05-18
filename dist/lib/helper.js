"use strict";
const sh_Chance = require("chance");
const sh_crypto = require("crypto");
const sh_Logger = require("logger-switch");
const sh_async = require("async");
class Helper {
    constructor(debug) {
        this.sh_logger = new sh_Logger('sh-helper');
        this.sh_chance = new sh_Chance();
        this.validateFieldsCb = this.validateFieldsExistenceCb;
        this.sh_logger[debug ? 'activate' : 'deactivate']();
    }
    isUndefined(data) {
        return data == undefined || data == null;
    }
    filterObj(obj, filter) {
        Object.keys(obj).forEach(key => {
            if (filter.indexOf(key) == -1) {
                delete obj[key];
            }
        });
        return obj;
    }
    weakPwd(pwd, config) {
        let error;
        pwd = pwd || "";
        Object.keys(config).forEach(key => {
            switch (key) {
                case "minLen":
                    return (pwd.length >= config[key] ? true : !(error = "Please choose a password length of atleast " + config[key] + " characters"));
                case "maxLen":
                    return (pwd.length <= config[key] ? true : !(error = "Please choose a password length of atmost " + config[key] + " characters"));
                case "upperCase":
                    return (/[A-Z]/.test(pwd) ? true : !(error = 'Password must include atleast one upper case letter'));
                case "lowerCase":
                    return (/[a-z]/.test(pwd) ? true : !(error = "Password must include atleast one lower case letter"));
                case "numbers":
                    return (/[0-9]/.test(pwd) ? true : !(error = "Password must include ateast one Number"));
                case "specialChars":
                    return config[key].some(char => (pwd.indexOf(char) != -1)) ? true : !(error = "Password must include atleast one special charater from (" + config[key].join(", ") + ")");
            }
        });
        return error;
    }
    prefixToQueryObject(prefix, obj) {
        let query = {};
        Object.keys(obj).forEach((key) => {
            query[prefix + key] = obj[key];
        });
        return query;
    }
    validateFieldNamesExistence(obj, fieldNames, strict) {
        if (strict && (Object.keys(obj).length != fieldNames.length)) {
            return false;
        }
        return fieldNames.every((fieldName) => {
            return !this.isUndefined(obj[fieldName]);
        });
    }
    validateFieldsExistenceCb(obj, fieldSpecs, strict, callback) {
        let cbCalled = false;
        if (strict == true) {
            if (Object.keys(obj).length < fieldSpecs.length) {
                cbCalled = true;
                setImmediate(function () {
                    callback("Missing Fields");
                });
            }
            else if (Object.keys(obj).length > fieldSpecs.length) {
                this.filterObj(obj, fieldSpecs.map((spec) => spec.name));
            }
        }
        if (!cbCalled) {
            sh_async.eachSeries(fieldSpecs, (fieldSpec, cb) => {
                let errMsg1 = fieldSpec.errMsg ? fieldSpec.errMsg : "Invalid " + fieldSpec.name;
                if (!this.isUndefined(obj[fieldSpec.name])) {
                    if (Array.isArray(fieldSpec.type)) {
                        let validType = false;
                        if (fieldSpec.type.indexOf('array') > -1) {
                            validType = Array.isArray(obj[fieldSpec.name]);
                        }
                        if (!validType && fieldSpec.type.indexOf(typeof obj[fieldSpec.name]) == -1) {
                            this.sh_logger.log('Invalid Type:', fieldSpec.name);
                            return cb(errMsg1, false);
                        }
                    }
                    else {
                        let validType = false;
                        if (fieldSpec.type == 'array') {
                            validType = Array.isArray(obj[fieldSpec.name]);
                        }
                        else {
                            validType = fieldSpec.type == typeof obj[fieldSpec.name];
                        }
                        if (!validType) {
                            this.sh_logger.log('Invalid Type:', fieldSpec.name);
                            return cb(errMsg1, false);
                        }
                    }
                    !fieldSpec.validateArgs && (fieldSpec.validateArgs = []);
                    if (fieldSpec.validateArgs.constructor != Array) {
                        fieldSpec.validateArgs = [fieldSpec.validateArgs];
                    }
                    if (!fieldSpec.validate) {
                        fieldSpec.validate = [];
                    }
                    if (typeof fieldSpec.validate == 'function') {
                        fieldSpec.validate = [fieldSpec.validate];
                    }
                    if (!fieldSpec.validateErrMsg) {
                        fieldSpec.validateErrMsg = [];
                    }
                    else if (!Array.isArray(fieldSpec.validateErrMsg)) {
                        fieldSpec.validateErrMsg = [fieldSpec.validateErrMsg];
                    }
                    let loop = 0;
                    sh_async.eachSeries(fieldSpec.validate, (validate, cb1) => {
                        let errMsg = fieldSpec.validateErrMsg[loop] ? fieldSpec.validateErrMsg[loop] : (fieldSpec.errMsg ? fieldSpec.errMsg : "Invalid " + fieldSpec.name);
                        let validateArgs = fieldSpec.validateArgs[loop] || [];
                        loop++;
                        if (validateArgs.constructor != Array) {
                            validateArgs = [validateArgs];
                        }
                        else {
                            validateArgs = validateArgs.slice(0);
                        }
                        validateArgs.unshift(obj[fieldSpec.name]);
                        let argsLen = validateArgs.length;
                        if (validate.length > argsLen) {
                            let self = this;
                            function callback(err, result) {
                                if (err) {
                                    self.sh_logger.log("Validation Failed:", this.name);
                                    cb1(err, false);
                                }
                                else {
                                    if (result) {
                                        cb1(null, true);
                                    }
                                    else {
                                        self.sh_logger.log("Validation Failed:", this.name);
                                        cb1(errMsg, false);
                                    }
                                }
                            }
                            validateArgs.push(callback.bind(fieldSpec));
                            validate.apply(null, validateArgs);
                        }
                        else {
                            if (!validate.apply(null, validateArgs)) {
                                this.sh_logger.log('Validation Failed:', fieldSpec.name);
                                cb1(errMsg, false);
                            }
                            else {
                                cb1(null, true);
                            }
                        }
                    }, (err, done) => {
                        if (err) {
                            cb(err, false);
                        }
                        else {
                            if (fieldSpec.transform && fieldSpec.transform.constructor == Function) {
                                if (fieldSpec.transformArgs) {
                                    fieldSpec.transformArgs.unshift(obj[fieldSpec.name]);
                                }
                                else {
                                    fieldSpec.transformArgs = [obj[fieldSpec.name]];
                                }
                                let argsLen = fieldSpec.transformArgs.length;
                                if (fieldSpec.transform.length > argsLen) {
                                    let self = this;
                                    function callback(err, result) {
                                        if (err) {
                                            self.sh_logger("Transform Failed:", this.name);
                                            cb(err, false);
                                        }
                                        else {
                                            if (result != undefined || result != null) {
                                                obj[fieldSpec.name] = result;
                                                cb(null, true);
                                            }
                                            else {
                                                self.sh_logger("Transform Failed:", this.name);
                                                cb(errMsg1, false);
                                            }
                                        }
                                    }
                                    fieldSpec.transformArgs.push(callback.bind(fieldSpec));
                                    fieldSpec.transform.apply(null, fieldSpec.transformArgs);
                                }
                                else {
                                    obj[fieldSpec.name] = fieldSpec.transform.apply(null, fieldSpec.transformArgs);
                                    cb(null, true);
                                }
                            }
                            else {
                                cb(null, true);
                            }
                        }
                    });
                }
                else {
                    if (fieldSpec.hasOwnProperty("required") && !fieldSpec.required) {
                        cb(null, true);
                    }
                    else {
                        this.sh_logger.log('Field Not Defined:', fieldSpec.name);
                        cb(errMsg1, false);
                    }
                }
            }, callback);
        }
    }
    validateFieldsExistence(obj, fieldSpecs, strict) {
        let self = this;
        if (self.isUndefined(strict)) {
            strict = false;
        }
        if (strict) {
            if (Object.keys(obj).length < fieldSpecs.length) {
                self.sh_logger.log("Missing Fields");
                return false;
            }
            else if (Object.keys(obj).length > fieldSpecs.length) {
                self.filterObj(obj, fieldSpecs.map((spec) => spec.name));
            }
        }
        return fieldSpecs.every((fieldSpec) => {
            if (!self.isUndefined(obj[fieldSpec.name])) {
                if (fieldSpec.type) {
                    if (fieldSpec.type.constructor == Array) {
                        if (fieldSpec.type.indexOf(obj[fieldSpec.name].constructor) == -1) {
                            self.sh_logger.log('Invalid Type:', fieldSpec.name, ", required to be:", fieldSpec.type);
                            return false;
                        }
                    }
                    else if (obj[fieldSpec.name].constructor != fieldSpec.type) {
                        self.sh_logger.log('Invalid Type:', fieldSpec.name, ", required to be:", fieldSpec.type);
                        return false;
                    }
                }
                if (fieldSpec.validate) {
                    if (fieldSpec.validate.constructor != Array) {
                        fieldSpec.validate = [fieldSpec.validate];
                    }
                    if (!fieldSpec.validateArgs) {
                        fieldSpec.validateArgs = [];
                    }
                    if (fieldSpec.validateArgs.constructor != Array) {
                        fieldSpec.validateArgs = [fieldSpec.validateArgs];
                    }
                    let valid = fieldSpec.validate.every((validation, i) => {
                        if (fieldSpec.validateArgs[i] && fieldSpec.validateArgs[i].constructor != Array) {
                            fieldSpec.validateArgs[i] = [fieldSpec.validateArgs[i]];
                        }
                        let validateArgs = fieldSpec.validateArgs[i] || [];
                        validateArgs.unshift(obj[fieldSpec.name]);
                        return validation.apply(null, validateArgs);
                    });
                    if (!valid) {
                        self.sh_logger.log("Validation Failed:", fieldSpec.name);
                        return false;
                    }
                }
                if (fieldSpec.transform) {
                    if (fieldSpec.transformArgs) {
                        if (fieldSpec.transformArgs.constructor != Array) {
                            fieldSpec.transformArgs = [fieldSpec.transformArgs];
                        }
                        fieldSpec.transformArgs.unshift(obj[fieldSpec.name]);
                        obj[fieldSpec.name] = fieldSpec.transform.apply(null, fieldSpec.transformArgs);
                    }
                    else {
                        obj[fieldSpec.name] = fieldSpec.transform(obj[fieldSpec.name]);
                    }
                }
                return true;
            }
            else {
                self.sh_logger.log('Field Not Defined:', fieldSpec.name);
                return false;
            }
        });
    }
    saltHash(pwd) {
        let salt = this.sh_chance.string({
            length: 16,
            pool: 'abcde1234567890'
        });
        return salt + sh_crypto.createHmac('sha256', salt).update(pwd).digest('hex');
    }
    verifySaltHash(salted, pwd) {
        let hashed = {
            salt: salted.slice(0, 16),
            hash: salted.slice(16)
        };
        let thisHash = sh_crypto.createHmac('sha256', hashed.salt).update(pwd).digest('hex');
        return (hashed.hash == thisHash);
    }
    handleResult(res, err, result, type) {
        if (!type) {
            type = 'array';
        }
        type = type.toLowerCase();
        if (!err) {
            if (this.isUndefined(result)) {
                res.status(204).send({
                    error: false,
                    data: type == 'array' ? [] : {}
                });
            }
            else {
                if (result.constructor == Array && result.length == 0) {
                    res.status(204).send({
                        error: false,
                        data: []
                    });
                }
                else if (result.constructor == Object && Object.keys(result).length == 0) {
                    res.status(204).send({
                        error: false,
                        data: {}
                    });
                }
            }
        }
        else {
            this.sh_logger.error("Handle Result Error:", err);
            res.status(500).send({
                error: true,
                data: type == 'array' ? [] : {}
            });
        }
    }
}
exports.Helper = Helper;
