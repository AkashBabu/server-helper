var serverHelper = require('../../index');
var HelperMongo = serverHelper.HelperMongo;
var connStr = "sh_test"
var helperMongo = new HelperMongo(connStr, true);
var mongojs = require('mongojs')
var db = mongojs(connStr)
var moment = require("moment")

var chai = require("chai")
var should = chai.should()
var assert = chai.assert

var userColl = "users"
var diffHour = -5.5

describe("helper mongo", () => {

    beforeEach((done) => {
        db.collection(userColl).remove({}, done)
    })

    after((done) => {
        db.dropDatabase(done)
    })

    describe("#getDateFormat()", () => {
        beforeEach((done) => {
            db.collection(userColl).remove({}, done)
        })

        it("should return Year format", (done) => {
            var date = new Date()
            var user = {
                name: 'Akash',
                cTime: date
            }

            db.collection(userColl).insert(user, function(err, result) {
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
                    }], function(err, result) {
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

            db.collection(userColl).insert(user, function(err, result) {
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
                    }], function(err, result) {
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

            db.collection(userColl).insert(user, function(err, result) {
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
                    }], function(err, result) {
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

            db.collection(userColl).insert(user, function(err, result) {
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
                    }], function(err, result) {
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

            db.collection(userColl).insert(user, function(err, result) {
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
                    }], function(err, result) {
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

            db.collection(userColl).insert(user, function(err, result) {
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
                    }], function(err, result) {
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

            db.collection(userColl).insert(user, function(err, result) {
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
                    }], function(err, result) {
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

            db.collection(userColl).insert(user, function(err, result) {
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
                    }], function(err, result) {
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
})
