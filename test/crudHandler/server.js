var express = require("express");
var bodyParser = require("body-parser");
var CrudHandler = require("../../dist/index").CrudHandler;
var crudHandler = new CrudHandler({connStr: "test"}, true);

var app = express();

var createValidations = [
    {
        name: "name",
        type: "string",
        errMsg: "Please provide a name"
    }
]

app.use(bodyParser.json());

app.post("/test", crudHandler.create("test", createValidations));
app.get("/test", crudHandler.list("test"));
app.get("/test/:id", crudHandler.get("test"));
app.put("/test/:id", crudHandler.update("test"));
app.delete("/test/:id", crudHandler.remove("test"));

module.exports = app;