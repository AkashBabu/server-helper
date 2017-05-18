var express = require('express')
var app = express();

var {HelperResp} = require("../../dist/index")
var helperResp = new HelperResp(false);

app.get("/unauth", (req, res) => {
    helperResp.unauth(res, req.query.comments)
})

app.get("/serverError", (req, res) => {
    helperResp.serverError(res, req.query.comments)
})

app.get("/handleResult", (req, res) => {
    setTimeout(function() {
        helperResp.handleResult(res, null, req.query)
    }, 100)
})
app.get("/handleResult/:type", (req, res) => {
    setTimeout(function() {
        helperResp.handleResult(res, null, req.query, req.params.type)
    }, 100)
})

app.listen(12345, (err) => {
    if(err) console.log(err);
})

module.exports = app;