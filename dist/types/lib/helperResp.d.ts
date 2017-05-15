import { IHTTPResp } from "./helper";
export interface IHelperResp {
    isUndefined(data: any): boolean;
    unauth(res: IHTTPResp, comment?: string): void;
    serverError(res: IHTTPResp, comment?: string): void;
    handleResult(res: IHTTPResp, err: Error, result: any, type?: string): void;
}
export declare class HelperResp implements IHelperResp {
    sh_logger: any;
    constructor(debug?: boolean);
    isUndefined(data: any): boolean;
    unauth(res: IHTTPResp, comment?: string): void;
    serverError(res: IHTTPResp, comment?: string): void;
    handleResult(res: IHTTPResp, err: Error, result: any, type?: string): void;
}
