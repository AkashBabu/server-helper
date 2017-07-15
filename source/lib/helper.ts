import * as sh_Chance from "chance";
import * as sh_crypto from "crypto";

import * as sh_Logger from "logger-switch";
import * as sh_async from "async";
import * as express from "express";

export interface IHTTPResp extends express.Response { }
export interface IValidationFn {
    (data: any, ...args: any[]): (boolean | void)
}

export interface ITransformFn extends Function {
    (data: any, ...args: any[]): any
}
export interface IPreTransform extends Function {
    (data: any, ...args: any[]): any
}
export interface IFieldSpec {
    name: string;
    type: any;
    required?: boolean;
    preTransform?: IPreTransform;
    preTransformArgs?: any[];
    validate?: IValidationFn | IValidationFn[];
    validateArgs?: any[];
    validateErrMsg: string | string[];
    transform: ITransformFn | ITransformFn[];
    transformArgs: any[];
    errMsg: string;
}

export interface IWeakPwd {
    minLen?: number;
    maxLen?: number;
    upperCase?: boolean;
    lowerCase?: boolean;
    specialChars?: string[];
}

export interface IHelper {
    filterKeysInObj(obj: object, filter: string[], sameObj?: boolean): object;
    retainKeysInObj(obj: object, filter: string[], sameObj?: boolean): object;
    weakPwd(pwd: string, config: IWeakPwd): string;
    prefixToQueryObject(prefix: string, obj: object): object;
    validateFieldNamesExistence(obj: object, fieldNames: string[], strict: boolean): boolean;
    validateFieldsExistenceCb(obj: object, fieldSpecs: IFieldSpec[], strict: boolean, callback: Function): void;
    validateFieldsCb(obj: object, fieldSpecs: IFieldSpec[], strict: boolean, callback: Function);
    validateFieldsExistence(obj: object, fieldSpecs: IFieldSpec[], strict: boolean): boolean;
    saltHash(pwd: string, saltLength?: number): string;
    verifySaltHash(salted: string, pwd: string, saltLength?: number): boolean;
    handleResult(res: IHTTPResp, err: Error, result: any, type?: string): void;
}

export class Helper implements IHelper {
    private logger = new sh_Logger("sh-helper");
    private chance = new sh_Chance();
    public filterObj = this.filterKeysInObj;
    public validateFieldsCb = this.validateFieldsExistenceCb;
    public validateFields = this.validateFieldsExistence;
    constructor(debug: boolean) {
        this.logger[debug ? "activate" : "deactivate"]();

        return this;
    }

    /**
     * Filters out/removes the keys for the given object
     * @param {object} obj
     * @param {string[]} filter - array of keys to be removed
     * @param {boolean=} sameObj - if the keys has to be removed from the same obj or from the copy of it
     * 
     * @returns {object} 
     */
    public filterKeysInObj(obj: object, filter: string[], sameObj?: boolean): object {
        let objCpy = sameObj ? obj : Object.assign({}, obj);
        Object.keys(objCpy).forEach((key) => {
            if (filter.indexOf(key) == -1) {
                delete objCpy[key];
            }
        })

        return objCpy;
    }

    /**
     * Retains only the given keys in the object
     * @param {object} obj
     * @param {string[]} retain - the keys to be retained
     * @param {boolean=} sameObj - if the keys has to be removed from the same obj or from the copy of it
     * 
     * @returns {object} 
     */
    public retainKeysInObj(obj: object, retain: string[], sameObj?: boolean): object {
        if (sameObj) {
            Object.keys(obj).forEach((key: string) => {
                if (retain.indexOf(key) == -1) {
                    delete obj[key];
                }
            })
            return obj;
        } else {

            let result = {};
            retain.forEach((key) => {
                result[key] = obj[key];
            })

            return result;
        }
    }

    /**
     * Checks if the given string is a weak password
     * @param {string} pwd - password
     * @param {object} config
     * 
     * @returns {string} - Errors if any
     */
    public weakPwd(pwd: string, config: IWeakPwd): string {
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

    /**
     * Prefixes a given string for each keys in the given object
     * @param {string} prefix - prefix to be attached to each key
     * @param {object} obj
     * 
     * @returns {object} object with prefixed keys
     */
    public prefixToQueryObject(prefix: string, obj: object): object {
        let query = {};
        Object.keys(obj).forEach((key: string) => {
            query[prefix + key] = obj[key];
        })
        return query;
    }

    /**
     * Validate if all the given keys are present in the object
     * @param {object} obj
     * @param {string[]} fieldNames - Fields to be verified
     * @param {boolean} strict - if only the given fields has to be present/ if the object keys should include the given fields
     * 
     * @returns {boolean}
     */
    public validateFieldNamesExistence(obj: object, fieldNames: string[], strict: boolean): boolean {
        if (strict && (Object.keys(obj).length != fieldNames.length)) {
            return false;
        }

        return fieldNames.every((fieldName: string) => {
            return !this.isUndefined(obj[fieldName])
        })
    }

    /**
     * Validate the fields in the object in an asynchronous way
     * @param {object} obj
     * @param {IFieldSpec[]} fieldSpecs
     * @param {boolean} [strict=false]
     * @param {Function} callback
     */
    public validateFieldsExistenceCb(obj: object, fieldSpecs: IFieldSpec[], strict: boolean, callback: (err?: string) => void): void {
        if (!callback && typeof strict == "function") {
            callback = strict;
            strict = false;
        }

        if (strict == true) {
            //  Strict rule implementation
            if (Object.keys(obj).length < fieldSpecs.length) {
                return setImmediate(function () {
                    callback("Missing Fields");
                })
            } else if (Object.keys(obj).length > fieldSpecs.length) {
                this.filterKeysInObj(obj, fieldSpecs.map((spec: IFieldSpec) => spec.name), true);
            }

        }

        sh_async.eachSeries(
            fieldSpecs,
            (fieldSpec: IFieldSpec, cb: Function) => {
                let errMsg1 = fieldSpec.errMsg ? fieldSpec.errMsg : "Invalid " + fieldSpec.name; // Default errMsg will be 'Invalid <fieldName>'
                if (!this.isUndefined(obj[fieldSpec.name])) {

                    // Type validation block
                    let validType: boolean = true;
                    if (Array.isArray(fieldSpec.type)) {
                        if (fieldSpec.type.indexOf("array") > -1) {
                            validType = Array.isArray(obj[fieldSpec.name]) || fieldSpec.type.indexOf(typeof obj[fieldSpec.name]) > -1;
                        }
                        else {
                            validType = fieldSpec.type.indexOf(typeof obj[fieldSpec.name]) > -1;
                        }

                    } else {
                        if (fieldSpec.type == "array") {
                            validType = Array.isArray(obj[fieldSpec.name])
                        } else {
                            validType = fieldSpec.type == typeof obj[fieldSpec.name]
                        }

                    }

                    if (!validType) {
                        this.logger.log("Invalid Type:", fieldSpec.name);
                        return setImmediate(() => {
                            cb(errMsg1, false);
                        })
                    }


                    if (fieldSpec.preTransform) {
                        if (fieldSpec.preTransformArgs) {
                            if (!Array.isArray(fieldSpec.preTransformArgs)) {
                                fieldSpec.preTransformArgs = [fieldSpec.preTransformArgs];
                            }
                        } else {
                            fieldSpec.preTransformArgs = [];
                        }
                        obj[fieldSpec.name] = fieldSpec.preTransform.apply(null, [obj[fieldSpec.name], ...fieldSpec.preTransformArgs])
                    }


                    // ValidateArgs arrangement block
                    if (!fieldSpec.validateArgs) {
                        fieldSpec.validateArgs = [];
                    }
                    else if (!Array.isArray(fieldSpec.validateArgs)) {
                        fieldSpec.validateArgs = [fieldSpec.validateArgs];
                    }


                    // validate function arrangement
                    if (!fieldSpec.validate) {
                        fieldSpec.validate = [];
                    }
                    else if (typeof fieldSpec.validate == "function") {
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
                            if (!Array.isArray(validateArgs)) {
                                validateArgs = [validateArgs]
                            } else {
                                validateArgs = validateArgs.slice(0)
                            }

                            validateArgs.unshift(obj[fieldSpec.name])
                            // validateArgs : [currFieldValue, ...validateArgs]

                            let argsLen = validateArgs.length;

                            // if cb(async) is implemented for validate function
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
                                    setImmediate(() => {
                                        cb1(errMsg, false);
                                    })
                                } else {
                                    setImmediate(() => {
                                        cb1(null, true);
                                    })
                                }
                            }
                        },
                        (err, done) => {
                            if (err) {
                                setImmediate(() => {
                                    cb(err, false);
                                })
                            } else {
                                if (typeof fieldSpec.transform == "function") {
                                    if (fieldSpec.transformArgs) {
                                        fieldSpec.transformArgs.unshift(obj[fieldSpec.name]);
                                    } else {
                                        fieldSpec.transformArgs = [obj[fieldSpec.name]];
                                    }

                                    let argsLen = fieldSpec.transformArgs.length;

                                    // Check for async(cb) transform functions
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
                                        setImmediate(() => {
                                            cb(null, true);
                                        })
                                    }


                                } else {
                                    setImmediate(() => {
                                        cb(null, true);
                                    })
                                }
                            }
                        })

                } else {
                    if (fieldSpec.required === false) {
                        setImmediate(() => {
                            cb(null, true);
                        })
                    } else {
                        this.logger.log("Field Not Defined:", fieldSpec.name);
                        setImmediate(() => {
                            cb(errMsg1, false);
                        })
                    }
                }
            }, callback)
    }


    /**
     * Validate fields in the object
     * @param {object} obj
     * @param {IFieldSpec[]} fieldSpecs
     * @param {boolean} [strict=false]
     * 
     * @returns {boolean} 
     */
    public validateFieldsExistence(obj: object, fieldSpecs: IFieldSpec[], strict = false): boolean {
        let self = this;

        if (strict) {
            if (Object.keys(obj).length < fieldSpecs.length) {
                self.logger.log("Missing Fields")
                return false;
            } else if (Object.keys(obj).length > fieldSpecs.length) {
                self.filterObj(obj, fieldSpecs.map((spec: IFieldSpec) => spec.name), true);
            }

        }

        return fieldSpecs.every((fieldSpec: IFieldSpec) => {
            if (!self.isUndefined(obj[fieldSpec.name])) {

                // Type validation
                if (fieldSpec.type) {
                    let validType = true;
                    if (Array.isArray(fieldSpec.type)) {
                        if (fieldSpec.type.indexOf("array") > -1) {
                            validType = Array.isArray(obj[fieldSpec.name]) || fieldSpec.type.indexOf(typeof obj[fieldSpec.name]) > -1;
                        } else {
                            validType = fieldSpec.type.indexOf(typeof obj[fieldSpec.name]) > -1;
                        }
                    } else {
                        if (fieldSpec.type == 'array') {
                            validType = Array.isArray(obj[fieldSpec.name])
                        } else {
                            validType = typeof obj[fieldSpec.name] == fieldSpec.type;
                        }
                    }

                    if (!validType) {
                        this.logger.log(`Invalid Type: ${fieldSpec.name}, expected to be ${fieldSpec.type}, but got` + typeof obj[fieldSpec.name]);
                        return false;
                    }
                }

                // Pre-Transformation
                if (fieldSpec.preTransform) {
                    if (!fieldSpec.preTransformArgs) {
                        fieldSpec.preTransformArgs = [];
                    } else if (!Array.isArray(fieldSpec.preTransformArgs)) {
                        fieldSpec.preTransformArgs = [fieldSpec.preTransformArgs];
                    }
                    fieldSpec.preTransformArgs.unshift(obj[fieldSpec.name]);

                    obj[fieldSpec.name] = fieldSpec.preTransform.apply(null, fieldSpec.preTransformArgs);
                }

                // Validation
                if (fieldSpec.validate) {

                    if (!fieldSpec.validateArgs) {
                        fieldSpec.validateArgs = [];
                    }
                    else if (!Array.isArray(fieldSpec.validateArgs)) {
                        fieldSpec.validateArgs = [fieldSpec.validateArgs]
                    }

                    if (!Array.isArray(fieldSpec.validate)) {
                        fieldSpec.validate = [fieldSpec.validate]
                    }


                    let valid = fieldSpec.validate.every((validation, i) => {
                        if (fieldSpec.validateArgs[i] && !Array.isArray(fieldSpec.validateArgs[i])) {
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


                // Transformation
                if (fieldSpec.transform && typeof fieldSpec.transform == "function") {
                    if (!fieldSpec.transformArgs) {
                        fieldSpec.transformArgs = [];
                    } else if (!Array.isArray(fieldSpec.transformArgs)) {
                        fieldSpec.transformArgs = [fieldSpec.transformArgs];
                    }
                    fieldSpec.transformArgs.unshift(obj[fieldSpec.name]);

                    obj[fieldSpec.name] = fieldSpec.transform.apply(null, fieldSpec.transformArgs);
                }

                return true;

            } else {
                if (typeof fieldSpec.required == "boolean" && !fieldSpec.required) {
                    return true;
                } else {
                    self.logger.log("Field Not Defined:", fieldSpec.name);
                    return false;
                }
            }
        })
    }

    /**
     * Converts the given string to hash, by adding a suffixing salt of length(length) to the password
     * @param {string} pwd
     * @param {number} [saltLength=16] - length of salt to be used
     * 
     * @returns {string}
     */
    public saltHash(pwd: string, saltLength?: number): string {
        let salt = this.chance.string({
            length: saltLength || 16,
            pool: "abcde1234567890"
        });
        return salt + sh_crypto.createHmac("sha256", salt).update(pwd).digest("hex")
    }

    /**
     * Verifies the given password with the salted password
     * @param {string} salted
     * @param {string} pwd
     * @param {number} saltLength
     * 
     * @returns {boolean}
     */
    public verifySaltHash(salted: string, pwd: string, saltLength?: number): boolean {
        saltLength = saltLength || 16
        let hashed = {
            salt: salted.slice(0, saltLength),
            hash: salted.slice(saltLength)
        }

        let thisHash = sh_crypto.createHmac("sha256", hashed.salt).update(pwd).digest("hex");
        return (hashed.hash == thisHash);
    }

    /**
     * @deprecated since version 0.11.0
     */
    public handleResult(res: IHTTPResp, err: Error, result: any, type?: string): void {
        console.warn("Please use HelperResp.handleResult instead. This function will be deprecated in the next major release");

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
