import * as express from "express";
export interface IHTTPResp extends express.Response {
}
export interface IValidationFn {
    (data: any, ...args: any[]): (boolean | void);
}
export interface ITransformFn extends Function {
    (data: any, ...args: any[]): any;
}
export interface IPreTransform extends Function {
    (data: any, ...args: any[]): any;
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
    validateFieldsCb(obj: object, fieldSpecs: IFieldSpec[], strict: boolean, callback: Function): any;
    validateFieldsExistence(obj: object, fieldSpecs: IFieldSpec[], strict: boolean): boolean;
    saltHash(pwd: string, saltLength?: number): string;
    verifySaltHash(salted: string, pwd: string, saltLength?: number): boolean;
    handleResult(res: IHTTPResp, err: Error, result: any, type?: string): void;
}
export declare class Helper implements IHelper {
    private logger;
    private chance;
    filterObj: (obj: object, filter: string[], sameObj?: boolean) => object;
    validateFieldsCb: (obj: object, fieldSpecs: IFieldSpec[], strict: boolean, callback: (err?: string) => void) => void;
    validateFields: (obj: object, fieldSpecs: IFieldSpec[], strict?: boolean) => boolean;
    constructor(debug: boolean);
    /**
     * Filters out/removes the keys for the given object
     * @param {object} obj
     * @param {string[]} filter - array of keys to be removed
     * @param {boolean=} sameObj - if the keys has to be removed from the same obj or from the copy of it
     *
     * @returns {object}
     */
    filterKeysInObj(obj: object, filter: string[], sameObj?: boolean): object;
    /**
     * Retains only the given keys in the object
     * @param {object} obj
     * @param {string[]} retain - the keys to be retained
     * @param {boolean=} sameObj - if the keys has to be removed from the same obj or from the copy of it
     *
     * @returns {object}
     */
    retainKeysInObj(obj: object, retain: string[], sameObj?: boolean): object;
    /**
     * Checks if the given string is a weak password
     * @param {string} pwd - password
     * @param {object} config
     *
     * @returns {string} - Errors if any
     */
    weakPwd(pwd: string, config: IWeakPwd): string;
    /**
     * Prefixes a given string for each keys in the given object
     * @param {string} prefix - prefix to be attached to each key
     * @param {object} obj
     *
     * @returns {object} object with prefixed keys
     */
    prefixToQueryObject(prefix: string, obj: object): object;
    /**
     * Validate if all the given keys are present in the object
     * @param {object} obj
     * @param {string[]} fieldNames - Fields to be verified
     * @param {boolean} strict - if only the given fields has to be present/ if the object keys should include the given fields
     *
     * @returns {boolean}
     */
    validateFieldNamesExistence(obj: object, fieldNames: string[], strict: boolean): boolean;
    /**
     * Validate the fields in the object in an asynchronous way
     * @param {object} obj
     * @param {IFieldSpec[]} fieldSpecs
     * @param {boolean} [strict=false]
     * @param {Function} callback
     */
    validateFieldsExistenceCb(obj: object, fieldSpecs: IFieldSpec[], strict: boolean, callback: (err?: string) => void): void;
    /**
     * Validate fields in the object
     * @param {object} obj
     * @param {IFieldSpec[]} fieldSpecs
     * @param {boolean} [strict=false]
     *
     * @returns {boolean}
     */
    validateFieldsExistence(obj: object, fieldSpecs: IFieldSpec[], strict?: boolean): boolean;
    /**
     * Converts the given string to hash, by adding a suffixing salt of length(length) to the password
     * @param {string} pwd
     * @param {number} [saltLength=16] - length of salt to be used
     *
     * @returns {string}
     */
    saltHash(pwd: string, saltLength?: number): string;
    /**
     * Verifies the given password with the salted password
     * @param {string} salted
     * @param {string} pwd
     * @param {number} saltLength
     *
     * @returns {boolean}
     */
    verifySaltHash(salted: string, pwd: string, saltLength?: number): boolean;
    /**
     * @deprecated since version 0.11.0
     */
    handleResult(res: IHTTPResp, err: Error, result: any, type?: string): void;
    private isUndefined(data);
}
