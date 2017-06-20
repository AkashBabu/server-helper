var express = require('express')
var app = express();
var bodyParser = require("body-parser");
var { HTTPInterface } = require("../../dist/index")
var logger = require('morgan')

var port = process.argv[2] || 34562;

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use("/api", new HTTPInterface(require("./config"), true));


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