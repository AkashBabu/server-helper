"use strict";
const sh_Logger = require("logger-switch");
class HelperResp {
    constructor(debug) {
        this.sh_logger = new sh_Logger('sh-resp');
        this.sh_logger[debug ? 'activate' : "deactivate"]();
    }
    isUndefined(data) {
        return data == undefined || data == null;
    }
    unauth(res, comment) {
        res.status(401).send({
            error: true,
            data: comment || 'UNAUTHORIZED ACCESS'
        });
    }
    serverError(res, comment) {
        res.status(500).send({
            error: true,
            data: comment || "INTERNAL SERVER ERROR"
        });
    }
    handleResult(res, err, result, type) {
        if (!type) {
            type = 'array';
        }
        type = type.toLowerCase();
        if (!err) {
            if (this.isUndefined(result)) {
                res.status(204).send({
                    error: false,
                    data: type == 'array' ? [] : {}
                });
            }
            else {
                if (result.constructor == Array && result.length == 0) {
                    res.status(204).send({
                        error: false,
                        data: []
                    });
                }
                else if (result.constructor == Object && Object.keys(result).length == 0) {
                    res.status(204).send({
                        error: false,
                        data: {}
                    });
                }
            }
        }
        else {
            this.sh_logger.error("Handle Result Error:", err);
            res.status(500).send({
                error: true,
                data: type == 'array' ? [] : {}
            });
        }
    }
}
exports.HelperResp = HelperResp;