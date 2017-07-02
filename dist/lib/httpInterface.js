"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const mongojs = require("mongojs");
const sh_Logger = require("logger-switch");
const crud_1 = require("./crud");
const helperResp_1 = require("./helperResp");
const helperMongo_1 = require("./helperMongo");
const unknownColl = "sh_UNKOWN";
class HTTPInterface {
    constructor(config, debug) {
        this.config = config;
        this.logger = new sh_Logger("sh_httpInterface");
        this.router = express.Router({ mergeParams: true });
        this.db = mongojs(this.config.db.url);
        this.helperResp = new helperResp_1.HelperResp(debug);
        this.logger[debug ? "activate" : "deactivate"]();
        this.helperMongo = new helperMongo_1.HelperMongo(this.config.db.url, debug);
        this.processConfiguration();
        this.configureRoutes();
        return this.router;
    }
    processConfiguration() {
        this.mainRoutes;
    }
    configureRoutes() {
        const handlers = {
            create: this.createHandler(),
            get: this.getHandler(),
            list: this.listHandler(),
            remove: this.removeHandler(),
            update: this.updateHandler(),
        };
        this.router.use("/:collName", this.validateMiddleware(), new crud_1.CRUD(handlers));
    }
    getCollNames() {
        return this.config.collections.map((coll) => coll.name);
    }
    validateMiddleware() {
        let collNames = this.getCollNames();
        return (req, res, next) => {
            // Collection has to be specified in config
            // Operation has to be specified
            let index = collNames.indexOf(req.params.collName);
            if (index > -1) {
                let operations = this.config.collections[index].operations;
                if (operations) {
                    req.forward = !(operations || []).some((op) => {
                        return op.method == req.method && req.url == op.api;
                    });
                }
            }
            else {
                req.forward = true;
            }
            next();
        };
    }
    createHandler() {
        return (req, res, next) => {
            if (req.forward) {
                next();
            }
            else {
                let inputFormat = this.config.collections[req.params.collName].
                    this.db.collection(req.params.collName || unknownColl).insert(req.body, (err, result) => {
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
            }
        };
    }
    getHandler() {
        return (req, res, next) => {
            if (req.forward) {
                next();
            }
            else {
                this.helperMongo.getById(req.params.collName || unknownColl, req.params.id, (err, result) => {
                    if (!err) {
                        this.helperResp.get(res, result, false);
                    }
                    else {
                        this.logger.error(`MONGO_ERR @ GET ${req.path} ::: ${err}`);
                        this.helperResp.serverError(res);
                    }
                });
            }
        };
    }
    listHandler() {
        return (req, res, next) => {
            if (req.forward) {
                next();
            }
            else {
                this.helperMongo.getList(req.params.collName || unknownColl, req.query, (err, result) => {
                    if (!err) {
                        this.helperResp.get(res, result, true);
                    }
                    else {
                        this.logger.error(`MONGO_ERR @ GET ${req.path} ::: ${err}`);
                        this.helperResp.serverError(res);
                    }
                });
            }
        };
    }
    updateHandler() {
        return (req, res, next) => {
            if (req.forward) {
                next();
            }
            else {
                this.helperMongo.update(req.params.collName || unknownColl, req.body, (err, result) => {
                    if (!err) {
                        this.helperResp.put(res, result);
                    }
                    else {
                        this.logger.error(`MONGO_ERR @ PUT ${req.path} ::: ${err}`);
                        this.helperResp.serverError(res);
                    }
                });
            }
        };
    }
    removeHandler() {
        return (req, res, next) => {
            if (req.forward) {
                next();
            }
            else {
                this.helperMongo.remove(req.params.collName || unknownColl, req.params.id, true, (err, result) => {
                    if (!err) {
                        this.helperResp.delete(res);
                    }
                    else {
                        this.logger.error(`MONGO_ERR @ DELETE ${req.path} ::: ${err}`);
                        this.helperResp.serverError(res);
                    }
                });
            }
        };
    }
}
exports.HTTPInterface = HTTPInterface;
