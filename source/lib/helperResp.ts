import * as sh_Logger from "logger-switch"
import {IHTTPResp} from "./helper"

export interface IHelperResp {
    isUndefined(data: any): boolean;
    unauth(res: IHTTPResp, comment?: string): void;
    serverError(res: IHTTPResp, comment?: string): void;
    handleResult(res: IHTTPResp, err: Error, result: any, type?: string): void;
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
                if (result.constructor == Array && result.length == 0) {
                    res.status(204).send({
                        error: false,
                        data: []
                    })
                } else if (result.constructor == Object && Object.keys(result).length == 0) {
                    res.status(204).send({
                        error: false,
                        data: {}
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
}