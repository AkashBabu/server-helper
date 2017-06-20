"use strict";
const session = require("express-session");
const ConnectRedis = require("connect-redis");
const LocalStrategy = require("passport-local");
const mongo = require("mongojs");
const index_1 = require("../../index");
const sh_Logger = require("logger-switch");
class Cookie {
    constructor(options, debug) {
        this.options = options;
        this.logger = new sh_Logger("sh_SESS_COOKIE");
        this.db = mongo(options.connStr);
        this.logger[debug ? "activate" : "deactivate"]();
        this.helperResp = new index_1.HelperResp(debug);
        this.helper = new index_1.Helper(debug);
        let RedisStore = ConnectRedis(session);
        let store = new RedisStore(this.options.redisStore);
        this.session = {
            cookie: this.options.cookie,
            secret: this.options.secret,
            resave: false,
            saveUninitialized: true,
            store: store
        };
        return this;
    }
    login() {
        return this.passport.authenticate("local-login", this.options.login);
    }
    register() {
        return this.passport.authenticate("local-register", this.options.register);
    }
    validate(whitelist, failureRedirect) {
        function isWhitelist(req, urlSpecs) {
            return urlSpecs.some((urlSpec) => {
                if (typeof urlSpec == "string") {
                    return urlSpec == req.originalUrl;
                }
                else if (typeof urlSpec == "object") {
                    return urlSpec.url == req.url && urlSpec.method == req.method;
                }
                else {
                    throw new Error("Whitelist Url must be either a string/object{url, method}");
                }
            });
        }
        return (req, res, next) => {
            if (req.user || req.redirect) {
                next();
            }
            else {
                if (whitelist && isWhitelist(req, whitelist)) {
                    next();
                }
                else {
                    if (failureRedirect) {
                        req.redirect = true;
                        res.redirect(failureRedirect);
                    }
                    else {
                        // res.redirect(this.options.login.failureRedirect);
                        this.helperResp.unauth(res);
                    }
                }
            }
        };
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
    logout() {
        return (req, res, next) => {
            req.logout();
            next();
        };
    }
    configureSession(app) {
        // let app = this.options.app;
        let self = this;
        this.app = app;
        app.use(session(self.session));
        app.use(self.passport.initialize());
        app.use(self.passport.session());
    }
    configurePassport(passport) {
        let self = this;
        this.passport = passport;
        passport.serializeUser(self.options.passportSerializer ? self.options.passportSerializer : (user, cb) => {
            setImmediate(() => {
                cb(null, user._id);
            });
        });
        passport.deserializeUser(self.options.passportDeserializer ? self.options.passportDeserializer : (userId, cb) => {
            self.db.collection(self.options.collName).findOne({
                _id: self.db.ObjectId(userId)
            }, cb);
        });
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
                    self.db.collection(self.options.collName).update({
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
                        this.logger.log("valid user:", user);
                        cb(null, valid ? user : false);
                    });
                }
                else {
                    cb(err, false);
                }
            });
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
                    });
                }
                else {
                    cb(err, false);
                }
            });
        }));
    }
}
exports.Cookie = Cookie;