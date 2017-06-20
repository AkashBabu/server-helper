import { IHTTPResp } from "./helper";
export interface IHelperResp {
    unauth(res: IHTTPResp, comment?: string): void;
    serverError(res: IHTTPResp, comment?: string): void;
    handleResult(res: IHTTPResp, err: Error, result: any, type?: string): void;
    success(res: IHTTPResp, data?: any): void;
    failed(res: IHTTPResp, data?: string): void;
    post(res: IHTTPResp, data?: any): void;
    put(res: IHTTPResp, data?: any): void;
    delete(res: IHTTPResp, data?: any): void;
    get(res: IHTTPResp, data?: any, list?: boolean): void;
}
export declare class HelperResp implements IHelperResp {
    private logger;
    constructor(debug?: boolean);
    unauth(res: IHTTPResp, comment?: string): void;
    serverError(res: IHTTPResp, comment?: string): void;
    handleResult(res: IHTTPResp, err: Error, result: any, type?: string): void;
    success(res: IHTTPResp, data?: object): void;
    failed(res: IHTTPResp, data?: string): void;
    post(res: IHTTPResp, data?: object): void;
    put(res: IHTTPResp, data?: object): void;
    delete(res: IHTTPResp, data?: object): void;
    get(res: IHTTPResp, data: any, list?: boolean): void;
    private isUndefined(data);
}
