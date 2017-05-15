const sh_Chance = require('chance');
var sh_chance = new sh_Chance();

const sh_HelperResp = require('./helperResp');
var sh_crypto = require('crypto');
var sh_helperResp = new sh_HelperResp();

var sh_Logger = require('logger-switch');
var sh_logger = new sh_Logger('sh-helper');
var sh_async = require('async');

var Helper = function(debug) {
    sh_logger[debug ? 'activate' : 'deactivate']();
    return this;
}

Helper.prototype.filterObj = function(obj, filter) {
    Object.keys(obj).forEach(key => {
        if (filter.indexOf(key) == -1) {
            delete obj[key]
        }
    })
    return obj;
}

Helper.prototype.weakPwd = function(pwd, config) {
    var error = false;
    pwd = pwd || "";

    Object.keys(config).forEach(key => {
        switch (key) {
            case "minLen":
                return (pwd.length >= config[key] ? true : !(error = "Please choose a password length of atleast " + config[key] + " characters"))
            case "maxLen":
                return (pwd.length <= config[key] ? true : !(error = "Please choose a password length of atmost " + config[key] + " characters"))
            case "upperCase":
                return (/[A-Z]/.test(pwd) ? true : !(error = 'Password must include atleast one upper case letter'))
            case "lowerCase":
                return (/[a-z]/.test(pwd) ? true : !(error = "Password must include atleast one lower case letter"))
            case "numbers":
                return (/[0-9]/.test(pwd) ? true : !(error = "Password must include ateast one Number"))
            case "specialChars":
                return config[key].some(char => (pwd.indexOf(char) != -1)) ? true : !(error = "Password must include atleast one special charater from (" + config[key].join(", ") + ")")
        }
    })

    return error;
}

Helper.prototype.prefixToQueryObject = function(prefix, obj) {
    var query = {};
    for (var key in obj) {
        query[prefix + key] = obj[key];
    }
    return query;
}

function isUndefined(data) {
    return data == undefined || data == null
}

Helper.prototype.isUndefined = function(data) {
    return isUndefined(data);
}

Helper.prototype.validateFieldNamesExistence = function(obj, fieldNames, strict) {
    var self = this
    if (strict && (Object.keys(obj).length != fieldNames.length)) {
        return false;
    }

    return fieldNames.every(fieldName => {
        return !self.isUndefined(obj[fieldName])
    })
}

Helper.prototype.validateFieldsCb = function() {
    this.validateFieldsExistenceCb.apply(this, arguments)
}

Helper.prototype.validateFieldsExistenceCb = function(obj, fieldSpecs, strict, callback) {

    var self = this;
    var cbCalled = false
    if (strict == true) {
        if (Object.keys(obj).length < fieldSpecs.length) {
            cbCalled = true
            setImmediate(function() {
                callback("Missing Fields");
            })
        } else if (Object.keys(obj).length > fieldSpecs.length) {
            self.filterObj(obj, fieldSpecs.map(spec => spec.name));
        }

    }

    if (!cbCalled) {
        sh_async.eachSeries(
            fieldSpecs,
            function(fieldSpec, cb) {
                var errMsg1 = fieldSpec.errMsg ? fieldSpec.errMsg : "Invalid " + fieldSpec.name;
                if (!self.isUndefined(obj[fieldSpec.name])) {

                    if (fieldSpec.type.constructor == Array) {
                        if (fieldSpec.type.indexOf(obj[fieldSpec.name].constructor) == -1) {
                            sh_logger.log('Invalid Type:', fieldSpec.name);
                            return cb(errMsg1, false);
                        }

                    } else if (obj[fieldSpec.name].constructor != fieldSpec.type) {
                        sh_logger.log('Invalid Type:', fieldSpec.name);
                        return cb(errMsg1, false);
                    }

                    !fieldSpec.validateArgs && (fieldSpec.validateArgs = [])
                    if (fieldSpec.validateArgs.constructor != Array) {
                        fieldSpec.validateArgs = [fieldSpec.validateArgs];
                    }

                    if (!fieldSpec.validate) {
                        fieldSpec.validate = [];
                    }
                    if (fieldSpec.validate.constructor == Function) {
                        fieldSpec.validate = [fieldSpec.validate];

                    }

                    if (!fieldSpec.validateErrMsg) {
                        fieldSpec.validateErrMsg = []
                    } else if (fieldSpec.validateErrMsg.constructor != Array) {
                        fieldSpec.validateErrMsg = [fieldSpec.validateErrMsg];
                    }

                    var loop = 0;
                    sh_async.eachSeries(
                        fieldSpec.validate,
                        function(validate, cb1) {

                            var errMsg = fieldSpec.validateErrMsg[loop] ? fieldSpec.validateErrMsg[loop] : (fieldSpec.errMsg ? fieldSpec.errMsg : "Invalid " + fieldSpec.name);

                            var validateArgs = fieldSpec.validateArgs[loop] || []
                            loop++;
                            if (validateArgs.constructor != Array) {
                                validateArgs = [validateArgs]
                            } else {
                                validateArgs = validateArgs.slice(0)
                            }

                            validateArgs.unshift(obj[fieldSpec.name])

                            var argsLen = validateArgs.length;

                            if (validate.length > argsLen) {
                                function callback(err, result) {
                                    var self1 = this;
                                    if (err) {
                                        sh_logger.log("Validation Failed:", self1.name)
                                        cb1(err, false);
                                    } else {
                                        if (result) {
                                            cb1(null, true);
                                        } else {
                                            sh_logger.log("Validation Failed:", self1.name)
                                            cb1(errMsg, false);
                                        }
                                    }
                                }

                                validateArgs.push(callback.bind(fieldSpec));
                                validate.apply(null, validateArgs);

                            } else {
                                if (!validate.apply(null, validateArgs)) {
                                    sh_logger.log('Validation Failed:', fieldSpec.name);
                                    cb1(errMsg, false);
                                } else {
                                    cb1(null, true);
                                }
                            }
                        },
                        function(err, done) {
                            if (err) {
                                cb(err, false);
                            } else {
                                if (fieldSpec.transform && fieldSpec.transform.constructor == Function) {
                                    if (fieldSpec.transformArgs) {
                                        fieldSpec.transformArgs.unshift(obj[fieldSpec.name]);
                                    } else {
                                        fieldSpec.transformArgs = [obj[fieldSpec.name]];
                                    }

                                    var argsLen = fieldSpec.transformArgs.length;

                                    if (fieldSpec.transform.length > argsLen) {
                                        function callback(err, result) {
                                            var self1 = this;

                                            if (err) {
                                                sh_logger("Transform Failed:", self1.name)
                                                cb(err, false);
                                            } else {
                                                if (result != undefined || result != null) {
                                                    obj[fieldSpec.name] = result;
                                                    cb(null, true);
                                                } else {
                                                    sh_logger("Transform Failed:", self1.name)
                                                    cb(errMsg1, false);
                                                }
                                            }
                                        }

                                        fieldSpec.transformArgs.push(callback.bind(fieldSpec));
                                        fieldSpec.transform.apply(null, fieldSpec.transformArgs);

                                    } else {
                                        obj[fieldSpec.name] = fieldSpec.transform.apply(null, fieldSpec.transformArgs);
                                        cb(null, true);
                                    }


                                } else {
                                    cb(null, true);
                                }
                            }
                        })

                } else {
                    sh_logger.log('Field Not Defined:', fieldSpec.name);
                    cb(errMsg1, false);
                }
            }, callback)
    }
}

Helper.prototype.validateFieldsExistence = function(obj, fieldSpecs, strict) {
    var self = this;
    // console.log("obj:", obj);
    if (self.isUndefined(strict)) {
        strict = false;
    }
    if (strict) {
        if (Object.keys(obj).length < fieldSpecs.length) {
            sh_logger.log("Missing Fields")
            return false;
        } else if (Object.keys(obj).length > fieldSpecs.length) {
            self.filterObj(obj, fieldSpecs.map(spec => spec.name));
        }

    }

    return fieldSpecs.every(fieldSpec => {
        if (!self.isUndefined(obj[fieldSpec.name])) {
            if (fieldSpec.type) {
                if (fieldSpec.type.constructor == Array) {
                    if (fieldSpec.type.indexOf(obj[fieldSpec.name].constructor) == -1) {
                        sh_logger.log('Invalid Type:', fieldSpec.name, ", required to be:", fieldSpec.type);
                        return false;
                    }
                } else if (obj[fieldSpec.name].constructor != fieldSpec.type) {
                    sh_logger.log('Invalid Type:', fieldSpec.name, ", required to be:", fieldSpec.type);
                    return false;
                }
            }

            if (fieldSpec.validate) {

                if (fieldSpec.validate.constructor != Array) {
                    fieldSpec.validate = [fieldSpec.validate]
                }
                if (!fieldSpec.validateArgs) {
                    fieldSpec.validateArgs = [];
                }
                if (fieldSpec.validateArgs.constructor != Array) {
                    fieldSpec.validateArgs = [fieldSpec.validateArgs]
                }

                var valid = fieldSpec.validate.every((validation, i) => {
                    if (fieldSpec.validateArgs[i] && fieldSpec.validateArgs[i].constructor != Array) {
                        fieldSpec.validateArgs[i] = [fieldSpec.validateArgs[i]]
                    }
                    var validateArgs = fieldSpec.validateArgs[i] || [];
                    validateArgs.unshift(obj[fieldSpec.name])
                    return validation.apply(null, validateArgs);
                })

                if (!valid) {
                    sh_logger.log("Validation Failed:", fieldSpec.name)
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
                } else {
                    obj[fieldSpec.name] = fieldSpec.transform(obj[fieldSpec.name]);
                }
            }

            return true;

        } else {
            sh_logger.log('Field Not Defined:', fieldSpec.name);
            return false;
        }
    })
}

Helper.prototype.saltHash = function(pwd) {
    var salt = sh_chance.string({
        length: 16,
        pool: 'abcde1234567890'
    });
    return salt + sh_crypto.createHmac('sha256', salt).update(pwd).digest('hex')
}

Helper.prototype.verifySaltHash = function(salted, pwd) {
    var hashed = {
        salt: salted.slice(0, 16),
        hash: salted.slice(16)
    }

    var thisHash = sh_crypto.createHmac('sha256', hashed.salt).update(pwd).digest('hex');
    return (hashed.hash == thisHash);
}

Helper.prototype.handleResult = function(err, result) {
    if (result != undefined || result != null) {
        sh_helperResp.sendOk(this, result);
    } else {
        if (err) {
            sh_logger.error(err);
        }
        sh_helperResp.sendError(this, err ? err.code : result);
    }
}

Helper.prototype.handleAsyncResp = function(key, err, results) {
    var res = this;
    if (err) {
        sh_logger.log(err)
    }

    helperResp.sendAsyncResp(res, err, results[key])
}

module.exports = Helper;


if (require.main == module) {
    var helper = new Helper(true)
    var obj = {
        a: 1,
        b: "1",
        c: 123
    }
    var validations = [{
        name: "a",
        type: Number
    }, {
        name: 'b',
        type: String
    }, {
        name: "c",
        type: Number
    }]

    console.log(helper.validateFieldsExistence(obj, validations, true))
}