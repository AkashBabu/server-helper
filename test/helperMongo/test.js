var serverHelper = require('../../index');
var HelperMongo = serverHelper.HelperMongo;
var connStr = "sh_test"
var helperMongo = new Helper(connStr, true);
var mongojs = require('mongojs')
var db = mongojs(connStr)

var chai = require("chai")
var should = chai.should()
var assert = chai.assert

var userColl = "users"

describe("helper mongo", () => {

    beforeEach((done) => {
        db.collection(userColl).remove({}, done)
    })

    after((done) => {
        db.dropDatabase(done)
    })
})