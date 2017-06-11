var express = require('express')
var app = express();
var bodyParser = require("body-parser");
var {HTTPInterface} = require("../../dist/index")
var logger = require('morgan')

var port = process.argv[2] || 34562;

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use("/api", new HTTPInterface(require("./config"), true));

// if(process.argv[2]){
//     app.listen(port, (err) => {
//         if(!err) console.log('Server running');
//         else console.error('failed to start server');
//     })
// }

module.exports = app;