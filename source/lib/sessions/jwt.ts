import * as moment from "moment";
import * as jwt from "jwt-simple";
import * as mongo from "mongojs";
import * as sh_Logger from "logger-switch";
import { HelperResp, Helper } from "../../index";
import { IMiddleware } from "../../lib.com"


export interface IUrl {
    url: string;
    method: string;
}
export interface IJWTOptions {
    collName: string;
    connStr: string;
    secret: string;
    validity: number;
    login?: (user, cb) => void;
    register?: (user, cb) => void;
    validate?: (user, cb) => void;
}

export interface IJWT {
    login: () => IMiddleware;
    register: () => IMiddleware;
    validate: (whitelist?: (string | IUrl)[]) => IMiddleware;
}

export class JWT implements IJWT {
    private db;
    private helper;
    private helperResp;
    private logger = new sh_Logger("sh_SESS-JWT");
    constructor(private options: IJWTOptions, debug?: boolean) {
        this.db = mongo(options.connStr);
        this.helper = new Helper(debug);
        this.helperResp = new HelperResp(debug);
        this.logger[debug ? "activate" : "deactivate"]();
    }
    public login(): IMiddleware {
        return (req, res) => {

            function loginCb() {
                return (err, user) => {
                    if (user) {
                        this.sendToken(res, user);
                    } else {
                        if (err) {
                            this.logger.error(err);
                        }

                        err ? this.helperResp.serverError(res) :
                            this.helperResp.unauth(res, "Invalid Credentials");
                    }
                }
            }

            if (this.isUndefined(this.options.login)) {
                // Default Login Handler
                // expecting email, password fields to be present on req.body
                this.db.collection(this.options.collName).findOne({
                    email: req.body.email
                }, (err, user) => {
                    if (user) {
                        // this.logger.log('user:', user);
                        let valid = this.helper.verifySaltHash((user.password || user.pwd), req.body.password);
                        loginCb.call(this)(err, valid ? user : false);
                        // loginCb.call(this)(null, user);
                    } else {
                        loginCb.call(this)(err, user);
                    }
                })
            } else {
                this.options.login(req.body, loginCb.call(this))
            }
        }
    }

    public register(): IMiddleware {
        return (req, res) => {

            function registerCb() {
                return (err, user) => {
                    if (user) {
                        this.sendToken(res, user);
                    } else {
                        if (err) {
                            this.logger.error(err);
                        }
                        this.helperResp.serverError(res);
                    }
                }
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
                    } else {
                        if (user) {
                            // duplicate user
                            this.helperResp.failed(res, "Duplicate User");
                        } else {
                            // We are good
                            req.body.password = this.helper.saltHash(req.body.password);
                            this.db.collection(this.options.collName).insert(req.body, registerCb.call(this));
                        }
                    }
                })
            } else {
                this.options.register(req.body, registerCb.call(this));
            }
        }
    }

    public validate(whitelist?: (string | IUrl)[]): IMiddleware {
        return (req, res, next) => {

            function validateCb() {
                return (err, user) => {
                    if (user) {
                        req.user = user;
                        next();
                    } else {
                        this.helperResp.unauth(res);
                    }
                }
            }

            function isWhitelist(urlSpecs: (string | IUrl)[]): boolean {
                return urlSpecs.some((urlSpec: string | IUrl) => {
                    if (typeof urlSpec == "string") {
                        return urlSpec == req.path;
                    } else if (typeof urlSpec == "object") {
                        return urlSpec.url == req.path && urlSpec.method == req.method;
                    } else {
                        throw new Error("Whitelist Url must be either a string/object{url, method}");
                    }
                })
            }

            // If the request URL is whitelisted then take it through
            if (whitelist && isWhitelist(whitelist)) {
                return next();
            }

            let token = (req.headers["x-access-token"] || req.body && req.body.access_token) || (req.query && req.query.access_token) || null; // Get JWT Token
            if (token) {
                let decToken;
                try {
                    decToken = (<any>jwt).decode(token, this.options.secret)
                } catch (err) {
                    this.logger.error("Invalid JWT Token");
                    return this.helperResp.unauth(res)
                }

                if (decToken && decToken.expires && decToken.iss) {

                    if (moment(decToken.expires).diff(moment(), "minute") > 0) {

                        if (this.isUndefined(this.options.validate)) {
                            // Default validate handler
                            this.db.collection(this.options.collName).findOne({
                                _id: this.db.ObjectId(decToken.iss)
                            }, validateCb.call(this));
                        } else {
                            this.options.validate(this.db.ObjectId(decToken.iss), validateCb.call(this))
                        }
                    } else {
                        this.logger.info("JWT token expired for:", decToken.iss);
                        this.helperResp.unauth(res)
                    }
                } else {
                    this.logger.error("Failed to decode JWT Token:", decToken);
                    this.helperResp.unauth(res)
                }
            } else {
                this.logger.error("JWT Token not Present");
                this.helperResp.unauth(res);
            }
        }
    }
    private isUndefined(data) {
        return data == undefined || data == null;
    }

    private sendToken(res, user) {
        let expires = moment().add(this.options.validity, "day").toDate();
        let token = {
            iss: user._id,
            expires: expires
        }

        let encToken = (<any>jwt).encode(token, this.options.secret, "HS256");
        // res.cookie("token", encToken, { signed: true })

        res.status(200).send({
            error: false,
            data: {
                token: encToken,
                expires: expires,
                user: user
            }
        })
    }

}
