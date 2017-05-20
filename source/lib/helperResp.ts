import * as sh_Logger from "logger-switch"
import {IHTTPResp} from "./helper"

export interface IHelperResp {
    isUndefined(data: any): boolean;
    unauth(res: IHTTPResp, comment?: string): void;
    serverError(res: IHTTPResp, comment?: string): void;
    handleResult(res: IHTTPResp, err: Error, result: any, type?: string): void;
    success(res: IHTTPResp, data?: any): void;
    failed(res: IHTTPResp, data?: string): void;
    post(res: IHTTPResp, data?: any): void;
    put(res: IHTTPResp, data?: any): void;
    delete(res: IHTTPResp, data?: any): void;
    get(res:IHTTPResp, data?: any, list?: boolean): void;
}

export class HelperResp implements IHelperResp {
    sh_logger = new sh_Logger('sh-resp');
    constructor(debug?: boolean) {
        this.sh_logger[debug ? 'activate': "deactivate"]();
    }
    isUndefined(data: any): boolean {
        return data == undefined || data == null
    }
    unauth(res: IHTTPResp, comment?: string): void{
        res.status(401).send({
            error: true,
            data: comment || 'UNAUTHORIZED ACCESS'
        })
    }
    serverError(res: IHTTPResp, comment?: string): void {
        res.status(500).send({
            error: true,
            data: comment || "INTERNAL SERVER ERROR"
        })
    }
    handleResult(res: IHTTPResp, err: Error, result: any, type?: string): void{
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
                if (Array.isArray(result) && result.length == 0) {
                    res.status(204).send({
                        error: false,
                        data: []
                    })
                } else if (typeof result == 'object' && Object.keys(result).length == 0) {
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
            this.sh_logger.error("Handle Result Error:", err)

            res.status(500).send({
                error: true,
                data: type == 'array' ? [] : {}
            })
        }
    }
    success(res: IHTTPResp, data?: any): void{
        res.status(200).send({
            error: false,
            data: data || {}
        })
    }
    failed(res: IHTTPResp, data?: string): void{
        res.status(400).send({
            error: false,
            data: data || "Failed"
        })
    }
    post(res: IHTTPResp, data?: any): void{
        res.status(201).send({
            error: false,
            data: data || "CREATED"
        })
    }
    put(res: IHTTPResp, data?: any): void{
        res.status(202).send({
            error: false,
            data: data || "UPDATED"
        })
    }
    delete(res: IHTTPResp, data?: any): void {
        res.status(202).send({
            error: false,
            data: data || "DELETED"
        })
    }
    get(res:IHTTPResp, data = {}, list = true): void {
        res.status(200).send({
            error: false,
            data: data || list ? [] : {}
        })
    }
}