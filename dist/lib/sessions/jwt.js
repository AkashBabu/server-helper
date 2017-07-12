"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const jwt = require("jwt-simple");
const mongo = require("mongojs");
const sh_Logger = require("logger-switch");
const index_1 = require("../../index");
class JWT {
    constructor(options, debug) {
        this.options = options;
        this.logger = new sh_Logger("sh_SESS-JWT");
        this.db = mongo(options.connStr);
        this.helper = new index_1.Helper(debug);
        this.helperResp = new index_1.HelperResp(debug);
        this.logger[debug ? "activate" : "deactivate"]();
    }
    login() {
        return (req, res) => {
            function loginCb() {
                return (err, user) => {
                    if (user) {
                        this.sendToken(res, user);
                    }
                    else {
                        if (err) {
                            this.logger.error(err);
                        }
                        err ? this.helperResp.serverError(res) :
                            this.helperResp.unauth(res, "Invalid Credentials");
                    }
                };
            }
            if (this.isUndefined(this.options.login)) {
                // Default Login Handler
                // expecting email, password fields to be present on req.body
                this.db.collection(this.options.collName).findOne({
                    email: req.body.email
                }, (err, user) => {
                    if (user) {
                        this.logger.log('user:', user);
                        let valid = this.helper.verifySaltHash((user.password || user.pwd), req.body.password);
                        loginCb.call(this)(err, valid ? user : false);
                        // loginCb.call(this)(null, user);
                    }
                    else {
                        loginCb.call(this)(err, user);
                    }
                });
            }
            else {
                this.options.login(req.body, loginCb.call(this));
            }
        };
    }
    register() {
        return (req, res) => {
            function registerCb() {
                return (err, user) => {
                    if (user) {
                        this.sendToken(res, user);
                    }
                    else {
                        if (err) {
                            this.logger.error(err);
                        }
                        this.helperResp.serverError(res);
                    }
                };
            }
            if (this.isUndefined(this.options.register)) {
                // Default registration handler
                // expects email, password to be present in req.body
                this.db.collection(this.options.collName).findOne({
                    email: req.body.email
                }, (err, user) => {
                    if (err) {
                        this.logger.error(err);
                        this.helperResp.serverError(res);
                    }
                    else {
                        if (user) {
                            // duplicate user
                            this.helperResp.failed(res, "Duplicate User");
                        }
                        else {
                            // We are good
                            req.body.password = this.helper.saltHash(req.body.password);
                            this.db.collection(this.options.collName).insert(req.body, registerCb.call(this));
                        }
                    }
                });
            }
            else {
                this.options.register(req.body, registerCb.call(this));
            }
        };
    }
    validate(whitelist) {
        return (req, res, next) => {
            function validateCb() {
                return (err, user) => {
                    if (user) {
                        req.user = user;
                        next();
                    }
                    else {
                        this.helperResp.unauth(res);
                    }
                };
            }
            function isWhitelist(urlSpecs) {
                return urlSpecs.some((urlSpec) => {
                    if (typeof urlSpec == "string") {
                        return urlSpec == req.path;
                    }
                    else if (typeof urlSpec == "object") {
                        return urlSpec.url == req.path && urlSpec.method == req.method;
                    }
                    else {
                        throw new Error("Whitelist Url must be either a string/object{url, method}");
                    }
                });
            }
            // If the request URL is whitelisted then take it through
            if (whitelist && isWhitelist(whitelist)) {
                return next();
            }
            let token = (req.headers["x-access-token"] || req.body && req.body.access_token) || (req.query && req.query.access_token) || null; // Get JWT Token
            if (token) {
                let decToken;
                try {
                    decToken = jwt.decode(token, this.options.secret);
                }
                catch (err) {
                    this.logger.error("Invalid JWT Token");
                    return this.helperResp.unauth(res);
                }
                if (decToken && decToken.expires && decToken.iss) {
                    if (moment(decToken.expires).diff(moment(), "minute") > 0) {
                        if (this.isUndefined(this.options.validate)) {
                            // Default validate handler
                            this.db.collection(this.options.collName).findOne({
                                _id: this.db.ObjectId(decToken.iss)
                            }, validateCb.call(this));
                        }
                        else {
                            this.options.validate(this.db.ObjectId(decToken.iss), validateCb.call(this));
                        }
                    }
                    else {
                        this.logger.info("JWT token expired for:", decToken.iss);
                        this.helperResp.unauth(res);
                    }
                }
                else {
                    this.logger.error("Failed to decode JWT Token:", decToken);
                    this.helperResp.unauth(res);
                }
            }
            else {
                this.logger.error("JWT Token not Present");
                this.helperResp.unauth(res);
            }
        };
    }
    isUndefined(data) {
        return data == undefined || data == null;
    }
    sendToken(res, user) {
        let expires = moment().add(this.options.validity, "day").toDate();
        let token = {
            iss: user._id,
            expires: expires
        };
        let encToken = jwt.encode(token, this.options.secret, "HS256");
        // res.cookie("token", encToken, { signed: true })
        res.status(200).send({
            error: false,
            data: {
                token: encToken,
                expires: expires,
                user: user
            }
        });
    }
}
exports.JWT = JWT;
