var app = require('express')();
var bodyParser = require('body-parser');

var Crud = require('../index').Crud;

var users = [{
    id: '1',
    name: 'akash',
    age: 21
}]

function insert(req, res) {
    users.push(req.body);
    res.status(201).send({
        error: false,
        data: 'Created Successfully'
    })
}

function get(req, res) {
    var obj = {};
    users.every(user => {
        if (user.id == req.params.id) {
            obj = user;
            return false;
        }
        return true;
    })
    res.status(200).send({
        error: false,
        data: obj
    });
}

function list(req, res) {
    res.status(200).send({
        error: false,
        data: users
    })
}

var User = {
  insert : insert,
  get : get,
  list : list
}

var devices = [{
    id: '1',
    sno : '00001232'
}]

function insert(req, res) {
    devices.push(req.body);
    res.status(201).send({
        error: false,
        data: 'Created Successfully'
    })
}

function get(req, res) {
    var obj = {};
    devices.every(device => {
        if (device.id == req.params.id) {
            obj = device;
            return false;
        }
        return true;
    })
    res.status(200).send({
        error: false,
        data: obj
    });
}

function list(req, res) {
    res.status(200).send({
        error: false,
        data: devices
    })
}

var Device = {
  insert : insert,
  get : get,
  list : list
}

var UserCrud = new Crud(User);
var DeviceCrud = new Crud(Device);

var port = process.argv[2] || 8000;


app.use(bodyParser.json());

app.use('/users', UserCrud);
app.use('/devices', DeviceCrud);

app.listen(port, function(err){
  if(!err){
    console.log('Server listening on port :', port);
  }
})
