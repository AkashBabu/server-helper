"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongo = require("mongojs");
const sh_Logger = require("logger-switch");
const index_1 = require("../index");
class CrudHandler {
    constructor(config, debug) {
        this.config = config;
        this.logger = new sh_Logger("sh_Crud_Handler");
        this.db = mongo(config.connStr);
        this.helperMongo = new index_1.HelperMongo(config.connStr, debug);
        this.helperResp = new index_1.HelperResp(debug);
        this.helper = new index_1.Helper(debug);
        this.logger[debug ? "activate" : "deactivate"]();
        return this;
    }
    create(collName) {
        return (req, res, next) => {
            this.db.collection(collName).insert(req.body, (err, result) => {
                if (result) {
                    this.helperResp.post(res, result);
                }
                else {
                    if (err) {
                        this.logger.error(`MONGO_ERR @ POST ${req.path} ::: ${err}`);
                        this.helperResp.serverError(res);
                    }
                    else {
                        this.helperResp.failed(res);
                    }
                }
            });
        };
    }
    get(collName) {
        return (req, res, next) => {
            this.helperMongo.getById(collName, req.params.id, (err, result) => {
                if (!err) {
                    this.helperResp.get(res, result, false);
                }
                else {
                    this.logger.error(`MONGO_ERR @ GET ${req.path} ::: ${err}`);
                    this.helperResp.serverError(res);
                }
            });
        };
    }
    list(collName) {
        return (req, res, next) => {
            this.helperMongo.getList(collName, req.query, (err, result) => {
                if (!err) {
                    this.helperResp.get(res, result, true);
                }
                else {
                    this.logger.error(`MONGO_ERR @ GET ${req.path} ::: ${err}`);
                    this.helperResp.serverError(res);
                }
            });
        };
    }
    update(collName) {
        return (req, res, next) => {
            this.helperMongo.update(collName, req.body, (err, result) => {
                if (!err) {
                    this.helperResp.put(res, result);
                }
                else {
                    this.logger.error(`MONGO_ERR @ PUT ${req.path} ::: ${err}`);
                    this.helperResp.serverError(res);
                }
            });
        };
    }
    remove(collName) {
        return (req, res, next) => {
            this.helperMongo.remove(collName, req.params.id, true, (err, result) => {
                if (!err) {
                    this.helperResp.delete(res);
                }
                else {
                    this.logger.error(`MONGO_ERR @ DELETE ${req.path} ::: ${err}`);
                    this.helperResp.serverError(res);
                }
            });
        };
    }
}
exports.CrudHandler = CrudHandler;
