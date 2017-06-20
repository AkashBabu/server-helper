var config = require("./config")
var LocalStrategy = require('passport-local').Strategy;
var userColl = config.options.collName;
var mongo = require('mongojs')
var db = mongo(config.options.connStr)
var Helper = require("../../../dist/index").Helper;
var helper = new Helper(true);

function passportConfig(passport) {
    passport.serializeUser(function(user, cb) {
        // console.log('user in serializer-', user);
        cb(null, user._id);
    })

    passport.deserializeUser(function(userId, cb) {
        db.collection(userColl).findOne({
            _id: db.ObjectId(userId)
        }, cb);
    })

    passport.use('local-login', new LocalStrategy({
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
    }, function(req, email, password, cb) {
        console.log('email:', email);
        console.log('pwd:', password);
        db.collection(userColl).findOne({
            email: email
        }, function(err, user) {

            if (user) {
                db.collection(userColl).update({
                    _id: db.ObjectId(user._id)
                }, {
                    $set: {
                        lastLoggedIn: new Date()
                    }
                }, {
                    multi: false,
                    upsert: false
                }, function(err, result) {
                    var valid = helper.verifySaltHash(user.password, password) ? user : false;
                    // var valid = (user.pwd == password) ? user : false;
                    console.log("user valid :", valid);
                    // cb(null, (user.pwd == password) ? user : false);
                    cb(null, valid);
                })

            } else {
                cb(err, false);

            }
        })
    }));
}

var express = require("express")
var logger = require('morgan');
var bodyParser = require('body-parser');
var path = require("path");

var options = config.options;
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
global.passport = require('passport');

passportConfig(passport);

var whitelist = ['/portal/login', '/api/login'];

var app = express();

var port = 8001;

app.use(logger('dev'));

app.use(session({
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: true,
    },
    secret: "sek9lWPoIfc890",
    resave: false,
    saveUninitialized: true,
    store: new RedisStore(options.redisStore)
}))
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(validateSession());

var api = express.Router()
api.post('/login', (req, res, next) => {
        console.log('Api/login')
        next()
    },
    passport.authenticate('local-login', {
        successRedirect: "/portal/index",
        failureRedirect: "/portal/login",
        failureFlash: false
    }), (req, res) => {
        console.log('failed login:', req.user)
        res.redirect("/portal/login");
    })


api.get('/logout', function(req, res) {
    req.logout();
    if (req.user)
        req.user.redirect = true;
    res.redirect("/");
})

var portal = express.Router();

portal.get("/:page", function(req, res) {
    var file = path.join(__dirname, req.params.page + ".html")
    res.sendFile(file);
})

app.use('/api', api);
app.use('/portal', portal);



app.use(function(req, res) {
    res.redirect('/portal/index');
})


app.use(function(err, req, res, next) {
    console.log(err)
        // helperResp.sendServerError(res);
    res.status(500).send("Internal Server Error");
    // helperResp.sendError(res, "Internal Server Error");
})

app.listen(port, function(err) {
    console.log('Server listening on port:', port);
})

process.on("uncaughtException", function(e) {
    console.log('Uncaught Exception - ', e);
})

module.exports = app;


function validateSession() {
    return function(req, res, next) {
        console.log('user-', req.user);
        // console.deactivate();
        if (req.user && req.user.redirect) {
            console.log("redirection valid");
            req.user.redirect = false;
            next();

        } else {

            var url = req.url;
            if (whitelist.indexOf(url) > -1) {
                console.log("Redirection in whitelist");
                if (req.isAuthenticated()) {
                    console.log("redirection in whitelist authenticated");
                    req.user.redirect = true;
                    console.log("redirecting from validateSession, for req in whitelist and authenticated");
                    res.redirect("/portal/index");

                } else {
                    console.log("Redirection in whitelist not authenticated");
                    next();

                }
            } else if (req.isAuthenticated()) {
                console.log("redirection not in whitelist but authenticated");
                next();

            } else {
                console.log("redirection not in whitelist and not authenticated");
                if (req.user) {
                    req.user.redirect = true;
                }
                console.log("redirecting from validateSession, for req not in whitelist and not authenticated");
                res.redirect('/portal/login');

            }
        }
    }
}