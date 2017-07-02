import { IMiddleware } from "../lib.com";
export interface ICrudHandlerOptions {
    connStr: string;
}
export interface ICrudFn {
    (collName: string): IMiddleware;
}
export interface ICrudHandler {
    create: ICrudFn;
    list: ICrudFn;
    get: ICrudFn;
    update: ICrudFn;
    remove: ICrudFn;
}
export declare class CrudHandler implements ICrudHandler {
    private config;
    private helperMongo;
    private helperResp;
    private helper;
    private db;
    private logger;
    constructor(config: ICrudHandlerOptions, debug?: boolean);
    create(collName: string): IMiddleware;
    get(collName: string): IMiddleware;
    list(collName: string): IMiddleware;
    update(collName: string): IMiddleware;
    remove(collName: string): IMiddleware;
}
