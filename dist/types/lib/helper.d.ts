export interface IHTTPResp {
    status: (code: number) => {
        send: (data: any) => void;
    };
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
    validateFieldsCb(obj: object, fieldSpecs: IFieldSpec[], strict: boolean, callback: Function): any;
    validateFieldsExistence(obj: object, fieldSpecs: IFieldSpec[], strict: boolean): boolean;
    saltHash(pwd: string): string;
    verifySaltHash(salted: string, pwd: string): boolean;
    handleResult(res: IHTTPResp, err: Error, result: any, type?: string): void;
}
export declare class Helper implements IHelper {
    private logger;
    private chance;
    validateFieldsCb: (obj: object, fieldSpecs: IFieldSpec[], strict: boolean, callback: Function) => void;
    constructor(debug: boolean);
    filterObj(obj: object, filter: string[]): object;
    weakPwd(pwd: string, config: object): string;
    prefixToQueryObject(prefix: string, obj: object): object;
    validateFieldNamesExistence(obj: object, fieldNames: string[], strict: boolean): boolean;
    validateFieldsExistenceCb(obj: object, fieldSpecs: IFieldSpec[], strict: boolean, callback: Function): void;
    validateFieldsExistence(obj: object, fieldSpecs: IFieldSpec[], strict: boolean): boolean;
    saltHash(pwd: string): string;
    verifySaltHash(salted: string, pwd: string): boolean;
    handleResult(res: IHTTPResp, err: Error, result: any, type?: string): void;
    private isUndefined(data);
}
