var should = require('chai').should();
var mongo = require('mongojs')
var { HelperTransform } = require("../../dist/index")
var helperTransform = new HelperTransform(false);

var moment = require("moment")

describe("Helper Transform", () => {

    describe("#toLowerCase", () => {
        it("should convert the given string to lowerCase", () => {
            var str = 'asdYUIbnjsd123454->/?'
            helperTransform.toLowerCase(str).should.be.eql(str.toLowerCase())
        })
    })

    describe("#toUpperCase", () => {
        it("should convert the given string to upperCase", () => {
            var str = 'asdYUIbnjsd123454->/?'
            helperTransform.toUpperCase(str).should.be.eql(str.toUpperCase())
        })
    })

    describe("#toMongoId", () => {
        it("should convert the given string to mongoObjectId", () => {
            var id = mongo.ObjectId().toString()
            helperTransform.toMongoId(id).should.be.an.instanceOf(mongo.ObjectId)
        })
        it("should return null if invalid MongoId is passed", () => {
            var id = 'asdfasdf'
            should.not.exist(helperTransform.toMongoId(id))
        })
    })

    describe("#toDate", () => {
        it("should convert the given string to Date object", () => {
            helperTransform.toDate(1234567890).should.be.an.instanceOf(Date)
        })
        it("should return null if invalid date string is passed", () => {
            helperTransform.toDate("asdf").should.be.instanceof(Date)
        })
    })

    describe("#toMoment", () => {
        it("should convert the date string to moment object", () => {
            helperTransform.toMoment("2017-02-10T12:12:12Z").should.be.instanceOf(moment)
        })
        it("should return null if invalid date string is passed", () => {
            helperTransform.toMoment("asdf").should.be.instanceOf(moment)
        })
    })

    describe("#toInt", () => {
        it("should convert the given string to Number", () => {
            var int = "123"
            helperTransform.toInt(int).should.be.eql(parseInt(int))
        })
    })

    describe("#toFloat", () => {
        it("should convert the given string to float", () => {
            var str = "123.23"
            helperTransform.toFloat(str).should.be.eql(parseFloat(str))
        })
        it("should round the given string to required floating points", () => {
            var str = "123.2334"
            helperTransform.toFloat(str, 2).should.be.eql(parseFloat(parseFloat(str).toFixed(2)))
        })
    })

    describe("#toSaltHash", () => {
        it("should anonymize the given string", () => {
            helperTransform.toSaltHash("pwd").should.not.be.eql("pwd")
        })
    })
    describe("#stripXss", () => {
        it("should remove any Html tags in the passed string", () => {
            var template = `present<html>absent</html>`
            helperTransform.stripXss(template).should.be.eql("present")
        })
        it("should the same string unaltered if it doesnt contain an ending tag", () => {
            var template = `<html>present`
            helperTransform.stripXss(template).should.be.eql("<html>present")
        })
    })

})