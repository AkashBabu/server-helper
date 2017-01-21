const Chance = require('chance');
var chance = new Chance();

const HelperResp = require('./helperResp');
var crypto = require('crypto');
var helperResp = new HelperResp();

var Logger = require('logger-switch');
var logger = new Logger('sh-helper');
// var logger = new Logger('server-helper');
// logger.activate();

var Helper = function (debug) {

    logger[debug ? 'activate' : 'deactivate']();
    return this;
}

Helper.prototype.weakPwd = function (pwd, config) {
    var error = false;

    Object.keys(config).forEach(key => {
        switch(key) {
             case "minLen":
                return (pwd.length >= config[key] ? true : !(error = "Please choose a password length of atmost " + config[key] + " characters"))
            case "maxLen":
                return (pwd.length <= config[key] ? true : !(error = "Please choose a password length of atleast " + config[key] + " characters"))
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

Helper.prototype.prefixToQueryObject = function (prefix, obj) {
    var query = {};
    for (var key in obj) {
        query[prefix + key] = obj[key];
    }
    return query;
}

Helper.prototype.validateFieldNamesExistence = function (obj, fieldNames, strict) {
    if (strict && (Object.keys(obj).length != fieldNames.length)) {
        return false;
    }

    return fieldNames.every(fieldName => {
        return obj[fieldName];
    })
}

Helper.prototype.validateFieldsExistence = function (obj, fieldSpecs, strict) {
    var self = this;
    if (strict && (Object.keys(obj).length != fieldSpecs.length)) {
        return false;
    }

    return fieldSpecs.every(fieldSpec => {
        if (obj[fieldSpec.name]) {
            if (fieldSpec.type.constructor == Array) {
                if (fieldSpec.type.indexOf(obj[fieldSpec.name].constructor) == -1) {
                    logger.log('Invalid', fieldSpec.name);
                    return false;
                }
            } else if (obj[fieldSpec.name].constructor != fieldSpec.type) {
                logger.log('Invalid', fieldSpec.name);
                return false;
            }

            if (fieldSpec.validate) {

                if (fieldSpec.validate.constructor == Function) {
                    if (fieldSpec.validateArgs) {
                        fieldSpec.validateArgs.unshift(obj[fieldSpec.name]);
                        if (!fieldSpec.validate.apply(null, fieldSpec.validateArgs)) {
                            logger.log('Invalid', fieldSpec.name);
                            return false;
                        }
                    } else if (!fieldSpec.validate(obj[fieldSpec.name])) {
                        logger.log('Invalid', fieldSpec.name);
                        return false;
                    }
                } else if (fieldSpec.validate.constructor == Array) {
                    var result = fieldSpec.validate.every((validate, index) => {
                        var args = fieldSpec.validateArgs[index] ? fieldSpec.validateArgs[index] : []
                        args.unshift(obj[fieldSpec.name]);
                        return validate.apply(null, args);
                    })
                    if (!result) {
                        logger.log('Invalid', fieldSpec.name);
                        return false;
                    }
                }
            }

            if (fieldSpec.transform && fieldSpec.transform.constructor == Function) {
                if (fieldSpec.transformArgs) {
                    fieldSpec.transformArgs.unshift(obj[fieldSpec.name]);
                    obj[fieldSpec.name] = fieldSpec.transform.apply(null, fieldSpec.transformArgs);
                } else {
                    obj[fieldSpec.name] = fieldSpec.transform(obj[fieldSpec.name]);
                }
            }

            return true;

        } else {
            logger.log('Invalid', fieldSpec.name);
            return false;
        }
    })
}

Helper.prototype.saltHash = function (pwd) {
    var salt = chance.string({
        length: 16,
        pool: 'abcde1234567890'
    });
    return salt + crypto.createHmac('sha256', salt).update(pwd).digest('hex')
}

Helper.prototype.verifySaltHash = function (salted, pwd) {
    var hashed = {
        salt: salted.slice(0, 16),
        hash: salted.slice(16)
    }

    var thisHash = crypto.createHmac('sha256', hashed.salt).update(pwd).digest('hex');
    return (hashed.hash == thisHash);
}

Helper.prototype.handleResult = function (err, result) {
    if (!err && result) {
        helperResp.sendOk(this, result);
    } else {
        if(err) {
            logger.error(err);
        }
        helperResp.sendError(this, err ? err.code : result);
    }
}


module.exports = Helper;
