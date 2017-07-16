import * as session from "express-session";
import * as ConnectRedis from "connect-redis";
import * as passport from "passport";
import * as LocalStrategy from "passport-local";
import { IMiddleware, isUndefined } from "../../lib.com"
import * as mongo from "mongojs";
import { HelperResp, Helper } from "../../index";
import * as sh_Logger from "logger-switch";
import * as express from "express";


export interface IUrl {
    url: string;
    method: string;
}
export interface IPassportOptions {
    successRedirect: string;
    failureRedirect: string;
    failureFlash?: boolean
}
export interface ICookieOptions {
    collName: string;
    connStr: string;
    // passport: any;
    // app: any;
    login: IPassportOptions;
    register: IPassportOptions;
    cookie: Object;
    secret: string;
    redisStore: Object;
    passportSerializer?: (user, cb) => void;
    passportDeserializer?: (userId, cb) => void;
    passportLogin?: (req, email, passport, cb) => void;
    passportRegister?: (req, email, passport, cb) => void;
}
export interface ICookie {
    login(): IMiddleware;
    register(): IMiddleware;
    logout(): IMiddleware;
    validate(whitelist?: (string | IUrl)[], failureRedirect?: string): IMiddleware;
}
export class Cookie implements ICookie {
    private db;
    private logger = new sh_Logger("sh_SESS_COOKIE");
    private helperResp;
    private helper;
    private store;
    private session;
    private passport;
    private app;
    constructor(private options: ICookieOptions, debug?: boolean) {
        this.db = mongo(options.connStr);
        this.logger[debug ? "activate" : "deactivate"]();
        this.helperResp = new HelperResp(debug);
        this.helper = new Helper(debug);
        let RedisStore = ConnectRedis(session);
        let store = new RedisStore(this.options.redisStore);

        this.session = {
            cookie: this.options.cookie,
            secret: this.options.secret,
            resave: false,
            saveUninitialized: true,
            store: store
        }

        return this;
    }

    public login(): IMiddleware {
        return this.passport.authenticate("local-login", this.options.login)
    }

    public register(): IMiddleware {
        return (req, res, next) => {
            this.passport.authenticate("local-register", (err, user, info) => {
                if (err) {
                    return res.redirect(this.options.register.failureRedirect)
                }
                if (!user) {
                    return res.status(400).send({ error: true, data: (info || "Invalid Register Information") })
                }
                req.logIn(user, (err1) => {
                    if (err1) {
                        next(err1)
                    }
                    return res.redirect(this.options.register.successRedirect);
                })
            })(req, res, next);
        }
    }

    public validate(whitelist?: (string | IUrl)[], failureRedirect?: string): IMiddleware {
        function isWhitelist(req, urlSpecs: (string | IUrl)[]): boolean {
            return urlSpecs.some((urlSpec: string | IUrl) => {
                if (typeof urlSpec == "string") {
                    return urlSpec == req.originalUrl;
                } else if (typeof urlSpec == "object") {
                    return urlSpec.url == req.url && urlSpec.method == req.method;
                } else {
                    throw new Error("Whitelist Url must be either a string/object{url, method}");
                }
            })
        }


        return (req, res, next) => {
            if (req.user) {
                next();
            } else {
                if (whitelist && isWhitelist(req, whitelist)) {
                    next();
                } else {
                    if (failureRedirect) {
                        res.redirect(failureRedirect)
                    } else {
                        this.helperResp.unauth(res);
                    }
                }
            }
        }
    }

    public logout(): IMiddleware {
        return (req, res, next) => {
            req.logout();
            next();
        }
    }

    private configureSession(app): void {
        let self = this;
        this.app = app;
        app.use(session(self.session))
        app.use(self.passport.initialize());
        app.use(self.passport.session());
    }

    private configurePassport(passport) {
        let self = this;
        this.passport = passport

        passport.serializeUser(self.options.passportSerializer ? self.options.passportSerializer : (user, cb) => {
            setImmediate(() => {
                cb(null, user._id);
            })
        })

        passport.deserializeUser(self.options.passportDeserializer ? self.options.passportDeserializer : (userId, cb) => {
            self.db.collection(self.options.collName).findOne({
                _id: self.db.ObjectId(userId)
            }, cb);
        })

        passport.use("local-login", new LocalStrategy({
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true,
            session: true
        }, this.options.passportLogin ? this.options.passportLogin : (req, email, password, cb) => {
            self.db.collection(self.options.collName).findOne({
                email: email
            }, (err, user) => {
                if (user) {
                    self.db.collection(self.options.collName).update(
                        {
                            _id: self.db.ObjectId(user._id)
                        }, {
                            $set: {
                                lastLoggedIn: new Date()
                            }
                        }, {
                            multi: false,
                            upsert: false
                        }, (err1, result1) => {
                            let valid = self.helper.verifySaltHash(user.password, password);
                            let result = valid ? user : false;
                            cb(null, result);
                        })

                } else {
                    cb(err, false);
                }
            })
        }));

        passport.use("local-register", new LocalStrategy({
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true,
            session: true
        }, this.options.passportRegister ? this.options.passportRegister : (req, email, password, cb) => {
            self.db.collection(self.options.collName).findOne({
                email: email
            }, (err, user) => {
                if (!user) {
                    req.body.password = self.helper.saltHash(req.body.password);
                    self.db.collection(self.options.collName).insert(req.body, (err1, result1) => {
                        // this.logger.log(err1, result1);
                        cb(err1, result1);
                    })

                } else {
                    this.logger.log("Duplicate Email")
                    cb(err, false, "Duplicate Email");

                }
            })
        }));
    }

}
