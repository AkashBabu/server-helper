import * as express from "express";
export interface IHTTPResp extends express.Response {
}
export interface IValidationFn {
    (data: any, ...args: any[]): (boolean | void);
}
export interface ITransformFn extends Function {
    (data: any, ...args: any[]): any;
}
export interface IFieldSpec {
    name: string;
    type: any;
    required?: boolean;
    validate?: IValidationFn | IValidationFn[];
    validateArgs?: any[];
    validateErrMsg: string | string[];
    transform: ITransformFn | ITransformFn[];
    transformArgs: any[];
    errMsg: string;
}
export interface IHelper {
    filterKeysInObj(obj: object, filter: string[]): object;
    retainKeysInObj(obj: object, filter: string[]): object;
    weakPwd(pwd: string, config: object): string;
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
    filterObj: (obj: object, filter: string[]) => object;
    validateFieldsCb: (obj: object, fieldSpecs: IFieldSpec[], strict: boolean, callback: (err?: string) => void) => void;
    constructor(debug: boolean);
    filterKeysInObj(obj: object, filter: string[]): object;
    retainKeysInObj(obj: object, retain: string[]): object;
    weakPwd(pwd: string, config: object): string;
    prefixToQueryObject(prefix: string, obj: object): object;
    validateFieldNamesExistence(obj: object, fieldNames: string[], strict: boolean): boolean;
    validateFieldsExistenceCb(obj: object, fieldSpecs: IFieldSpec[], strict: boolean, callback: (err?: string) => void): void;
    validateFieldsExistence(obj: object, fieldSpecs: IFieldSpec[], strict: boolean): boolean;
    saltHash(pwd: string, saltLength?: number): string;
    verifySaltHash(salted: string, pwd: string, saltLength?: number): boolean;
    handleResult(res: IHTTPResp, err: Error, result: any, type?: string): void;
    private isUndefined(data);
}
