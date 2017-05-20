var express = require('express')
var app = express();

var { HelperResp } = require("../../dist/index")
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

app.get("/success", function(req, res) {
    helperResp.success(res, {
        name: 'test'
    })
})

app.get("/failed", function(req, res) {
    helperResp.failed(res, "Invalid Data")
})

app.post("/post", function(req, res) {
    helperResp.post(res, { created: true })
})

app.put("/put", function(req, res) {
    helperResp.put(res, { accepted: true })
})

app.delete("/remove", function(req, res) {
    helperResp.delete(res, { remove: true })
})

app.get("/list", function(req, res) {
    helperResp.get(res, null, true)
})

app.get("/test/:name", function(req, res) {
    helperResp.get(res, req.params, false)
})

app.listen(12345, (err) => {
    if (err) console.log(err);
})

module.exports = app;