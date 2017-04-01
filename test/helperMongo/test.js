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

    describe("#getDateFormat()", () => {
        it("should return Year format", () => {
            helperMongo.getDateFormat("year").should.be.eql("%Y")

            var user = {
                name: 'Akash',
                cTime: new Date()
            }

            db.collection(userColl).insert(user, function(err, result) {
                if(result) {
                    db.collection
                } else {
                    console.log("Failed to Insert User in should return Year format");
                    done("Failed to insert User in should return Year format")
                }
            })


        })
        it("should return Month format", () => {
            helperMongo.getDateFormat("month").should.be.eql("%Y-%m-%d")
        })
        it("should return Day format", () => {
            helperMongo.getDateFormat("day").should.be.eql("%Y-%m-%d")
        })
        it("should return Hour format", () => {
            helperMongo.getDateFormat("day").should.be.eql("%Y-%m-%d")
        })
        it("should return Minute format", () => {
            helperMongo.getDateFormat("day").should.be.eql("%Y-%m-%d")
        })
        it("should return Second format", () => {
            helperMongo.getDateFormat("day").should.be.eql("%Y-%m-%d")
        })
        it("should return Millisecond format", () => {
            helperMongo.getDateFormat("day").should.be.eql("%Y-%m-%d")
        })
        it("should return Day format by default", () => {
            helperMongo.getDateFormat("day").should.be.eql("%Y-%m-%d")
        })
    })
})