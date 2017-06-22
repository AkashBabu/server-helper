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
        return (req, res, next) => {
            this.passport.authenticate("local-register", (err, user, info) => {
                if (err) {
                    return res.redirect(this.options.register.failureRedirect);
                }
                if (!user) {
                    return res.status(400).send({ error: true, data: (info || "Invalid Register Information") });
                }
                req.logIn(user, (err1) => {
                    if (err1) {
                        next(err1);
                    }
                    return res.redirect(this.options.register.successRedirect);
                });
            })(req, res, next);
        };
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
            if (req.user) {
                next();
            }
            else {
                if (whitelist && isWhitelist(req, whitelist)) {
                    next();
                }
                else {
                    if (failureRedirect) {
                        res.redirect(failureRedirect);
                    }
                    else {
                        this.helperResp.unauth(res);
                    }
                }
            }
        };
    }
    logout() {
        return (req, res, next) => {
            req.logout();
            next();
        };
    }
    configureSession(app) {
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
                        let result = valid ? user : false;
                        cb(null, result);
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
                    req.body.password = self.helper.saltHash(req.body.password);
                    self.db.collection(self.options.collName).insert(req.body, (err1, result1) => {
                        // this.logger.log(err1, result1);
                        cb(err1, result1);
                    });
                }
                else {
                    this.logger.log("Duplicate Email");
                    cb(err, false, "Duplicate Email");
                }
            });
        }));
    }
}
exports.Cookie = Cookie;
