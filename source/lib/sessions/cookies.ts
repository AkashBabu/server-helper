import * as session from "express-session";
import * as ConnectRedis from "connect-redis";
import * as passport from "passport";
import * as LocalStrategy from "passport-local";
import { IMiddleware, isUndefined } from "../../lib.com"
import * as mongo from "mongojs";
import { HelperResp, Helper } from "../../index";
import * as sh_Logger from "logger-switch";


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
    validate(whitelist?: (string | IUrl)[]): IMiddleware;
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
        return this.passport.authenticate("local-register", this.options.register)
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
            if (req.user || req.redirect) {
                next();
            } else {
                if (whitelist && isWhitelist(req, whitelist)) {
                    next();
                } else {
                    if (failureRedirect) {
                        req.redirect = true;
                        res.redirect(failureRedirect)
                    } else {
                        // res.redirect(this.options.login.failureRedirect);
                        this.helperResp.unauth(res);
                    }
                }
            }
        }
        // return (req, res, next) => {
        //     this.logger.log("req.user", req.user)
        //     if (req.user && req.user.redirect) {
        //         req.user.redirect = false;
        //         next();
        //     } else {
        //         let url = req.url;
        //         if (whitelist.indexOf(url) > -1) {
        //             this.logger.log("whitelisted")
        //             if (req.isAuthenticated()) {
        //                 req.user.redirect = true;
        //                 res.redirect("/portal/index");

        //             } else {
        //                 next();
        //             }
        //         } else {
        //             res.redirect("/portal/login");
        //         }
        //     }
        // }
    }

    public logout(): IMiddleware {
        return (req, res, next) => {
            req.logout();
            next();
        }
    }

    private configureSession(app): void {
        // let app = this.options.app;
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
                            this.logger.log("valid user:", user)
                            cb(null, valid ? user : false);
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
                    user.password = self.helper.saltHash(user.passsword);
                    self.db.collection(self.options.collName).insert(req.body, (err1, result1) => {
                        cb(null, true);
                    })

                } else {
                    cb(err, false);

                }
            })
        }));
    }

}
