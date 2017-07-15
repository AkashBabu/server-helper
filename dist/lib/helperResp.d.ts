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
    /**
     * 401 handler
     * @param res - Express Response object
     * @param comment=UNAUTHORIZED ACCESS Response data
     */
    unauth(res: IHTTPResp, comment?: string): void;
    /**
     * 500 handler
     * @param res Express Response object
     * @param comment=INTERNAL SERVER ERROR Response data
     */
    serverError(res: IHTTPResp, comment?: string): void;
    /**
     * Callback Handler
     * @param res Express Response object
     */
    handleResult(res: IHTTPResp): Function;
    /**
     * 200 handler
     * @param res Express Response object
     * @param data={} Response data
     */
    success(res: IHTTPResp, data?: object): void;
    /**
     * 400 handler
     * @param res Express Response object
     * @param data=Failed Response data
     */
    failed(res: IHTTPResp, data?: string): void;
    /**
     * Create handler
     * @param res Express Response Object
     * @param data=CREATED Response data
     */
    post(res: IHTTPResp, data?: object): void;
    /**
     * Update handler
     * @param res Express Response object
     * @param data=UPDATED Response data
     */
    put(res: IHTTPResp, data?: object): void;
    /**
     * Delete Handler
     * @param res Express Response object
     * @param data=DELETED Response data
     */
    delete(res: IHTTPResp, data?: object): void;
    /**
     * Get and List Handler
     * @param res Express Response object
     * @param data Response data
     * @param list=true if true then data Defaults to [] else {}
     */
    get(res: IHTTPResp, data?: any, list?: boolean): void;
    private isUndefined(data);
}
