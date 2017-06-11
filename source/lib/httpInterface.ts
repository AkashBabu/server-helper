import * as express from "express"
import * as mongojs from "mongojs"
import * as Logger from "logger-switch"
import { CRUD as Crud } from "./crud"
import { HelperResp } from "./helperResp"
import { HelperMongo } from "./helperMongo"

const unknownColl = "sh_UNKOWN"
export interface ICollProvider {
    name: string;

}
export interface IDBProvider {
    url?: string;
    host?: string;
    port?: string | number;
    dbName?: string;
}

export interface IConfig {
    collections?: ICollProvider[];
    db?: IDBProvider;
}

export interface IExpressMiddleware {
    (req, res, next?: Function): void;
}
export class HTTPInterface {
    public router;
    private db;
    private helperResp;
    private logger;
    private helperMongo;
    constructor(private config: IConfig, debug?: boolean) {
        this.router = express.Router({mergeParams: true});
        this.db = mongojs(this.config.db.url);
        this.helperResp = new HelperResp(debug);
        this.logger = new Logger("sh_httpInterface");
        this.logger[debug ? "activate" : "deactivate"]();
        this.helperMongo = new HelperMongo(this.config.db.url, debug);

        this.configureRoutes();
        return this.router;
    }
    private configureRoutes() {

        const handlers = {
            create: this.createHandler(),
            get: this.getHandler(),
            list: this.listHandler(),
            remove: this.removeHandler(),
            update: this.updateHandler(),
        };

        this.router.use("/:collName"
                , this.validateMiddleware()
                , new Crud(handlers));

    }
    private getCollNames(): string[] {
        return this.config.collections.map((coll) => coll.name);
    }

    private validateMiddleware(): IExpressMiddleware {
        let collNames = this.getCollNames();
        this.logger.log("collNames:", collNames)
        return (req, res, next) => {
            this.logger.log("collName:", req.params.collName);
            if (collNames.indexOf(req.params.collName) > -1) {
                next();
            } else {
                this.helperResp.failed(res, "Invalid Collection Name");
            }
        }
    }

    private createHandler(): IExpressMiddleware {
        return (req, res, next) => {
            this.logger.log("collName in createHandler:", req.params.collName)
            this.db.collection(req.params.collName || unknownColl).insert(req.body, (err, result) => {
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

    private getHandler(): IExpressMiddleware {
        return (req, res) => {
            this.helperMongo.getById(req.params.collName || unknownColl, req.params.id, (err, result) => {
                if (!err) {
                    this.helperResp.get(res, result, false);
                } else {
                    this.logger.error(`MONGO_ERR @ GET ${req.path} ::: ${err}`)
                    this.helperResp.serverError(res);
                }
            })
        }
    }
    private listHandler(): IExpressMiddleware {
        return (req, res) => {
            this.helperMongo.getList(req.params.collName || unknownColl, req.query, (err, result) => {
                if(!err) {
                    this.helperResp.get(res, result, true)
                } else {
                    this.logger.error(`MONGO_ERR @ GET ${req.path} ::: ${err}`)
                    this.helperResp.serverError(res)
                }
            })
        }
    }
    private updateHandler(): IExpressMiddleware {
        return (req, res) => {
            this.helperMongo.update(req.params.collName || unknownColl, req.body, (err, result) => {
                if(!err) {
                    this.helperResp.put(res, result);
                } else {
                    this.logger.error(`MONGO_ERR @ PUT ${req.path} ::: ${err}`)
                    this.helperResp.serverError(res);
                }
            })
        }
    }
    private removeHandler(): IExpressMiddleware {
        return (req, res) => {
            this.helperMongo.remove(req.params.collName || unknownColl, req.params.id, true, (err, result) => {
                if(!err) {
                    this.helperResp.delete(res);
                } else {
                    this.logger.error(`MONGO_ERR @ DELETE ${req.path} ::: ${err}`)
                    this.helperResp.serverError(res);
                }
            })
        }
    }
}