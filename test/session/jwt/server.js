var express = require('express')
var app = express();
var bodyParser = require("body-parser");
var logger = require('morgan');
var { Session } = require("../../../dist/index");
var JWT = Session.JWT;

var config = require("./config")
var options = Object.assign({}, config.options);
options.login = login;
options.register = register;
options.validate = validate;

var db = require('mongojs')(options.connStr)

function login(body, cb) {
    db.collection(options.collName).findOne({
        email: body.email
    }, (err, result) => {
        if (result) {
            if (result.pwd == body.pwd) {
                cb(null, result);
            } else {
                cb(null, false);
            }
        } else {
            cb(err, false);
        }
    })
}

function register(body, cb) {
    db.collection(options.collName).insert(body, cb);
}

function validate(userId, cb) {
    db.collection(options.collName).findOne({
        _id: userId
    }, cb);
}
var jwt = new JWT(options, true);
var jwtDefault = new JWT(config.options, true);

// app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/login', jwt.login());
app.post("/login-default", jwtDefault.login())
app.post('/register', jwt.register());
app.post('/register-default', jwtDefault.register());

app.post('/validate', jwt.validate(), (req, res) => {
    res.status(200).send({
        error: false,
        data: 'valid'
    })
})

app.post('/validate-default', jwt.validate(), (req, res) => {
    res.status(200).send({
        error: false,
        data: 'valid'
    })
})

app.post("/validate-whitelist", jwt.validate(["/validate-whitelist"]), (req, res) => {
    res.status(200).send({
        error: false,
        data: 'valid'
    })
})
app.post("/validate-whitelist-object", jwt.validate([{
    url: "/validate-whitelist-object",
    method: "POST"
}]), (req, res) => {
    res.status(200).send({
        error: false,
        data: 'valid'
    })
})

app.use(jwt.validate());
app.get("/user", (req, res) => {
    res.send(req.user);
})

app.use((req, res) => {
    console.log('API Not Found')
    res.status(404).send({
        error: true,
        data: "API Not Found"
    })
})

app.use((err, req, res, next) => {
    console.error(err)
    res.status(500).send("Internal Server Error")
})

module.exports = app;