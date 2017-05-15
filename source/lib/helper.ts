import * as sh_Chance from "chance";
import * as sh_crypto from "crypto";

import * as sh_Logger from 'logger-switch';
import * as sh_async from 'async';

export interface IHTTPResp {
    status: (code: number) => { send: (data: any) => void };
}
interface IFieldSpec {
    name: string;
    type: any;
    validate?: any;
    validateArgs?: any;
    validateErrMsg: any;
    transform: any;
    transformArgs: any;
    errMsg: string;

}
export interface IHelper {
    isUndefined(data: any): boolean;
    filterObj(obj: object, filter: string[]): object;
    weakPwd(pwd: string, config: object): string;
    prefixToQueryobject(prefix: string, obj: object): object;
    validateFieldNamesExistence(obj: object, fieldNames: string[], strict: boolean): boolean;
    validateFieldsExistenceCb(obj: object, fieldSpecs: object[], strict: boolean, callback: Function): void;
    validateFieldsCb(obj: object, fieldSpecs: object[], strict: boolean, callback: Function);
    validateFieldsExistence(obj: object, fieldSpecs: object[], strict: boolean): boolean;
    saltHash(pwd: string): string;
    verifySaltHash(salted: string, pwd: string): boolean;
    handleResult(res: IHTTPResp, err: Error, result: any, type?: string): void;
}

export class Helper implements IHelper {
    sh_logger = new sh_Logger('sh-helper');
    sh_chance = new sh_Chance();
    constructor(debug: boolean) {
        this.sh_logger[debug ? 'activate' : 'deactivate']();
    }

    isUndefined(data: any): boolean {
        return data == undefined || data == null
    }

    filterObj(obj: object, filter: string[]): object {
        Object.keys(obj).forEach(key => {
            if (filter.indexOf(key) == -1) {
                delete obj[key];
            }
        })

        return obj;
    }

    weakPwd(pwd: string, config: object): string {
        var error: any;
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


    prefixToQueryobject(prefix: string, obj: object): object {
        var query = {};
        var key: any;
        Object.keys(obj).forEach((key: string) => {
            query[prefix + key] + obj[key];
        })
        return query;
    }

    validateFieldNamesExistence(obj: object, fieldNames: string[], strict: boolean): boolean {
        if (strict && (Object.keys(obj).length != fieldNames.length)) {
            return false;
        }

        return fieldNames.every((fieldName: string) => {
            return !this.isUndefined(obj[fieldName])
        })
    }

    validateFieldsExistenceCb(obj: object, fieldSpecs: object[], strict: boolean, callback: Function): void {
        var self = this;
        var cbCalled = false
        if (strict == true) {
            if (Object.keys(obj).length < fieldSpecs.length) {
                cbCalled = true
                setImmediate(function () {
                    callback("Missing Fields");
                })
            } else if (Object.keys(obj).length > fieldSpecs.length) {
                self.filterObj(obj, fieldSpecs.map((spec: IFieldSpec) => spec.name));
            }

        }

        if (!cbCalled) {
            sh_async.eachSeries(
                fieldSpecs,
                (fieldSpec: IFieldSpec, cb: Function) => {
                    var errMsg1 = fieldSpec.errMsg ? fieldSpec.errMsg : "Invalid " + fieldSpec.name;
                    if (!self.isUndefined(obj[fieldSpec.name])) {

                        if (fieldSpec.type.constructor == Array) {
                            if (fieldSpec.type.indexOf(obj[fieldSpec.name].constructor) == -1) {
                                self.sh_logger.log('Invalid Type:', fieldSpec.name);
                                return cb(errMsg1, false);
                            }

                        } else if (obj[fieldSpec.name].constructor != fieldSpec.type) {
                            self.sh_logger.log('Invalid Type:', fieldSpec.name);
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
                            function (validate, cb1) {

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
                                            self.sh_logger.log("Validation Failed:", self1.name)
                                            cb1(err, false);
                                        } else {
                                            if (result) {
                                                cb1(null, true);
                                            } else {
                                                self.sh_logger.log("Validation Failed:", self1.name)
                                                cb1(errMsg, false);
                                            }
                                        }
                                    }

                                    validateArgs.push(callback.bind(fieldSpec));
                                    validate.apply(null, validateArgs);

                                } else {
                                    if (!validate.apply(null, validateArgs)) {
                                        self.sh_logger.log('Validation Failed:', fieldSpec.name);
                                        cb1(errMsg, false);
                                    } else {
                                        cb1(null, true);
                                    }
                                }
                            },
                            function (err, done) {
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
                                                    self.sh_logger("Transform Failed:", self1.name)
                                                    cb(err, false);
                                                } else {
                                                    if (result != undefined || result != null) {
                                                        obj[fieldSpec.name] = result;
                                                        cb(null, true);
                                                    } else {
                                                        self.sh_logger("Transform Failed:", self1.name)
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
                        this.sh_logger.log('Field Not Defined:', fieldSpec.name);
                        cb(errMsg1, false);
                    }
                }, callback)
        }
    }
    validateFieldsCb = this.validateFieldsExistenceCb;
    validateFieldsExistence(obj: object, fieldSpecs: object[], strict: boolean): boolean {
        var self = this;
        if (self.isUndefined(strict)) {
            strict = false;
        }
        if (strict) {
            if (Object.keys(obj).length < fieldSpecs.length) {
                self.sh_logger.log("Missing Fields")
                return false;
            } else if (Object.keys(obj).length > fieldSpecs.length) {
                self.filterObj(obj, fieldSpecs.map((spec: IFieldSpec) => spec.name));
            }

        }

        return fieldSpecs.every((fieldSpec: IFieldSpec) => {
            if (!self.isUndefined(obj[fieldSpec.name])) {
                if (fieldSpec.type) {
                    if (fieldSpec.type.constructor == Array) {
                        if (fieldSpec.type.indexOf(obj[fieldSpec.name].constructor) == -1) {
                            self.sh_logger.log('Invalid Type:', fieldSpec.name, ", required to be:", fieldSpec.type);
                            return false;
                        }
                    } else if (obj[fieldSpec.name].constructor != fieldSpec.type) {
                        self.sh_logger.log('Invalid Type:', fieldSpec.name, ", required to be:", fieldSpec.type);
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
                        self.sh_logger.log("Validation Failed:", fieldSpec.name)
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
                self.sh_logger.log('Field Not Defined:', fieldSpec.name);
                return false;
            }
        })
    }
    saltHash(pwd: string): string {
        var salt = this.sh_chance.string({
            length: 16,
            pool: 'abcde1234567890'
        });
        return salt + sh_crypto.createHmac('sha256', salt).update(pwd).digest('hex')
    }
    verifySaltHash(salted: string, pwd: string): boolean {
        var hashed = {
            salt: salted.slice(0, 16),
            hash: salted.slice(16)
        }

        var thisHash = sh_crypto.createHmac('sha256', hashed.salt).update(pwd).digest('hex');
        return (hashed.hash == thisHash);
    }
    handleResult(res: IHTTPResp, err: Error, result: any, type?: string): void {
        if (!type) {
            type = 'array'
        }
        type = type.toLowerCase();

        if (!err) {
            if (this.isUndefined(result)) {
                res.status(204).send({
                    error: false,
                    data: type == 'array' ? [] : {}
                })
            } else {
                if (result.constructor == Array && result.length == 0) {
                    res.status(204).send({
                        error: false,
                        data: []
                    })
                } else if (result.constructor == Object && Object.keys(result).length == 0) {
                    res.status(204).send({
                        error: false,
                        data: {}
                    })
                }
            }

        } else {
            this.sh_logger.error("Handle Result Error:", err)

            res.status(500).send({
                error: true,
                data: type == 'array' ? [] : {}
            })
        }
    }

}
