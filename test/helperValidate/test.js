var chai = require("chai")
var should = chai.should();

var HelperValidate = require("../../index").HelperValidate
var helperValidate = new HelperValidate()
var mongo = require("mongojs")

describe("Helper Validate", () => {

  describe("#range()", () => {
    it("should validate if the data passed is within the given range")
    it("should return false if any one of the param is not passed")
  })

  describe("#length()", () => {
    it("should validate only for greater than min if max is not passed")
    it("should return false and print error log if min and max are not passed")
    it("should validate the length of the array/string for the given range")
  })

  describe("#isMongoId()", () => {
    it("should return true if the given data is a valid mongo id")
    it("should return false  if the given data is an invalid mongoid")
  })

  describe("#in()", () => {
    it("should validate if the data exists in the given array")
    it("should return false if not array is passed")
  })

  describe("#isName()", () => {
    it("should allow only alphabets, numberic and (_-.)")
    it("should return false if any other special characters are used")
  })

  describe("#isEmail()", () => {
    it("should validate for email string")
  })

  describe("#isAlpha()", () => {
    it("should validate only for alphabets")
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
    it("should validate for alpha numeric")
    it("should not validate otherwise")
  })

  describe("#isDate()", () => {
    it("should validate if the given string is in date format")
    it("should validate the string against the given date format")
  })

  describe("#isRegex()", () => {
    it("should validate the string for the given expression")
  })

})
