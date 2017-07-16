/// <reference path="../../typings/index.d.ts" />

var { HelperMongo } = require("../../dist/index")
var connStr = "sh_test"
var helperMongo = new HelperMongo(connStr, true);
var mongojs = require('mongojs')
var db = mongojs(connStr)
var moment = require("moment")

var should = require("chai").should()

var userColl = "users"
var diffHour = -5.5

describe("HelperMongo", () => {

    beforeEach((done) => {
        db.collection(userColl).remove({}, done)
    })

    after(function (done) {
        this.timeout(5000);
        db.dropDatabase(done)
    })

    describe.skip("#getDateFormat()", () => {

        beforeEach(done => {
            db.collection(userColl).remove({}, done)
        })

        it("should return Year format", (done) => {
            var date = new Date()
            var user = {
                name: 'Akash',
                cTime: date
            }

            db.collection(userColl).insert(user, function (err, result) {
                if (result) {
                    db.collection(userColl).aggregate([{
                        $project: {
                            year: {
                                $dateToString: {
                                    format: helperMongo.getDateFormat("year"),
                                    date: "$cTime"
                                }
                            }
                        }
                    }], function (err, result) {
                        result.should.be.an("array")
                        result.length.should.be.eql(1)
                        result[0].year.should.be.eql(moment(date).add(diffHour, 'hour').format("YYYY"))
                        done()
                    })
                } else {
                    console.log("Failed to Insert User in should return Year format");
                    done("Failed to insert User in should return Year format")
                }
            })
        })
        it("should return Month format", (done) => {
            var date = new Date()
            var user = {
                name: 'Akash',
                cTime: date
            }

            db.collection(userColl).insert(user, function (err, result) {
                if (result) {
                    db.collection(userColl).aggregate([{
                        $project: {
                            year: {
                                $dateToString: {
                                    format: helperMongo.getDateFormat("month"),
                                    date: "$cTime"
                                }
                            }
                        }
                    }], function (err, result) {
                        result.should.be.an("array")
                        result.length.should.be.eql(1)
                        result[0].year.should.be.eql(moment(date).add(diffHour, 'hour').format("YYYY-MM"))
                        done()
                    })
                } else {
                    console.log("Failed to Insert User in should return Month format");
                    done("Failed to insert User in should return Month format")
                }
            })
        })
        it("should return Day format", (done) => {
            var date = new Date();
            var user = {
                name: 'Akash',
                cTime: date
            }

            db.collection(userColl).insert(user, function (err, result) {
                if (result) {
                    db.collection(userColl).aggregate([{
                        $project: {
                            year: {
                                $dateToString: {
                                    format: helperMongo.getDateFormat("day"),
                                    date: "$cTime"
                                }
                            }
                        }
                    }], function (err, result) {
                        result.should.be.an("array")
                        result.length.should.be.eql(1)
                        result[0].year.should.be.eql(moment(date).add(diffHour, 'hour').format("YYYY-MM-DD"))
                        done()
                    })
                } else {
                    console.log("Failed to Insert User in should return Day format");
                    done("Failed to insert User in should return Day format")
                }
            })
        })
        it("should return Hour format", (done) => {
            var date = new Date();
            var user = {
                name: 'Akash',
                cTime: date
            }

            db.collection(userColl).insert(user, function (err, result) {
                if (result) {
                    db.collection(userColl).aggregate([{
                        $project: {
                            year: {
                                $dateToString: {
                                    format: helperMongo.getDateFormat("hour"),
                                    date: "$cTime"
                                }
                            }
                        }
                    }], function (err, result) {
                        result.should.be.an("array")
                        result.length.should.be.eql(1)
                        result[0].year.should.be.eql(moment(date).add(diffHour, 'hour').format("YYYY-MM-DDTHH"))
                        done()
                    })
                } else {
                    console.log("Failed to Insert User in should return Hour format");
                    done("Failed to insert User in should return Hour format")
                }
            })
        })
        it("should return Minute format", (done) => {
            var date = new Date();
            var user = {
                name: 'Akash',
                cTime: date
            }

            db.collection(userColl).insert(user, function (err, result) {
                if (result) {
                    db.collection(userColl).aggregate([{
                        $project: {
                            year: {
                                $dateToString: {
                                    format: helperMongo.getDateFormat("min"),
                                    date: "$cTime"
                                }
                            }
                        }
                    }], function (err, result) {
                        result.should.be.an("array")
                        result.length.should.be.eql(1)
                        result[0].year.should.be.eql(moment(date).add(diffHour, 'hour').format("YYYY-MM-DDTHH:mm"))
                        done()
                    })
                } else {
                    console.log("Failed to Insert User in should return Minute format");
                    done("Failed to insert User in should return Minute format")
                }
            })
        })
        it("should return Second format", (done) => {
            var date = new Date();
            var user = {
                name: 'Akash',
                cTime: date
            }

            db.collection(userColl).insert(user, function (err, result) {
                if (result) {
                    db.collection(userColl).aggregate([{
                        $project: {
                            year: {
                                $dateToString: {
                                    format: helperMongo.getDateFormat("sec"),
                                    date: "$cTime"
                                }
                            }
                        }
                    }], function (err, result) {
                        result.should.be.an("array")
                        result.length.should.be.eql(1)
                        result[0].year.should.be.eql(moment(date).add(diffHour, 'hour').format("YYYY-MM-DDTHH:mm:ss"))
                        done()
                    })
                } else {
                    console.log("Failed to Insert User in should return Second format");
                    done("Failed to insert User in should return Second format")
                }
            })
        })
        it("should return Millisecond format", (done) => {
            var date = new Date();
            var user = {
                name: 'Akash',
                cTime: date
            }

            db.collection(userColl).insert(user, function (err, result) {
                if (result) {
                    db.collection(userColl).aggregate([{
                        $project: {
                            year: {
                                $dateToString: {
                                    format: helperMongo.getDateFormat("milli"),
                                    date: "$cTime"
                                }
                            }
                        }
                    }], function (err, result) {
                        result.should.be.an("array")
                        result.length.should.be.eql(1)
                        result[0].year.should.be.eql(moment(date).add(diffHour, 'hour').format("YYYY-MM-DDTHH:mm:ss.SSS"))
                        done()
                    })
                } else {
                    console.log("Failed to Insert User in should return MilliSecond format");
                    done("Failed to insert User in should return MilliSecond format")
                }
            })
        })
        it("should return Day format by default", (done) => {
            var date = new Date();
            var user = {
                name: 'Akash',
                cTime: date
            }

            db.collection(userColl).insert(user, function (err, result) {
                if (result) {
                    db.collection(userColl).aggregate([{
                        $project: {
                            year: {
                                $dateToString: {
                                    format: helperMongo.getDateFormat("asdf"),
                                    date: "$cTime"
                                }
                            }
                        }
                    }], function (err, result) {
                        result.should.be.an("array")
                        result.length.should.be.eql(1)
                        result[0].year.should.be.eql(moment(date).add(diffHour, 'hour').format("YYYY-MM-DD"))
                        done()
                    })
                } else {
                    console.log("Failed to Insert User in should return day format by default");
                    done("Failed to insert User in should return day format by default")
                }
            })
        })
    })

    describe("#validateExistence()", () => {
        it("should return true if atleast one document was found for the given query", done => {
            var data = {
                name: "test"
            }
            db.collection("validateExistenceColl").insert(data, (err, result) => {
                if (result) {
                    helperMongo.validateExistence("validateExistenceColl", { name: "test" }, (err, result) => {

                        should.not.exist(err);
                        result.should.be.ok;

                        done()
                    })
                } else {
                    console.warn("Unable to insert data to test validateExistence")
                }
            })
        })
    })

    describe("#validateNonExistence()", () => {
        it("should return true  if there was no document found for the given query", (done) => {
            helperMongo.validateNonExistence('validateNonExistence1', { name: 'test' }, (err, result) => {
                should.not.exist(err)
                result.should.be.ok;

                done()
            })
        })
        it("should return 'Duplicate Document' if there was a document found for the given query and no Err Msg was specified", (done) => {
            var data = {
                name: 'test'
            }
            db.collection('validateNonExistence2').insert(data, (err, result) => {
                if (!err) {
                    helperMongo.validateNonExistence('validateNonExistence2', { name: 'test' }, (err1, result1) => {
                        should.exist(err1);
                        err1.should.be.eql("Duplicate Document")
                        should.not.exist(result1)
                        done()
                    })

                } else {
                    console.error('Failed to insert data in validateNonExistence');

                    done(err);
                }
            })
        })
        it("should return errMsg  if atleast one document was found for the given query and errMsg was given", (done) => {
            var data = {
                name: 'test'
            }
            db.collection('validateNonExistence').insert(data, (err, result) => {
                if (!err) {
                    helperMongo.validateNonExistence('validateNonExistence', {
                        query: { name: 'test' },
                        errMsg: "Duplicate Name"
                    }, (err1, result1) => {
                        should.exist(err1);
                        err1.should.be.eql("Duplicate Name")
                        should.not.exist(result1)
                        done()
                    })

                } else {
                    console.error('Failed to insert data in validateNonExistence');
                    done(err);
                }
            })
        })
        it("should iterate through all the validations", done => {
            var data1 = {
                name: 'test1',
                checking: 'validations',
                type: "multi"
            }
            var data2 = {
                name: 'test2',
                checking: 'validations',
                type: "multi"
            }

            db.collection('validateNonExistence').insert([data1, data2], (err, result) => {
                if (!err) {
                    let validations = [
                        {
                            query: {
                                name: 'test3'
                            },
                            errMsg: "Duplicate Name"
                        }, {
                            query: {
                                checking: 'validations',
                                type: 'multi'
                            },
                            errMsg: 'Duplicate Methods'
                        }
                    ]
                    helperMongo.validateNonExistence('validateNonExistence', validations, (err, result) => {
                        should.exist(err);
                        should.not.exist(result);
                        err.should.be.eql("Duplicate Methods")

                        done()
                    })
                } else {
                    console.error("Failed to insert into validateNonExistence")

                    done(err);
                }
            })
        })
    })

    describe("#validateNonExistenceOnUpdate()", () => {
        it("should validate _id for a valid mongo id", (done) => {
            helperMongo.validateNonExistenceOnUpdate('validateNonExistenceOnUpdate1', { _id: "asdf" }, {}, (err, result) => {
                should.exist(err);
                err.should.be.eql("Invalid Id");

                done()
            })
        })
        it("should return corresponding errMsg or 'Duplicate Document' if a document with the query is already present", (done) => {
            var data1 = {
                name: "test1",
                checking: 'validateNonExistenceOnUpdate'
            }
            var data2 = {
                name: "test2",
                checking: 'validateNonExistenceOnUpdate'
            }
            db.collection("validateNonExistenceOnUpdate2").insert([data1, data2], (err, result) => {
                // console.log(`result:`, result[0]);
                if (!err) {
                    var validations = [
                        {
                            name: "name"
                        }
                    ]
                    result[0].name = 'test2'
                    helperMongo.validateNonExistenceOnUpdate('validateNonExistenceOnUpdate2', result[0], validations, (err, result) => {
                        should.exist(err);
                        err.should.be.eql("Duplicate name");
                        result.should.be.eql(1)

                        done()
                    })

                } else {
                    console.error('Failed to insert into    validateNonExistenceOnUpdate2')
                    done(err);
                }
            })
        })
        it("should iterate over the validations only for the fields which have been changed wrt the ones present in DB", (done) => {
            var data1 = {
                name: "test1",
                checking: 'validateNonExistenceOnUpdate'
            }
            var data2 = {
                name: "test2",
                checking: 'validateNonExistenceOnUpdate'
            }
            db.collection("validateNonExistenceOnUpdate3").insert([data1, data2], (err, result) => {
                // console.log(`result:`, result[0]);
                if (!err) {
                    var validations = [
                        {
                            name: "name"
                        }, {
                            name: "checking"
                        }
                    ]
                    result[0].name = 'test3'
                    helperMongo.validateNonExistenceOnUpdate('validateNonExistenceOnUpdate3', result[0], validations, (err, result) => {
                        should.not.exist(err);
                        result.should.be.eql(1);

                        done()
                    })

                } else {
                    console.error('Failed to insert into    validateNonExistenceOnUpdate3')
                    done(err)
                }
            })
        })
        it("should use query if present else form a query based on the name field given", (done) => {
            var data = [{
                name: 'test1'
            }, {
                name: 'test2'
            }]
            db.collection('validateNonExistenceOnUpdate4').insert(data, (err, result) => {
                if (!err) {
                    result[0].name = 'test2'
                    var validations = [
                        {
                            name: "name",
                            query: {
                                name: 'test2'
                            },
                            errMsg: "Customised Error"
                        }
                    ]
                    helperMongo.validateNonExistenceOnUpdate('validateNonExistenceOnUpdate4', result[0], validations, (err, result) => {
                        should.exist(err);
                        err.should.be.eql("Customised Error");
                        result.should.be.eql(1);

                        done()
                    })
                } else {
                    console.log('Failed to insert into validateNonExistenceOnUpdate4');

                    done(err);
                }
            })
        })
    })

    describe("#getById()", () => {
        it("should return 'Invalid Id' if a invalid Mongo Id is passed", (done) => {
            helperMongo.getById("getById1", "asdf", (err, result) => {
                should.exist(err)
                err.should.be.eql("Invalid Id")

                done();
            })
        })
        it("should return the document if a document is present for the given _id", (done) => {
            var data = {
                name: 'test'
            }
            db.collection("getById2").insert(data, (err, result) => {
                if (!err) {
                    helperMongo.getById("getById2", result._id, (err, result1) => {
                        should.not.exist(err);
                        result1._id.should.be.eql(result._id);
                        result1.name.should.be.eql(result.name);

                        done();
                    })
                } else {
                    console.error('Failed to insert into getById2');
                    done(err);
                }
            })
        })
    })

    describe("#getMaxValue()", () => {
        it("should find the max value of a field in a collection", (done) => {
            var data = [{
                num: 1
            }, {
                num: 2
            }, {
                num: 10
            }]

            db.collection("getMaxValue1").insert(data, (err, result) => {
                if (!err) {
                    var maxQuery = {
                        query: {
                            num: { $exists: true }
                        },
                        key: 'num'
                    }
                    helperMongo.getMaxValue('getMaxValue1', maxQuery, (err, result) => {
                        should.not.exist(err);
                        result.should.be.eql(10);
                        done();
                    })
                } else {
                    console.error('Failed to insert into getMaxValue1');
                    done(err);
                }
            })
        })
        it("should find the max value within a document array", (done) => {
            var data = [{
                name: 'test1',
                arr: [
                    {
                        num: 1
                    }, {
                        num: 2
                    }, {
                        num: 10
                    }
                ]
            }]

            db.collection("getMaxValue2").insert(data, (err) => {
                if (!err) {
                    var maxQuery = {
                        query: {
                            name: 'test1'
                        },
                        unwind: '$arr',
                        key: 'arr.num'
                    }
                    helperMongo.getMaxValue("getMaxValue2", maxQuery, (err, result) => {
                        should.not.exist(err);
                        result.should.be.eql(10);

                        done()
                    })
                } else {
                    console.error('Failed to insert into getMaxValue2');
                    done(err)
                }
            })
        })
    })

    describe("#getNextSeqNo()", () => {
        it("should get Next sequence no for the given collection on the specified key", (done) => {
            var data = [
                {
                    num: 1
                }, {
                    num: 2
                }, {
                    num: 10
                },
            ]
            db.collection("getNextSeqNo1").insert(data, (err) => {
                if (!err) {
                    var nextSeqQuery = {
                        // query: {},
                        key: 'num'
                    }
                    helperMongo.getNextSeqNo('getNextSeqNo1', nextSeqQuery, (err, result) => {
                        should.not.exist(err);
                        result.should.be.eql(11);

                        done()
                    })
                } else {
                    console.error('Failed to insert into getNextSeqNo1');
                    done(err);
                }
            })
        })
        it("should get next sequence no within the given maxValue", (done) => {
            var data = [
                {
                    num: 1
                }, {
                    num: 2
                }, {
                    num: 10
                },
            ]
            db.collection("getNextSeqNo2").insert(data, (err) => {
                if (!err) {
                    var nextSeqQuery = {
                        // query: {},
                        key: 'num',
                        maxValue: 11
                    }
                    helperMongo.getNextSeqNo('getNextSeqNo2', nextSeqQuery, (err, result) => {
                        should.not.exist(err);
                        result.should.be.eql(11);

                        done()
                    })
                } else {
                    console.error('Failed to insert into getNextSeqNo2');
                    done(err);
                }
            })
        })
        it("should check for next sequence no from the minValue if the maxValue has been crossed", (done) => {
            var data = [
                {
                    num: 1
                }, {
                    num: 2
                }, {
                    num: 10
                },
            ]
            db.collection("getNextSeqNo3").insert(data, (err) => {
                if (!err) {
                    var nextSeqQuery = {
                        // query: {},
                        key: 'num',
                        maxValue: 10
                    }
                    helperMongo.getNextSeqNo('getNextSeqNo3', nextSeqQuery, (err, result) => {
                        should.not.exist(err);
                        result.should.be.eql(3);

                        done()
                    })
                } else {
                    console.error('Failed to insert into getNextSeqNo3');
                    done(err);
                }
            })
        })
        it("should return errMsg if there is no seq remaining within the maxValue", (done) => {
            var data = [
                {
                    num: 1
                }, {
                    num: 2
                }, {
                    num: 3
                },
            ]
            db.collection("getNextSeqNo4").insert(data, (err) => {
                if (!err) {
                    var nextSeqQuery = {
                        // query: {},
                        key: 'num',
                        maxValue: 3,
                        minValue: 1
                    }
                    helperMongo.getNextSeqNo('getNextSeqNo4', nextSeqQuery, (err, result) => {
                        should.exist(err);
                        err.should.be.eql("Could not Get Next Sequence Number")

                        done()
                    })
                } else {
                    console.error('Failed to insert into getNextSeqNo4');
                    done(err);
                }
            })
        })
        it("should return given errMsg if there is no seq remaining within the maxValue", (done) => {
            var data = [
                {
                    num: 1
                }, {
                    num: 2
                }, {
                    num: 3
                },
            ]
            db.collection("getNextSeqNo5").insert(data, (err) => {
                if (!err) {
                    var nextSeqQuery = {
                        // query: {},
                        key: 'num',
                        maxValue: 3,
                        minValue: 1,
                        errMsg: "No SeqNo Available"
                    }
                    helperMongo.getNextSeqNo('getNextSeqNo5', nextSeqQuery, (err, result) => {
                        should.exist(err);
                        err.should.be.eql("No SeqNo Available")

                        done()
                    })
                } else {
                    console.error('Failed to insert into getNextSeqNo5');
                    done(err);
                }
            })
        })
        it("should be able to create a next seq no within a doc array", (done) => {
            var data = [
                {
                    name: 'test',
                    arr: [
                        {
                            num: 1
                        }, {
                            num: 2
                        }, {
                            num: 3
                        }, {
                            num: 10
                        },
                    ]
                }
            ]
            db.collection("getNextSeqNo6").insert(data, (err, result) => {
                if (!err) {
                    var maxQuery = {
                        query: { name: 'test' },
                        unwind: 'arr',
                        key: 'arr.num',
                        maxValue: 10,
                        minValue: 1
                    }
                    helperMongo.getNextSeqNo('getNextSeqNo6', maxQuery, (err, result) => {
                        should.not.exist(err);
                        result.should.be.eql(4);

                        done();
                    })
                } else {
                    console.error('Failed to insert into getNextSeqNo6');
                    done(err);
                }
            })
        })
    })

    describe("#update()", () => {
        it("should validate the given _id in the document", (done) => {
            helperMongo.update("update1", { _id: 'asdf' }, (err, result) => {
                should.exist(err);
                err.should.be.eql("Invalid Id");

                done();
            })
        })
        it("should update all the specified field for the given document", (done) => {
            var data = {
                name: 'test'
            }
            db.collection("update2").insert(data, (err, result) => {
                if (!err) {
                    // console.log('result:', result);
                    result.name = 'test1'
                    helperMongo.update('update2', result, (err, result1) => {
                        // console.log('result1:', result1);
                        should.not.exist(err);
                        result1.should.be.an("object");
                        result1.n.should.be.eql(1);

                        db.collection("update2").findOne(result, (err, result2) => {
                            if (!err) {
                                should.exist(result2);
                                result2.should.be.an("object");
                                result2.name.should.be.eql("test1");

                                done();
                            } else {
                                console.error('Failed to get doc in update2');
                                done(err);
                            }
                        })
                    })
                } else {
                    console.error('Failed to insert into update2');
                    done(err);
                }
            })
        })
        it("should update the utime field on the updated document", (done) => {
            var data = {
                name: 'test'
            }
            db.collection('update3').insert(data, (err, result) => {
                if (!err) {
                    helperMongo.update('update3', result, (err, result1) => {
                        should.not.exist(err);
                        result1.should.be.an("object");
                        result1.n.should.be.eql(1);

                        db.collection("update3").findOne(result, (err, result2) => {
                            should.not.exist(err);
                            result2.should.be.an("object");
                            should.exist(result2.utime);

                            done()
                        })
                    })
                } else {
                    console.error('Failed to insert into update3');
                    done(err);
                }
            })
        })
        it("should not update the excluded fields", done => {
            var data = {
                name: 'test',
                field2: 'should Not Be Updated'
            }
            db.collection('update4').insert(data, (err, result) => {
                if (!err) {
                    result.field2 = "updated data";
                    result.name = "updated name";

                    helperMongo.update('update4', result, ["field2"], (err, result1) => {
                        should.not.exist(err);
                        result1.should.be.an("object");
                        result1.n.should.be.eql(1);

                        db.collection("update4").findOne({ _id: result._id }, (err, result2) => {
                            should.not.exist(err);
                            result2.should.be.an("object");
                            result2.field2.should.be.eql("should Not Be Updated")
                            result2.name.should.be.eql("updated name")

                            done()
                        })
                    })
                } else {
                    console.error('Failed to insert into update3');
                    done(err);
                }
            })
        })
    })

    describe("#getList()", () => {
        it("should fetch all the document in the collection if recordsPerPage is not specified", (done) => {
            var data = [
                {
                    name: 'test1'
                }, {
                    name: 'test2'
                }, {
                    name: 'test3'
                }
            ]
            db.collection('getList1').insert(data, (err, result) => {
                if (!err) {
                    helperMongo.getList("getList1", {}, (err, result1) => {
                        should.not.exist(err);
                        result1.should.be.an("object");
                        result1.count.should.be.eql(3);
                        result1.list.length.should.be.eql(3);

                        done();
                    })
                } else {
                    console.error('Failed to insert into getList1');
                    done(err);
                }
            })
        })
        it("should fetch documents for the given query", (done) => {
            var data = [
                {
                    name: 'test1',
                    show: true,
                }, {
                    name: 'test2',
                    show: true
                }, {
                    name: 'test3'
                }
            ]
            db.collection('getList2').insert(data, (err, result) => {
                if (!err) {
                    helperMongo.getList("getList2", {
                        query: {
                            show: true
                        }
                    }, (err, result1) => {
                        should.not.exist(err);
                        result1.should.be.an("object");
                        result1.count.should.be.eql(2);
                        result1.list.length.should.be.eql(2);

                        done();
                    })
                } else {
                    console.error('Failed to insert into getList2');
                    done(err);
                }
            })
        })
        it("should project only the specified fields", (done) => {
            var data = [
                {
                    name: 'test1'
                }, {
                    name: 'test2'
                }, {
                    name: 'test3'
                }
            ]
            db.collection('getList3').insert(data, (err, result) => {
                if (!err) {
                    helperMongo.getList("getList3", {
                        project: { name: 1, _id: 0 },
                    }, (err, result1) => {
                        should.not.exist(err);
                        result1.should.be.an("object");
                        result1.count.should.be.eql(3);
                        result1.list.length.should.be.eql(3);

                        done();
                    })
                } else {
                    console.error('Failed to insert into getList3');
                    done(err);
                }
            })
        })
        it("shoud sort the document", (done) => {
            var data = [
                {
                    name: 'test1'
                }, {
                    name: 'test2'
                }, {
                    name: 'test3'
                }
            ]
            db.collection('getList4').insert(data, (err, result) => {
                if (!err) {
                    helperMongo.getList("getList4", {
                        project: { name: 1, _id: 0 },
                        sort: { name: -1 }
                    }, (err, result1) => {
                        should.not.exist(err);
                        result1.should.be.an("object");
                        result1.count.should.be.eql(3);
                        result1.list.length.should.be.eql(3);
                        result1.list[0].name.should.be.eql("test3")
                        result1.list[1].name.should.be.eql("test2")
                        result1.list[2].name.should.be.eql("test1")

                        done();
                    })
                } else {
                    console.error('Failed to insert into getList4');
                    done(err);
                }
            })
        })
        it("should perform search query on searchField", (done) => {
            var data = [
                {
                    name: 'test1'
                }, {
                    name: 'test2'
                }, {
                    name: 'test3'
                }, {
                    name: 'asdf1'
                }
            ]
            db.collection('getList5').insert(data, (err, result) => {
                if (!err) {
                    helperMongo.getList("getList5", {
                        search: 'test',
                        searchField: 'name'
                    }, (err, result1) => {
                        should.not.exist(err);
                        result1.should.be.an("object");
                        result1.count.should.be.eql(3);
                        result1.list.length.should.be.eql(3);
                        var names = ['test1', 'test2', 'test3']
                        result1.list.forEach((res) => {
                            names.indexOf(res.name).should.not.eql(-1)
                        })

                        done();
                    })
                } else {
                    console.error('Failed to insert into getList1');
                    done(err);
                }
            })
        })
        it("should return the required pageNo documents", (done) => {
            var data = [
                {
                    name: 'test1'
                }, {
                    name: 'test2'
                }, {
                    name: 'test3'
                }
            ]
            db.collection('getList6').insert(data, (err, result) => {
                if (!err) {
                    helperMongo.getList("getList6", {
                        sort: { name: 1 },
                        pageNo: 2,
                        recordsPerPage: 2
                    }, (err, result1) => {
                        should.not.exist(err);
                        result1.should.be.an("object");
                        result1.count.should.be.eql(3);
                        result1.list.length.should.be.eql(1);
                        result1.list[0].name.should.be.eql("test3")

                        done();
                    })
                } else {
                    console.error('Failed to insert into getList6');
                    done(err);
                }
            })
        })
        it("should JSON.parse the query object if its a string", (done) => {
            var data = [
                {
                    name: 'test1'
                }, {
                    name: 'test2'
                }, {
                    name: 'test3'
                }
            ]
            db.collection('getList7').insert(data, (err, result) => {
                if (!err) {
                    helperMongo.getList("getList7", {
                        project: JSON.stringify({ name: 1, _id: 0 }),
                        sort: JSON.stringify({ name: -1 })
                    }, (err, result1) => {
                        should.not.exist(err);
                        result1.should.be.an("object");
                        result1.count.should.be.eql(3);
                        result1.list.length.should.be.eql(3);
                        result1.list[0].name.should.be.eql("test3")
                        result1.list[1].name.should.be.eql("test2")
                        result1.list[2].name.should.be.eql("test1")

                        done();
                    })
                } else {
                    console.error('Failed to insert into getList7');
                    done(err);
                }
            })
        })
        it("should sort the document even if the format is 'name'/'-name'", (done) => {
            var data = [
                {
                    name: 'test1'
                }, {
                    name: 'test2'
                }, {
                    name: 'test3'
                }
            ]
            db.collection('getList8').insert(data, (err, result) => {
                if (!err) {
                    helperMongo.getList("getList8", {
                        project: { name: 1, _id: 0 },
                        sort: '-name'
                    }, (err, result1) => {
                        should.not.exist(err);
                        result1.should.be.an("object");
                        result1.count.should.be.eql(3);
                        result1.list.length.should.be.eql(3);
                        result1.list[0].name.should.be.eql("test3")
                        result1.list[1].name.should.be.eql("test2")
                        result1.list[2].name.should.be.eql("test1")

                        done();
                    })
                } else {
                    console.error('Failed to insert into getList8');
                    done(err);
                }
            })
        })
    })

    describe("#remove()", () => {
        it("should validate the given id", (done) => {
            helperMongo.remove("remove1", "asdf", true, (err) => {
                should.exist(err);
                err.should.be.eql("Invalid Id")

                done();
            })
        })
        it("should remove the document matching the given id", (done) => {
            var data = {
                name: 'test'
            }
            db.collection('remove2').insert(data, (err, result) => {
                if (!err) {
                    helperMongo.remove("remove2", result._id, true, (err, result1) => {
                        should.not.exist(err);

                        db.collection('remove2').findOne({ _id: result._id }, (err, result2) => {
                            should.not.exist(err);
                            should.not.exist(result2);

                            done();
                        })
                    })
                } else {
                    console.error('Failed to insert into remove2');
                    done(err)
                }
            })
        })
        it("should set isDeleted on the document for the given id", (done) => {
            var data = {
                name: 'test'
            }
            db.collection('remove3').insert(data, (err, result) => {
                if (!err) {
                    helperMongo.remove("remove3", result._id, false, (err, result1) => {
                        should.not.exist(err);

                        db.collection('remove3').findOne({ _id: result._id }, (err, result2) => {
                            should.not.exist(err);
                            result2.should.be.an("object");
                            result2.isDeleted.should.be.ok;
                            should.exist(result2.deltime)

                            done();
                        })
                    })
                } else {
                    console.error('Failed to insert into remove3');
                    done(err)
                }
            })
        })
    })

    describe.skip("#splitTimeThenGrp()", () => {
        it("should split the given time into required slot and pick one point from each", done => {
            var data = []
            var currTs = moment()
            var count = 1000;
            var interval = 10;
            for (var i = 0; i < count; i++) {
                data.push({
                    ts: moment().add(i * interval, "seconds")._d,
                    x: i
                })
            }
            var totalSeconds = count * interval
            db.collection("splitTimeThenGroup1").insert(data, (err, result) => {
                if (!err) {
                    var option = {
                        key: {
                            name: "ts",
                            min: moment()._d,
                            max: moment().add(totalSeconds, "seconds")._d,
                            // type: 'unix'
                        },
                        project: ['x'],
                        groupBy: 'hour',
                        groupLogic: '$first'
                    }
                    // console.log(option);
                    var expectedCount = Math.ceil(totalSeconds / 60 / 60);

                    helperMongo.splitTimeThenGrp("splitTimeThenGroup1", option, (err, result1) => {
                        // console.log(err, result1);
                        result1.should.be.an("array");
                        result1.length.should.be.eql(expectedCount);

                        done();
                    })
                } else {
                    console.error("Failed to insert into splitTimeThenGroup1", err)
                }
            })
        })
    })

    describe.skip("#selectNinM()", () => {
        it("should select N points from M points, given that N < M", (done) => {
            var data = [];
            for (var i = 0; i < 100; i++) {
                data.push({
                    name: 'test' + i,
                    num: i
                })
            }

            db.collection("selectNinM1").insert(data, (err, result) => {
                if (!err) {
                    var obj = {
                        numOfPoints: 10,
                        groupLogic: '$first',
                        project: ['name', 'num'],
                        query: {}
                    }
                    helperMongo.selectNinM('selectNinM1', obj, (err, result1) => {
                        // console.log(err, result1);
                        should.not.exist(err);
                        result1.should.be.an('array');
                        result1.length.should.be.eql(obj.numOfPoints);

                        done()
                    })
                } else {
                    console.error('Failed to insert into selectNinM1');
                    done(err);
                }
            })
        })
    })
})
