var should = require("chai").should();

var { HelperValidate } = require("../../dist/index")
var helperValidate = new HelperValidate(false)
var mongo = require("mongojs")

let moment = require('moment')

describe("Helper Validate", () => {

  describe("#range()", () => {
    it("should validate if the data passed is within the given range", () => {
      helperValidate.range(12, 1, 13).should.be.ok;
      helperValidate.range(12, 0, 10).should.not.be.ok;
    })
  })

  describe("#length()", () => {
    it("should validate only for greater than min if max is not passed", () => {
      helperValidate.length("asdf", 3).should.be.ok;
    })
    it("should validate the length of the array/string for the given range", () => {
      helperValidate.length("asdf", 3, 5).should.be.ok;
      helperValidate.length([1, 2, 3, 4], 2, 3).should.not.be.ok;
    })
  })

  describe("#isMongoId()", () => {
    it("should return true if the given data is a valid mongo id", () => {
      var id = mongo.ObjectId()
      helperValidate.isMongoId(id).should.be.ok;
    })
    it("should return false  if the given data is an invalid mongoid", () => {
      helperValidate.isMongoId("asdf").should.not.be.ok;
    })
  })

  describe("#in()", () => {
    it("should validate if the data exists in the given array", () => {
      var arr = [1, 2, 3, 4, 5]
      helperValidate.in(2, arr).should.be.ok
      helperValidate.in(6, arr).should.not.be.ok;
    })
    it("should perform deep checking if the data is of type object | array", () => {
      var data = { name: 1, age: 3 }
      var data2 = [1, 2]
      var arr = [{ name: 2 }, { name: 1, age: 3 }, [1, 2]]
      helperValidate.in(data, arr).should.be.ok;
      helperValidate.in(data2, arr).should.be.ok;
    })
  })

  describe("#isName()", () => {
    it("should allow only alphabets, numberic and (_-.)", () => {
      var name = "asdfASDF -_.0123"
      helperValidate.isName(name).should.be.ok
    })
    it("should return false if any other special characters are used", () => {
      var name = "asdfASDF? -_,0123"
      helperValidate.isName(name).should.not.be.ok
    })
  })

  describe("#isEmail()", () => {
    it("should validate for email string", () => {
      helperValidate.isEmail("test.test@in.test.com").should.be.ok
      helperValidate.isEmail("test@test.org").should.be.ok
      helperValidate.isEmail("@mail.com").should.not.be.ok
      helperValidate.isEmail("test@.com").should.not.be.ok;
      helperValidate.isEmail("test@mail.c").should.not.be.ok;
    })
  })

  describe("#isAlpha()", () => {
    it("should validate only for alphabets", () => {
      helperValidate.isAlpha("asdfASD").should.be.ok;
      helperValidate.isAlpha("asdfASD1324").should.not.be.ok;
    })
  })

  describe("#isNumeric()", () => {
    it("should validate numbers", () => {
      var i = 23456
      helperValidate.isNumeric(i).should.be.ok
    })
    it("should validate for floating point numbers", () => {
      var i = 23.456
      helperValidate.isNumeric(i).should.be.ok
    })
    it("should not validate if the string is not numeric", () => {
      var str = "asdf"
      helperValidate.isNumeric(str).should.not.be.ok
    })
  })

  describe("#isAlphaNumeric()", () => {
    it("should validate only for alpha numeric", () => {
      helperValidate.isAlphaNumeric("asdfASD").should.be.ok;
      helperValidate.isAlphaNumeric("asdf").should.be.ok;
      helperValidate.isAlphaNumeric("asdfASD1234").should.be.ok;
      helperValidate.isAlphaNumeric("asdfASD1234?").should.not.be.ok;
    })
  })

  describe("#isDate()", () => {
    it("should validate the string against the given date format", () => {
      helperValidate.isDate("2017", "YYYY").should.be.ok
      helperValidate.isDate("2017", "MM-DD").should.not.be.ok
    })
  })

  describe("#isRegex()", () => {
    it("should validate the string for the given expression", () => {
      helperValidate.isRegex("asdfASDF", "[asdf]*[ASDF]*").should.be.ok
      helperValidate.isRegex("asdfASDF1234", "[asdf]*[ASDF]*").should.be.ok
      helperValidate.isRegex("asdfASDF1234", "^[asdf]*[ASDF]*$").should.not.be.ok
    })
  })

})
