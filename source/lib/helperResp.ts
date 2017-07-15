import * as sh_Logger from "logger-switch"
import { IHTTPResp } from "./helper"

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

export class HelperResp implements IHelperResp {
    private logger = new sh_Logger("sh-resp");
    constructor(debug?: boolean) {
        this.logger[debug ? "activate" : "deactivate"]();

        return this;
    }

    /**
     * 401 handler
     * @param res - Express Response object
     * @param comment=UNAUTHORIZED ACCESS Response data
     */
    public unauth(res: IHTTPResp, comment?: string): void {
        res.status(401).send({
            error: true,
            data: comment || "UNAUTHORIZED ACCESS"
        })
    }

    /**
     * 500 handler
     * @param res Express Response object
     * @param comment=INTERNAL SERVER ERROR Response data
     */
    public serverError(res: IHTTPResp, comment?: string): void {
        res.status(500).send({
            error: true,
            data: comment || "INTERNAL SERVER ERROR"
        })
    }

    /**
     * Callback Handler
     * @param res Express Response object
     */
    public handleResult(res: IHTTPResp): Function {
        return (err: Error, result: any, type = "array"): void => {
            type = type.toLowerCase();

            if (!err) {
                res.status(200).send({
                    error: false,
                    data: this.isUndefined(result) ? (type == "array" ? [] : {}) : result
                })
            } else {
                this.logger.error("HELPER_RESP HandleResult Err:", err)
                res.status(500).send({
                    error: true,
                    data: type == "array" ? [] : {}
                })
            }
        }
    }
    // public handleResult(res: IHTTPResp, err: Error, result: any, type = "array"): void {
    //     type = type.toLowerCase();

    //     if (!err) {
    //         res.status(200).send({
    //             error: false,
    //             data: this.isUndefined(result) ? (type == "array" ? [] : {}) : result
    //         })
    //     } else {
    //         this.logger.error("HELPER_RESP HandleResult Err:", err)
    //         res.status(500).send({
    //             error: true,
    //             data: type == "array" ? [] : {}
    //         })
    //     }
    // }

    /**
     * 200 handler
     * @param res Express Response object
     * @param data={} Response data
     */
    public success(res: IHTTPResp, data?: object): void {
        res.status(200).send({
            error: false,
            data: data || {}
        })
    }

    /**
     * 400 handler
     * @param res Express Response object
     * @param data=Failed Response data
     */
    public failed(res: IHTTPResp, data?: string): void {
        res.status(400).send({
            error: true,
            data: data || "Failed"
        })
    }

    /**
     * Create handler
     * @param res Express Response Object
     * @param data=CREATED Response data
     */
    public post(res: IHTTPResp, data?: object): void {
        res.status(201).send({
            error: false,
            data: data || "CREATED"
        })
    }

    /**
     * Update handler
     * @param res Express Response object
     * @param data=UPDATED Response data
     */
    public put(res: IHTTPResp, data?: object): void {
        res.status(202).send({
            error: false,
            data: data || "UPDATED"
        })
    }

    /**
     * Delete Handler
     * @param res Express Response object
     * @param data=DELETED Response data
     */
    public delete(res: IHTTPResp, data?: object): void {
        res.status(202).send({
            error: false,
            data: data || "DELETED"
        })
    }

    /**
     * Get and List Handler
     * @param res Express Response object
     * @param data Response data
     * @param list=true if true then data Defaults to [] else {}
     */
    public get(res: IHTTPResp, data?: any, list: boolean = true): void {
        res.status(200).send({
            error: false,
            data: this.isUndefined(data) ? (list ? { count: 0, list: [] } : {}) : data
        })
    }
    private isUndefined(data: any): boolean {
        return data == undefined || data == null
    }
}