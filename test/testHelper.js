var helper = require('./lib/helper');
var helperDb = require('./lib/helperDb');
var crud = require('./lib/crud');

var assert = require('chai').assert;

describe('server-helper', () => {
    describe.only('helper', () => {
        describe('#appendCtime', () => {
            it('should add a property ctime with the current Date object', () => {
                var obj = {};
                helper.appendCtime(obj);
                assert.property(obj, 'ctime');
            });
            it('should throw an error when no parameter is passed', () => {
                assert.throws(function() {
                    helper.appendCtime()
                }, 'wrong input');
            })
            it('should throw an error when the input is not Obejct', () => {
                assert.throws(function() {
                    helper.appendCtime([]);
                }, 'wrong input');
            })
        });

        describe('#appendUtime', () => {
            it('should add a property utime with the current Date object', () => {
                var obj = {};
                helper.appendUtime(obj);
                assert.property(obj, 'utime');
            });
            it('should throw an error when no parameter is passed', () => {
                assert.throws(function() {
                    helper.appendUtime()
                }, 'wrong input');
            })
            it('should throw an error when the input is not Obejct', () => {
                assert.throws(function() {
                    helper.appendUtime([]);
                }, 'wrong input');
            })
        });

        describe('#updateUtime', () => {
            it('should update a property utime with the current Date object', () => {
                var obj = {
                    utime: 123
                };
                helper.updateUtime(obj);
                assert.equal(obj.utime.constructor, Date);
            });
            it('should throw an error if the passed object doent contain property "utime"', () => {
                var obj = {};
                assert.throws(function() {
                    helper.updateUtime(obj);
                }, 'wrong input');
            })
            it('should throw an error when no parameter is passed', () => {
                assert.throws(function() {
                    helper.updateUtime()
                }, 'wrong input');
            })
            it('should throw an error when the input is not Obejct', () => {
                assert.throws(function() {
                    helper.appendUtime([]);
                }, 'wrong input');
            })
        });

        describe('#validateFieldsExistence', () => {
            it('should return true when object contains all the fields in the array', () => {
                assert.isTrue(helper.validateFieldsExistence({
                    a: 1,
                    b: 2,
                    c: 3
                }, ['a', 'b']));
            });
            it('should return false when object doesnt contain all the fields in the array', () => {
                assert.isFalse(helper.validateFieldsExistence({
                    a: 1
                }, ['a', 'b']));
            });
            it('should throw an error if the first argument is not an object', () => {
                assert.throws(function() {
                    helper.validateFieldsExistence([], []);
                }, 'wrong inputs');
            });
            it('should throw an error if the second argument is not an Array', () => {
                assert.throws(function() {
                    helper.validateFieldsExistence([], {});
                }, 'wrong inputs');
            });
            it('should throw an error if two arguments are not passed', () => {
                assert.throws(function() {
                    helper.validateFieldsExistence({});
                }, 'wrong inputs');
            });
        });

        describe('#validateFieldsExistenceStrict', () => {
            it('should return true if Object contains only the properties specified in the array', () => {
                assert.isTrue(helper.validateFieldsExistenceStrict({
                    a: 1,
                    b: 2
                }, ['a', 'b']));
            });
            it('should return false if Object containes lesser properties than specified in the array', () => {
                assert.isFalse(helper.validateFieldsExistenceStrict({
                    a: 1
                }, ['a', 'b']))
            });
            it('should return false if Object containes more properties than specified in the array', () => {
                assert.isFalse(helper.validateFieldsExistenceStrict({
                    a: 1,
                    b: 2
                }, ['a']))
            });
            it('should throw an error if the first argument is not an object', () => {
                assert.throws(function() {
                    helper.validateFieldsExistence([], []);
                }, 'wrong inputs');
            });
            it('should throw an error if the second argument is not an Array', () => {
                assert.throws(function() {
                    helper.validateFieldsExistence([], {});
                }, 'wrong inputs');
            });
            it('should throw an error if two arguments are not passed', () => {
                assert.throws(function() {
                    helper.validateFieldsExistence({});
                }, 'wrong inputs');
            });
        })

    });


    describe('helperDb', () => {

    });


    describe('crud', () => {

    });
});
