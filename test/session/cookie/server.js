var express = require('express')
var app = express();
var bodyParser = require("body-parser");
var logger = require('morgan');
var { Session } = require("../../../dist/index");
var passport = require('passport');
var path = require("path");

var config = require("./config")

var Helper = require("../../../dist/index").Helper;
var helper = new Helper()
var db = require("mongojs")(config.options.connStr)


var options = Object.assign({}, config.options);

var Cookie = Session.Cookie;
var cookie = new Cookie(options, false)

// app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// this order has to be maintained
cookie.configurePassport(passport);
cookie.configureSession(app)

app.use(cookie.validate(['/portal/login', '/portal/register', '/login', '/register'], '/portal/login'))

app.post('/login', cookie.login());


// app.post("/register", (req, res, next) => {
//         passport.authenticate('local-register', (err, user, info) => {
//             if (err) next(err);
//             if (!user) res.status(400).send({ error: true, data: info });
//             res.login(user, (err) => {
//                 if (err) next(err);
//                 return res.redirect()
//             })
//         })(req, res, next)
//     })
app.post('/register', cookie.register());

app.use((req, res, next) => {
    // console.log('req.user:', req.user)
    next()
})

// app.post('/validate', (req, res) => {
//     res.status(200).send({
//         error: false,
//         data: 'valid'
//     })
// })
// app.post('/validate-whitelist', cookie.validate(["/validate-whitelist"]), (req, res) => {
//     res.status(200).send({
//         error: false,
//         data: 'valid'
//     })
// })
app.get("/logout", cookie.logout(), (req, res) => {
    res.send("Logged Out")
})

app.get('/portal/login', (req, res) => {
    res.end("Login Page")
    // res.sendFile(path.join(__dirname, "login.html"))
})
app.get('/portal/register', (req, res) => {
    res.end("Register Page")
    // res.sendFile(path.join(__dirname, "register.html"))
})
app.get('/portal/index', (req, res) => {
    res.end("Index Page")
    // res.sendFile(path.join(__dirname, "index.html"))
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

// if (process.argv[2]) {
//     var users = [{
//         email: "test1@mail.com",
//         password: helper.saltHash('test123')
//     }, {
//         email: 'test2@mail.com',
//         password: helper.saltHash('test123')
//     }]
//     db.collection(config.options.collName).insert(users, () => {
//         app.listen(process.argv[2], () => {
//             console.log('Server runnig on:', process.argv[2]);
//         })

//     });
// }

module.exports = app;