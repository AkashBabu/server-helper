var helper = require('../lib/helper');
var helperDb = require('../lib/helperMongo');
var crud = require('../lib/crud');

var assert = require('chai').assert;

describe('server-helper', () => {
    describe('helper', () => {
        // describe('#appendCtime', () => {
        //     it('should add a property ctime with the current Date object', () => {
        //         var obj = {};
        //         helper.appendCtime(obj);
        //         assert.property(obj, 'ctime');
        //     });
        //     it('should throw an error when no parameter is passed', () => {
        //         assert.throws(function() {
        //             helper.appendCtime()
        //         }, 'wrong input');
        //     })
        //     it('should throw an error when the input is not Obejct', () => {
        //         assert.throws(function() {
        //             helper.appendCtime([]);
        //         }, 'wrong input');
        //     })
        // });

        // describe('#appendUtime', () => {
        //     it('should add a property utime with the current Date object', () => {
        //         var obj = {};
        //         helper.appendUtime(obj);
        //         assert.property(obj, 'utime');
        //     });
        //     it('should throw an error when no parameter is passed', () => {
        //         assert.throws(function() {
        //             helper.appendUtime()
        //         }, 'wrong input');
        //     })
        //     it('should throw an error when the input is not Obejct', () => {
        //         assert.throws(function() {
        //             helper.appendUtime([]);
        //         }, 'wrong input');
        //     })
        // });

        // describe('#updateUtime', () => {
        //     it('should update a property utime with the current Date object', () => {
        //         var obj = {
        //             utime: 123
        //         };
        //         helper.updateUtime(obj);
        //         assert.equal(obj.utime.constructor, Date);
        //     });
        //     it('should throw an error if the passed object doent contain property "utime"', () => {
        //         var obj = {};
        //         assert.throws(function() {
        //             helper.updateUtime(obj);
        //         }, 'wrong input');
        //     })
        //     it('should throw an error when no parameter is passed', () => {
        //         assert.throws(function() {
        //             helper.updateUtime()
        //         }, 'wrong input');
        //     })
        //     it('should throw an error when the input is not Obejct', () => {
        //         assert.throws(function() {
        //             helper.appendUtime([]);
        //         }, 'wrong input');
        //     })
        // });

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

        describe('#validateFieldNamesExistenceStrict', () => {
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

        describe.only('#validateFieldsExistence', function(){
            it('should validate length of given fields in strict mode', function(){
                var obj = {
                    name: 'akash',
                    age: 21
                }

                assert.isTrue(helper.validateFieldsExistence(obj, [{name: 'name', type: String}, {name: 'age', type: Number}], true), 'Does not match the length of given fields in strict mode');
            })

            it('should validate type of each field', function(){
                var obj = {
                    name: 'akash',
                    age: 21,
                    gender: 'male'
                }

                assert.isTrue(helper.validateFieldsExistence(obj, [{name: 'name', type: String}, {name: 'age', type: Number}], false), 'Does not validate the field type');
            })

            it('should return false on invalid field names', function(){
                var obj = {
                    name: 'akash',
                    age: 21
                }

                assert.isFalse(helper.validateFieldsExistence(obj, [{name: 'names', type: String}, {name: 'age', type: Number}], true), 'Does not return false on invalid field names');
            })

            it('should return false for more number of field specs', function(){
                var obj = {
                    name: 'akash',
                    age: 21
                }

                assert.isFalse(helper.validateFieldsExistence(obj, [{name: 'names', type: String}, {name: 'age', type: Number}, {name: 'gender', type: String}], true), 'Does not return false on invalid field names');
            })

            it('should return true when specs are exactly matching the object in strict mode', function(){
                 var obj = {
                    name: 'akash',
                    age: 21,
                    address: {
                        no: 21,
                        place: 'bangalore',
                        state: 'karnataka',
                        country: 'India'
                    },
                    hobbies: [1,2,3,4]
                }

                assert.isTrue(helper.validateFieldsExistence(obj, [{name: 'name', type: String}, {name: 'age', type: Number}, {name: 'address', type: Object}, {name: 'hobbies', type: Array}], true), 'Does not validate the field name and their type');
            })
             it('should apply formatting and transform functions', function(){
                 var obj = {
                    name: 'akash',
                    age: 26,
                    address: {
                        no: 21,
                        place: 'bangalore',
                        state: 'karnataka',
                        country: 'India'
                    },
                    hobbies: [1,2,3,4]
                }

                function minAge(age){
                    return age < 25;
                }

                function sum (data){
                    return data.reduce((sum, next) => {
                        return sum += next;
                    })
                }    
                assert.isTrue(helper.validateFieldsExistence(obj, [{name: 'name', type: String}, {name: 'age', type: Number, validate: minAge}, {name: 'address', type: Object}, {name: 'hobbies', type: Array, transform: sum}], true), 'Does not validate the field name and their type');
                console.log('obj:', obj);
            })
        })

        describe.skip('#saltHash', function(){
            it('should return an encrypted password that cannot be partialised as secret and password', function(){
                var pwd = 'secret';
                var encrypted = helper.saltHash(pwd)
                assert.isTrue(pwd != encrypted, 'password is not encrypted');
                assert.isTrue(helper.verifySaltHash(encrypted, pwd), 'password could not be retrieved');
            })

        })

    });


    describe('helperDb', () => {

    });


    describe('crud', () => {

    });
});
