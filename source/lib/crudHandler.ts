import * as mongo from "mongojs";
import * as sh_Logger from "logger-switch";

import { HelperMongo, HelperResp, Helper } from "../index";
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

export class CrudHandler implements ICrudHandler {
    private helperMongo;
    private helperResp;
    private helper;
    private db;
    private logger = new sh_Logger("sh_Crud_Handler");
    constructor(private config: ICrudHandlerOptions, debug?: boolean) {
        this.db = mongo(config.connStr);
        this.helperMongo = new HelperMongo(config.connStr, debug);
        this.helperResp = new HelperResp(debug);
        this.helper = new Helper(debug);
        this.logger[debug ? "activate" : "deactivate"]();

        return this;
    }

    public create(collName: string): IMiddleware {
        return (req, res, next) => {
            this.db.collection(collName).insert(req.body, (err, result) => {
                if (result) {
                    this.helperResp.post(res, result);
                } else {
                    if (err) {
                        this.logger.error(`MONGO_ERR @ POST ${req.path} ::: ${err}`);
                        this.helperResp.serverError(res);
                    } else {
                        this.helperResp.failed(res);
                    }
                }
            })
        }
    }

    public get(collName: string): IMiddleware {
        return (req, res, next) => {
            this.helperMongo.getById(collName, req.params.id, (err, result) => {
                if (!err) {
                    this.helperResp.get(res, result, false);
                } else {
                    this.logger.error(`MONGO_ERR @ GET ${req.path} ::: ${err}`)
                    this.helperResp.serverError(res);
                }
            })
        }
    }
    public list(collName: string): IMiddleware {
        return (req, res, next) => {
            this.helperMongo.getList(collName, req.query, (err, result) => {
                if (!err) {
                    this.helperResp.get(res, result, true)
                } else {
                    this.logger.error(`MONGO_ERR @ GET ${req.path} ::: ${err}`)
                    this.helperResp.serverError(res)
                }
            })
        }
    }
    public update(collName: string): IMiddleware {
        return (req, res, next) => {
            this.helperMongo.update(collName, req.body, (err, result) => {
                if (!err) {
                    this.helperResp.put(res, result);
                } else {
                    this.logger.error(`MONGO_ERR @ PUT ${req.path} ::: ${err}`)
                    this.helperResp.serverError(res);
                }
            })
        }
    }
    public remove(collName: string): IMiddleware {
        return (req, res, next) => {
            this.helperMongo.remove(collName, req.params.id, true, (err, result) => {
                if (!err) {
                    this.helperResp.delete(res);
                } else {
                    this.logger.error(`MONGO_ERR @ DELETE ${req.path} ::: ${err}`)
                    this.helperResp.serverError(res);
                }
            })
        }
    }
}
