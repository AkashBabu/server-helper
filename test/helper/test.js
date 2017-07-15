var serverHelper = require('../../dist/index');
var Helper = serverHelper.Helper;
var helper = new Helper(true);

var chai = require('chai');
var assert = chai.assert
var should = chai.should()

describe('helper', () => {

    describe("#filterObj()", () => {
        it("should filter only the required fields", () => {
            var obj = {
                a: 1,
                b: 1,
                c: 1
            }
            var filter = ['a', 'b']

            var filtered = helper.filterObj(obj, filter)
            filtered.should.be.an("object")
            assert.isUndefined(filtered.c)
            filtered.a.should.be.ok
            filtered.a.should.be.eql(1)
            filtered.b.should.be.ok
            filtered.b.should.be.eql(1)
        })
    })

    describe("#weakPwd()", () => {
        it("should return error if password length is not greater than minLen", () => {
            var pwd = "asdf"
            var config = {
                minLen: 10
            }
            helper.weakPwd(pwd, config).should.be.eql("Please choose a password length of atleast " + config.minLen + " characters")
        })
        it("should return error if password length is greater than maxLen", () => {
            var pwd = "asdfasdf"
            var config = {
                maxLen: 5
            }
            helper.weakPwd(pwd, config).should.be.eql("Please choose a password length of atmost " + config.maxLen + " characters")
        })
        it("should return error if password does not include [A-Z]", () => {
            var pwd = "asdf"
            var config = {
                upperCase: true
            }
            helper.weakPwd(pwd, config).should.be.eql("Password must include atleast one upper case letter")
        })
        it("should return error if password does not include [a-z]", () => {
            var pwd = "ASDF"
            var config = {
                lowerCase: true
            }
            helper.weakPwd(pwd, config).should.be.eql("Password must include atleast one lower case letter")
        })
        it("should return error if password does not include [0-9]", () => {
            var pwd = "asdf"
            var config = {
                numbers: true
            }
            helper.weakPwd(pwd, config).should.be.eql("Password must include ateast one Number")
        })
        it("should return error if password does not include atleast one special character", () => {
            var pwd = "asdf"
            var config = {
                specialChars: ['@', '?']
            }
            helper.weakPwd(pwd, config).should.be.eql("Password must include atleast one special charater from (" + config.specialChars.join(", ") + ")")
        })
    })


    describe("#prefixToQueryObject()", () => {
        it("should add the specified prefix to each key in the object", () => {
            var obj = {
                a: 1,
                b: 1
            },
                prefix = "test"

            var converted = helper.prefixToQueryObject(prefix, obj)
            converted[prefix + "a"].should.be.ok
            converted[prefix + "a"].should.be.eql(1)
            assert.isUndefined(converted.a)
            converted[prefix + "b"].should.be.ok
            converted[prefix + "b"].should.be.eql(1)
            assert.isUndefined(converted.b)
        })
    })

    describe("#isUndefined()", () => {
        it("should return true if data is undefined", () => {
            var data = undefined;

            helper.isUndefined(data).should.be.ok
        })
        it("should return true if data is null", () => {
            var data = null;

            helper.isUndefined(data).should.be.ok
        })
        it("should return false if data is false", () => {
            var data = false;

            helper.isUndefined(data).should.not.be.ok;
        })
    })


    describe('#validateFieldNamesExistence', () => {
        it('should return true when object contains all the fields in the array', () => {
            assert.isTrue(helper.validateFieldNamesExistence({
                a: 1,
                b: 2,
                c: 3
            }, ['a', 'b'], false));
        });
        it('should return false when object doesnt contain all the fields in the array', () => {
            assert.isFalse(helper.validateFieldNamesExistence({
                a: 1
            }, ['a', 'b'], false));
        });
    });

    describe('#validateFieldNamesExistence() in strict mode', () => {
        it('should return true if Object contains only the properties specified in the array', () => {
            assert.isTrue(helper.validateFieldNamesExistence({
                a: 1,
                b: 2
            }, ['a', 'b'], true));
        });
        it('should return false if Object containes lesser properties than specified in the array', () => {
            assert.isFalse(helper.validateFieldNamesExistence({
                a: 1
            }, ['a', 'b'], true))
        });
        it('should return false if Object containes more properties than specified in the array', () => {
            assert.isFalse(helper.validateFieldNamesExistence({
                a: 1,
                b: 2
            }, ['a'], true))
        });
    });

    describe("#validateFieldsCb()", () => {
        it("should validate length of given field if its less than object keys in strict mode", (done) => {
            var obj = {
                a: 1,
                b: 2
            }
            var validations = [{
                name: 'a',
                type: 'number'
            }, {
                name: 'b',
                type: 'number'
            }, {
                name: 'c',
                type: 'number'
            }]
            helper.validateFieldsCb(obj, validations, true, (err) => {
                err.should.be.ok
                err.should.be.eql("Missing Fields")
                done()
            })
        })
        it("should strip extra fields on object in strict mode", (done) => {
            var obj = {
                a: 1,
                b: 2,
                c: 3
            }
            var validations = [{
                name: 'a',
                type: 'number'
            }, {
                name: 'b',
                type: 'number'
            }]
            helper.validateFieldsCb(obj, validations, true, (err) => {
                assert.isNull(err)
                assert.sameMembers(['a', 'b'], Object.keys(obj), 'same Members')
                done()
            })
        })
        it("should check the type for each field", (done) => {
            var obj = { a: 1, b: 2, c: "Hi" }
            var validations = [{
                name: "a",
                type: 'number'
            }, {
                name: 'b',
                type: 'number'
            }, {
                name: 'c',
                type: 'number',
                errMsg: "Invalid Type for C"
            }]
            helper.validateFieldsCb(obj, validations, true, (err) => {
                err.should.be.ok
                err.should.be.eql("Invalid Type for C")
                done()
            })
        })
        it("should check if multiple types are specified", (done) => {
            var obj = { a: 1, b: 2, c: "Hi" }
            var validations = [{
                name: "a",
                type: 'number'
            }, {
                name: 'b',
                type: 'number'
            }, {
                name: 'c',
                type: ['number', "string"],
                errMsg: "Invalid Type for C"
            }]
            helper.validateFieldsCb(obj, validations, true, (err) => {
                should.not.exist(err)
                done()
            })
        })
        it("should apply validate function", (done) => {
            function validateFn(d) {
                return d > 10
            }

            var obj = { a: 1, b: 2, c: "Hi" }
            var validations = [{
                name: "a",
                type: 'number',
                validate: validateFn,
                validateErrMsg: "A should be greater than 10"
            }, {
                name: 'b',
                type: 'number'
            }, {
                name: 'c',
                type: ['number', "string"],
            }]
            helper.validateFieldsCb(obj, validations, true, (err) => {
                should.exist(err)
                err.should.be.eql("A should be greater than 10")
                done()
            })
        })
        it("should apply mulitple validate functions", (done) => {
            function validateFn1(d) {
                return d > 10
            }

            function validateFn2(d) {
                return d < 30
            }


            var obj = { a: 100, b: 2, c: "Hi" }
            var validations = [{
                name: "a",
                type: 'number',
                validate: [validateFn1, validateFn2],
                validateErrMsg: ["A should be greater than 10", "A should be less than 30"]
            }, {
                name: 'b',
                type: 'number'
            }, {
                name: 'c',
                type: ['number', "string"],
            }]
            helper.validateFieldsCb(obj, validations, true, (err) => {
                err.should.be.ok
                err.should.be.eql("A should be less than 30")
                done()
            })
        })
        it("should apply transform function", (done) => {
            function transformFn(d) {
                return d * 10
            }


            var obj = { a: 100, b: 2, c: "Hi" }
            var validations = [{
                name: "a",
                type: 'number',
                // validate: [validateFn1, validateFn2],
                // validateErrMsg: ["A should be greater than 10", "A should be less than 30"]
            }, {
                name: 'b',
                type: 'number',
                transform: transformFn
            }, {
                name: 'c',
                type: ['number', "string"],
            }]
            helper.validateFieldsCb(obj, validations, true, (err) => {
                obj.b.should.be.eql(20)
                done()
            })
        })
        it("should apply async validate function", function (done) {
            this.timeout(2000)

            function validateFn(d, cb) {
                setTimeout(function () {
                    cb(null, d > 10)
                }, 50)
            }

            var obj = { a: 1, b: 2, c: "Hi" }
            var validations = [{
                name: "a",
                type: 'number',
                validate: validateFn,
                validateErrMsg: "A should be greater than 10"
            }, {
                name: 'b',
                type: 'number'
            }, {
                name: 'c',
                type: ['number', "string"],
            }]
            helper.validateFieldsCb(obj, validations, true, (err) => {
                err.should.be.ok
                err.should.be.eql("A should be greater than 10")
                done()
            })
        })
        it("should apply mulitple async validate functions", function (done) {
            this.timeout(3000)

            function validateFn1(d, cb) {
                setTimeout(function () {
                    cb(null, d > 10)
                }, 50)
            }

            function validateFn2(d, cb) {
                setTimeout(function () {
                    cb(null, d < 30)
                }, 50)
            }


            var obj = { a: 100, b: 2, c: "Hi" }
            var validations = [{
                name: "a",
                type: 'number',
                validate: [validateFn1, validateFn2],
                validateErrMsg: ["A should be greater than 10", "A should be less than 30"]
            }, {
                name: 'b',
                type: 'number'
            }, {
                name: 'c',
                type: ['number', "string"],
            }]
            helper.validateFieldsCb(obj, validations, true, (err) => {
                err.should.be.ok
                err.should.be.eql("A should be less than 30")
                done()
            })
        })
        it("should apply async transform function", function (done) {
            this.timeout(2000)
            function transformFn(d, cb) {
                setTimeout(function () {
                    cb(null, d * 10)

                }, 50)
            }
            var obj = { a: 100, b: 2, c: "Hi" }
            var validations = [{
                name: "a",
                type: 'number',
            }, {
                name: 'b',
                type: 'number',
                transform: transformFn
            }, {
                name: 'c',
                type: ['number', "string"],
            }]
            helper.validateFieldsCb(obj, validations, true, (err) => {
                obj.b.should.be.eql(20)
                done()
            })
        })
        it("should return the given error message", (done) => {
            var obj = { a: "1", b: 2, c: "Hi" }
            var validations = [{
                name: "a",
                type: 'number',
                errMsg: "A should only be a number"
            }, {
                name: 'b',
                type: 'number'
            }, {
                name: 'c',
                type: ['number', "string"],
            }]
            helper.validateFieldsCb(obj, validations, true, (err) => {
                err.should.be.ok
                err.should.be.eql("A should only be a number")
                done()
            })
        })
        it("should return general error message if validation fails and no validateErrMsg is specified", (done) => {
            function validateFn(d) {
                return d > 10
            }
            var obj = { a: 1, b: 2, c: "Hi" }
            var validations = [{
                name: "a",
                type: 'number',
                validate: validateFn,
                errMsg: "A should only be a number"
            }, {
                name: 'b',
                type: 'number'
            }, {
                name: 'c',
                type: ['number', "string"],
            }]
            helper.validateFieldsCb(obj, validations, true, (err) => {
                err.should.be.ok
                err.should.be.eql("A should only be a number")
                done()
            })
        })
        it("should apply different validateArgs for Each validation", (done) => {
            function validateFn1(a, b) {
                return a > b
            }

            function validateFn2(a, b) {
                return a > b
            }

            var obj = {
                a: 10
            }
            var validations = [{
                name: 'a',
                type: 'number',
                validate: [validateFn1, validateFn2],
                validateErrMsg: ["A should be greater than 2", 'A should be greater 30'],
                validateArgs: [2, [30]]
            }]
            helper.validateFieldsCb(obj, validations, true, (err) => {
                err.should.be.ok
                err.should.be.eql("A should be greater 30")
                done()
            })
        })
        it("should not return error if field is not required and is not present", (done) => {
            let obj = {
                a: 1,
                b: 1
            }

            let validations = [
                {
                    name: "a",
                    type: 'number'
                }, {
                    name: 'b',
                    type: 'number'
                }, {
                    name: 'c',
                    type: 'number',
                    required: false
                }
            ]

            helper.validateFieldsCb(obj, validations, false, (err) => {
                should.not.exist(err)
                done()
            })
        })
        it("should validate arrays", done => {
            var obj = {
                a: [1, 2],
                b: "not array",
                c: [1]
            }
            var validations = [
                {
                    name: 'a',
                    type: 'array',
                    errMsg: "A should be an array"
                }
            ]
            var errValidations = [
                {
                    name: 'b',
                    type: 'array',
                    errMsg: "B should be an array"
                }
            ]
            var typeArrayValidations = [
                {
                    name: 'c',
                    type: ['number', 'array'],
                    errMsg: "C Should be an array or number"
                }
            ]

            helper.validateFieldsCb(obj, validations, false, (err) => {
                should.not.exist(err);

                helper.validateFieldsCb(obj, errValidations, false, (err) => {
                    err.should.be.eql("B should be an array")

                    helper.validateFieldsCb(obj, typeArrayValidations, false, (err) => {
                        should.not.exist(err);
                        done();
                    })
                })
            })
        })
        it("should apply pre-transform function before applying validation functions", done => {
            function toInt(data, multiplier) {
                return parseInt(data) * multiplier;
            }

            function validate(data) {
                return data == 6;
            }

            var obj = {
                a: "3a"
            }

            var validations = [
                {
                    name: 'a',
                    type: ['number', 'string'],
                    preTransform: toInt,
                    preTransformArgs: [2],
                    validate: validate,
                    validateErrMsg: "A is not eql to 6",
                    errMsg: "Invalid A"
                }
            ]

            helper.validateFieldsCb(obj, validations, true, err => {
                should.not.exist(err);
                done();
            })
        })
        it("should apply async-pre-transform function")
    })

    describe('#validateFields()', function () {
        it("should validate length of fields against object keys in strict mode", () => {
            var obj = {
                a: 1,
                // b: "1",
                // c: 123
            }
            var validations = [{
                name: "a",
            }, {
                name: 'b'
            }]

            helper.validateFields(obj, validations, true).should.not.be.ok;
        })
        it("should validate field type", () => {
            var obj = {
                a: 1,
                b: "1",
                c: 123
            }
            var validations = [{
                name: "a",
                type: "number"
            }, {
                name: 'b',
                type: "string"
            }, {
                name: "c",
                type: "number"
            }]

            helper.validateFields(obj, validations, true).should.be.ok;
        })
        it("should valide for multiple field types", () => {
            var obj = {
                a: 1,
                b: "1",
                c: 123
            }
            var validations = [{
                name: "a",
                type: "number"
            }, {
                name: 'b',
                type: ["number", "string"]
            }, {
                name: "c",
                type: "number"
            }]

            helper.validateFields(obj, validations, true).should.be.ok;
        })
        it("should not strip extra fields in normal mode", () => {
            var obj = {
                a: 1,
                b: "1",
                c: 123
            }
            var validations = [{
                name: "a",
                type: "number"
            }, {
                name: 'b',
                type: ["number", "string"]
            }]

            helper.validateFields(obj, validations, false)
            assert.sameMembers(Object.keys(obj), ['a', 'b', 'c'], 'Does not have the same keys')
        })
        it("should strip extra fields on object against validations in strict mode", () => {
            var obj = {
                a: 1,
                b: "1",
                c: 123
            }
            var validations = [{
                name: "a",
                type: "number"
            }, {
                name: 'b',
                type: ["number", "string"]
            }]

            helper.validateFields(obj, validations, true)
            assert.sameMembers(Object.keys(obj), ['a', 'b'], 'Does not have the same keys')
        })
        it("should apply validation fn", () => {
            function validateFn1(d) {
                return d > 10
            }
            var obj = {
                a: 1,
                b: "1",
                c: 123
            }
            var validations = [{
                name: "a",
                type: "number",
                validate: validateFn1,
            }, {
                name: 'b',
                type: ["number", "string"]
            }, {
                name: "c",
                type: "number"
            }]

            helper.validateFields(obj, validations, true).should.not.be.ok;
        })
        it("should apply validation args for validation fn", () => {
            function validateFn1(a, b) {
                // console.log(arguments);
                return a > b
            }
            var obj = {
                a: 1,
                b: "1",
                c: 123
            }
            var validations = [{
                name: "a",
                type: "number",
                validate: validateFn1,
                validateArgs: [
                    [0]
                ]
            }, {
                name: 'b',
                type: ["number", "string"]
            }, {
                name: "c",
                type: "number"
            }]

            helper.validateFields(obj, validations, true).should.be.ok;
        })
        it("should apply transform fn", () => {
            function transformFn1(a) {
                return a * 10
            }
            var obj = {
                a: 1,
                b: "1",
                c: 123
            }
            var validations = [{
                name: "a",
                type: "number",
                transform: transformFn1
            }, {
                name: 'b',
                type: ["number", "string"]
            }, {
                name: "c",
                type: "number"
            }]

            helper.validateFields(obj, validations, true).should.be.ok;
            obj.a.should.be.eql(10)
        })
        it("should apply transform args for transform fn", () => {
            function transformFn1(a, b) {
                return a * b
            }
            var obj = {
                a: 1,
                b: "1",
                c: 123
            }
            var validations = [{
                name: "a",
                type: "number",
                transform: transformFn1,
                transformArgs: 2
            }, {
                name: 'b',
                type: ["number", "string"]
            }, {
                name: "c",
                type: "number"
            }]

            helper.validateFields(obj, validations, true).should.be.ok;
            obj.a.should.be.eql(2)
        })
        it("should apply validations and transformation", () => {
            function validateFn1(a, b) {
                return a > b
            }

            function transformFn1(a, b) {
                return a * b
            }
            var obj = {
                a: 5,
                b: "1",
                c: 123
            }
            var validations = [{
                name: "a",
                type: "number",
                validate: validateFn1,
                validateArgs: 1,
                transform: transformFn1,
                transformArgs: 5
            }, {
                name: 'b',
                type: ["number", "string"]
            }, {
                name: "c",
                type: "number"
            }]

            helper.validateFields(obj, validations, true).should.be.ok;
            obj.a.should.be.eql(25)
        })
        it("should apply validations args for corresponding validation fn (multiple validation functions)", () => {
            function validateFn1(a, b) {
                // console.log("args1:", arguments);
                return a > b
            }

            function validateFn2(a, b) {
                // console.log("args2:", arguments);
                return a < b
            }
            var obj = {
                a: 5,
                b: "1",
                c: 123
            }
            var validations = [{
                name: "a",
                type: "number",
                validate: [validateFn1, validateFn2],
                validateArgs: [1, 10],
            }, {
                name: 'b',
                type: ["number", "string"]
            }, {
                name: "c",
                type: "number"
            }]

            helper.validateFields(obj, validations, true).should.be.ok;
        })
        it("should validate array types", () => {
            var obj = {
                a: [1, 2],
                b: 1
            }

            var validations = [
                {
                    name: 'a',
                    type: 'array',
                }, {
                    name: 'b',
                    type: ['array', 'number'],
                }
            ]

            helper.validateFields(obj, validations, true).should.be.ok;
        })
        it("should apply pre-transform before validation functions", () => {
            function toInt(data, multiplier) {
                return parseInt(data) * multiplier;
            }

            function eqlTo6(data) {
                return data == 6;
            }

            var obj = {
                a: '3'
            }

            var validation = [
                {
                    name: 'a',
                    type: ['number', 'string'],
                    preTransform: toInt,
                    preTransformArgs: 2,
                    validate: eqlTo6,
                    validateErrMsg: "A not eql to 6",
                    errMsg: 'Invalid A'
                }
            ]

            helper.validateFields(obj, validation, true).should.be.ok;
        })

        it("should not return false if the field is not required", () => {
            var obj = {
                a: 1
            }

            var validations = [{
                name: 'a',
                type: 'number'
            }, {
                name: 'b',
                type: 'string',
                required: false
            }]

            helper.validateFields(obj, validations, false).should.be.ok;
        })

    })

    describe('#saltHash', function () {
        it('should return an encrypted password that cannot be partialised as secret and password', function () {
            var pwd = 'secret';
            var encrypted = helper.saltHash(pwd)
            assert.isTrue(pwd != encrypted, 'password is not encrypted');
            assert.isTrue(helper.verifySaltHash(encrypted, pwd), 'password could not be retrieved');
        })

    })

});