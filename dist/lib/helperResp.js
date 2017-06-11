"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sh_Logger = require("logger-switch");
class HelperResp {
    constructor(debug) {
        this.logger = new sh_Logger("sh-resp");
        this.logger[debug ? "activate" : "deactivate"]();
    }
    unauth(res, comment) {
        res.status(401).send({
            error: true,
            data: comment || "UNAUTHORIZED ACCESS"
        });
    }
    serverError(res, comment) {
        res.status(500).send({
            error: true,
            data: comment || "INTERNAL SERVER ERROR"
        });
    }
    handleResult(res, err, result, type = "array") {
        type = type.toLowerCase();
        if (!err) {
            res.status(200).send({
                error: false,
                data: this.isUndefined(result) ? (type == "array" ? [] : {}) : result
            });
        }
        else {
            this.logger.error("HELPER_RESP HandleResult Err:", err);
            res.status(500).send({
                error: true,
                data: type == "array" ? [] : {}
            });
        }
    }
    success(res, data) {
        res.status(200).send({
            error: false,
            data: data || {}
        });
    }
    failed(res, data) {
        res.status(400).send({
            error: true,
            data: data || "Failed"
        });
    }
    post(res, data) {
        res.status(201).send({
            error: false,
            data: data || "CREATED"
        });
    }
    put(res, data) {
        res.status(202).send({
            error: false,
            data: data || "UPDATED"
        });
    }
    delete(res, data) {
        res.status(202).send({
            error: false,
            data: data || "DELETED"
        });
    }
    get(res, data, list = true) {
        res.status(200).send({
            error: false,
            data: this.isUndefined(data) ? (list ? { count: 0, list: [] } : {}) : data
        });
    }
    isUndefined(data) {
        return data == undefined || data == null;
    }
}
exports.HelperResp = HelperResp;
