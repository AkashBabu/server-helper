import * as express from "express";

export interface ICallback {
    (err?: string, result?: object[] | object): any
}

export interface IRequest extends express.Request {
    body?: any;
    user?: any;
    logIn?: Function;
    logout?: Function;
}
export interface IResponse extends express.Response {
}
export interface IMiddleware {
    (req: IRequest, res: IResponse, next?: express.NextFunction): void;
}

export function isUndefined(data): boolean {
    return data == undefined || data == null;
} 
