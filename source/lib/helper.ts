import * as sh_Chance from "chance";
import * as sh_crypto from "crypto";

import * as sh_Logger from "logger-switch";
import * as sh_async from "async";

export interface IHTTPResp {
    status: (code: number) => { send: (data: any) => void };
}

export interface IFieldSpec {
    name: string;
    type: any;
    required?: boolean;
    validate?: any;
    validateArgs?: any;
    validateErrMsg: any;
    transform: any;
    transformArgs: any;
    errMsg: string;
}

export interface IHelper {
    filterObj(obj: object, filter: string[]): object;
    weakPwd(pwd: string, config: object): string;
    prefixToQueryObject(prefix: string, obj: object): object;
    validateFieldNamesExistence(obj: object, fieldNames: string[], strict: boolean): boolean;
    validateFieldsExistenceCb(obj: object, fieldSpecs: IFieldSpec[], strict: boolean, callback: Function): void;
    validateFieldsCb(obj: object, fieldSpecs: IFieldSpec[], strict: boolean, callback: Function);
    validateFieldsExistence(obj: object, fieldSpecs: IFieldSpec[], strict: boolean): boolean;
    saltHash(pwd: string): string;
    verifySaltHash(salted: string, pwd: string): boolean;
    handleResult(res: IHTTPResp, err: Error, result: any, type?: string): void;
}

export class Helper implements IHelper {
    private logger = new sh_Logger("sh-helper");
    private chance = new sh_Chance();
    public validateFieldsCb = this.validateFieldsExistenceCb;
    constructor(debug: boolean) {
        this.logger[debug ? "activate" : "deactivate"]();
    }


    public filterObj(obj: object, filter: string[]): object {
        Object.keys(obj).forEach((key) => {
            if (filter.indexOf(key) == -1) {
                delete obj[key];
            }
        })

        return obj;
    }

    public weakPwd(pwd: string, config: object): string {
        let error: any;
        pwd = pwd || "";

        Object.keys(config).forEach((key) => {
            switch (key) {
                case "minLen":
                    return (pwd.length >= config[key] ? true : !(error = "Please choose a password length of atleast " + config[key] + " characters"))
                case "maxLen":
                    return (pwd.length <= config[key] ? true : !(error = "Please choose a password length of atmost " + config[key] + " characters"))
                case "upperCase":
                    return (/[A-Z]/.test(pwd) ? true : !(error = "Password must include atleast one upper case letter"))
                case "lowerCase":
                    return (/[a-z]/.test(pwd) ? true : !(error = "Password must include atleast one lower case letter"))
                case "numbers":
                    return (/[0-9]/.test(pwd) ? true : !(error = "Password must include ateast one Number"))
                case "specialChars":
                    return config[key].some((char) => (pwd.indexOf(char) != -1)) ? true : !(error = "Password must include atleast one special charater from (" + config[key].join(", ") + ")")
                default:
                    return;
            }
        })

        return error;
    }


    public prefixToQueryObject(prefix: string, obj: object): object {
        let query = {};
        Object.keys(obj).forEach((key: string) => {
            query[prefix + key] = obj[key];
        })
        return query;
    }

    public validateFieldNamesExistence(obj: object, fieldNames: string[], strict: boolean): boolean {
        if (strict && (Object.keys(obj).length != fieldNames.length)) {
            return false;
        }

        return fieldNames.every((fieldName: string) => {
            return !this.isUndefined(obj[fieldName])
        })
    }

    public validateFieldsExistenceCb(obj: object, fieldSpecs: IFieldSpec[], strict: boolean, callback: Function): void {
        let cbCalled = false
        if (strict == true) {
            if (Object.keys(obj).length < fieldSpecs.length) {
                cbCalled = true
                setImmediate(function () {
                    callback("Missing Fields");
                })
            } else if (Object.keys(obj).length > fieldSpecs.length) {
                this.filterObj(obj, fieldSpecs.map((spec: IFieldSpec) => spec.name));
            }

        }

        if (!cbCalled) {
            sh_async.eachSeries(
                fieldSpecs,
                (fieldSpec: IFieldSpec, cb: Function) => {
                    let errMsg1 = fieldSpec.errMsg ? fieldSpec.errMsg : "Invalid " + fieldSpec.name;
                    if (!this.isUndefined(obj[fieldSpec.name])) {

                        if (Array.isArray(fieldSpec.type)) {
                            let validType: boolean = false;
                            if (fieldSpec.type.indexOf("array") > -1) {
                                validType = Array.isArray(obj[fieldSpec.name])
                            }
                            if (!validType && fieldSpec.type.indexOf(typeof obj[fieldSpec.name]) == -1) {
                                this.logger.log("Invalid Type:", fieldSpec.name);
                                return cb(errMsg1, false);
                            }

                        } else {
                            let validType: boolean = false;
                            if (fieldSpec.type == "array") {
                                validType = Array.isArray(obj[fieldSpec.name])
                            } else {
                                validType = fieldSpec.type == typeof obj[fieldSpec.name]
                            }

                            if (!validType) {
                                this.logger.log("Invalid Type:", fieldSpec.name);
                                return cb(errMsg1, false);
                            }
                        }

                        if (!fieldSpec.validateArgs) {
                            fieldSpec.validateArgs = [];
                        }
                        if (fieldSpec.validateArgs.constructor != Array) {
                            fieldSpec.validateArgs = [fieldSpec.validateArgs];
                        }
                        if (!fieldSpec.validate) {
                            fieldSpec.validate = [];
                        }
                        if (typeof fieldSpec.validate == "function") {
                            fieldSpec.validate = [fieldSpec.validate];
                        }

                        if (!fieldSpec.validateErrMsg) {
                            fieldSpec.validateErrMsg = []
                        } else if (!Array.isArray(fieldSpec.validateErrMsg)) {
                            fieldSpec.validateErrMsg = [fieldSpec.validateErrMsg];
                        }

                        let loop = 0;
                        sh_async.eachSeries(
                            fieldSpec.validate,
                            (validate, cb1) => {

                                let errMsg = fieldSpec.validateErrMsg[loop] ? fieldSpec.validateErrMsg[loop] : (fieldSpec.errMsg ? fieldSpec.errMsg : "Invalid " + fieldSpec.name);

                                let validateArgs = fieldSpec.validateArgs[loop] || []
                                loop++;
                                if (validateArgs.constructor != Array) {
                                    validateArgs = [validateArgs]
                                } else {
                                    validateArgs = validateArgs.slice(0)
                                }

                                validateArgs.unshift(obj[fieldSpec.name])

                                let argsLen = validateArgs.length;

                                if (validate.length > argsLen) {
                                    let self = this;
                                    function callback(err, result) {
                                        if (err) {
                                            self.logger.log("Validation Failed:", this.name)
                                            cb1(err, false);
                                        } else {
                                            if (result) {
                                                cb1(null, true);
                                            } else {
                                                self.logger.log("Validation Failed:", this.name)
                                                cb1(errMsg, false);
                                            }
                                        }
                                    }

                                    validateArgs.push(callback.bind(fieldSpec));
                                    validate.apply(null, validateArgs);

                                } else {
                                    if (!validate.apply(null, validateArgs)) {
                                        this.logger.log("Validation Failed:", fieldSpec.name);
                                        cb1(errMsg, false);
                                    } else {
                                        cb1(null, true);
                                    }
                                }
                            },
                            (err, done) => {
                                if (err) {
                                    cb(err, false);
                                } else {
                                    if (fieldSpec.transform && fieldSpec.transform.constructor == Function) {
                                        if (fieldSpec.transformArgs) {
                                            fieldSpec.transformArgs.unshift(obj[fieldSpec.name]);
                                        } else {
                                            fieldSpec.transformArgs = [obj[fieldSpec.name]];
                                        }

                                        let argsLen = fieldSpec.transformArgs.length;

                                        if (fieldSpec.transform.length > argsLen) {
                                            let self = this;
                                            function callback(err1, result1) {
                                                if (err1) {
                                                    self.logger("Transform Failed:", this.name)
                                                    cb(err1, false);
                                                } else {
                                                    if (result1 != undefined || result1 != null) {
                                                        obj[fieldSpec.name] = result1;
                                                        cb(null, true);
                                                    } else {
                                                        self.logger("Transform Failed:", this.name)
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
                        if (fieldSpec.hasOwnProperty("required") && !fieldSpec.required) {
                            cb(null, true);
                        } else {
                            this.logger.log("Field Not Defined:", fieldSpec.name);
                            cb(errMsg1, false);
                        }
                    }
                }, callback)
        }
    }
    public validateFieldsExistence(obj: object, fieldSpecs: IFieldSpec[], strict: boolean): boolean {
        let self = this;
        if (self.isUndefined(strict)) {
            strict = false;
        }
        if (strict) {
            if (Object.keys(obj).length < fieldSpecs.length) {
                self.logger.log("Missing Fields")
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
                            self.logger.log("Invalid Type:", fieldSpec.name, ", required to be:", fieldSpec.type);
                            return false;
                        }
                    } else if (obj[fieldSpec.name].constructor != fieldSpec.type) {
                        self.logger.log("Invalid Type:", fieldSpec.name, ", required to be:", fieldSpec.type);
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

                    let valid = fieldSpec.validate.every((validation, i) => {
                        if (fieldSpec.validateArgs[i] && fieldSpec.validateArgs[i].constructor != Array) {
                            fieldSpec.validateArgs[i] = [fieldSpec.validateArgs[i]]
                        }
                        let validateArgs = fieldSpec.validateArgs[i] || [];
                        validateArgs.unshift(obj[fieldSpec.name])
                        return validation.apply(null, validateArgs);
                    })

                    if (!valid) {
                        self.logger.log("Validation Failed:", fieldSpec.name)
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
                self.logger.log("Field Not Defined:", fieldSpec.name);
                return false;
            }
        })
    }
    public saltHash(pwd: string): string {
        let salt = this.chance.string({
            length: 16,
            pool: "abcde1234567890"
        });
        return salt + sh_crypto.createHmac("sha256", salt).update(pwd).digest("hex")
    }
    public verifySaltHash(salted: string, pwd: string): boolean {
        let hashed = {
            salt: salted.slice(0, 16),
            hash: salted.slice(16)
        }

        let thisHash = sh_crypto.createHmac("sha256", hashed.salt).update(pwd).digest("hex");
        return (hashed.hash == thisHash);
    }
    public handleResult(res: IHTTPResp, err: Error, result: any, type?: string): void {
        if (!type) {
            type = "array"
        }
        type = type.toLowerCase();

        if (!err) {
            if (this.isUndefined(result)) {
                res.status(204).send({
                    error: false,
                    data: type == "array" ? [] : {}
                })
            } else {
                if (Array.isArray(result) && result.length == 0) {
                    res.status(204).send({
                        error: false,
                        data: []
                    })
                } else if (typeof result == "object" && Object.keys(result).length == 0) {
                    res.status(204).send({
                        error: false,
                        data: {}
                    })
                } else {
                    res.status(200).send({
                        error: false,
                        data: result
                    })
                }
            }

        } else {
            this.logger.error("Handle Result Error:", err)

            res.status(500).send({
                error: true,
                data: type == "array" ? [] : {}
            })
        }
    }
    private isUndefined(data: any): boolean {
        return data == undefined || data == null
    }

}
