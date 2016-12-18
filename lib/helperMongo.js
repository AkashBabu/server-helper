// var helper = require('./helper');
const mongojs = require('mongojs');
const async = require('async');
// var mongo = require('mongojs');
// var db = require()
var helperMongo = {};





helperMongo.getDateFormat = function (group_by) {
    var format = "%Y-%m-%d";
    switch (group_by || '') {
        case 'year':
            format = "%Y"
            break;

        case 'month':
            format = "%Y-%m"
            break;

        case 'hour':
            format = "%Y-%m-%dT%H"
            break;

        case 'day':
            format = "%Y-%m-%d"
            break;

        default:
            format = "%Y-%m-%d"
    }
    return format;
}



helperMongo.createUniqueIndex = function (indexOn, collName, callback) {
    db.collection(collName).createIndex((indexOn.constructor == Object) ? indexOn : {
        indexOn: 1
    }, {
            unique: true
        }, callback);
}

helperMongo.validateExistence = function (validate, collName, callback) {
    db.collection(collName).findOne(validate, callback);
}

helperMongo.validateUnique = function (validate, collName, callback) {
    db.collection(collName).find(validate, function (err, result) {
        callback(err, result ? (result.length == 1 ? true : false) : null);
    })
}

helperMongo.getNextSeqNoNew = function (obj, collName, callback) {
    db.collection(collName).aggregate({
        $match: obj.query || {}
    }, {
            $unwind: obj.unwind || obj.key
        }, {
            $group: {
                _id: null,
                sno: {
                    $max: '$' + obj.key
                }
            }
        }, function (err, result) {
            if (!err) {
                var sno = result.length ? result[0].sno + 1 : 1;
                if (obj.maxValue && sno > maxValue) {
                    var i = 1;
                    var found = false;
                    var find = Object.assign({}, obj.query);
                    async.whilst(
                        function () {
                            if (i > maxValue) {
                                return false;
                            }
                            return !found;
                        },
                        function (callback) {
                            find[key] = i;
                            db.collection(collName).findOne(find, function (err, result) {
                                if (!result) {
                                    found = true;
                                } else {
                                    i++;
                                }
                                callback(err, result);
                            })
                        },
                        function (err, n) {
                            if (found) {
                                callback(err, i);
                            } else {
                                callback({
                                    code: 'Could not create a new Id'
                                }, null);
                            }
                        })
                } else {
                    callback(err, sno);
                }
            } else {
                callback(err, null);
            }
        })
}

helperMongo.getNextSeqNo = function (obj, key, maxValue, collName, callback) {
    db.collection(collName).aggregate({
        $match: obj
    }, {
            $group: {
                _id: null,
                sno: {
                    $max: '$' + key
                }
            }
        }, function (err, result) {
            if (!err) {
                var sno = result.length ? result[0].sno + 1 : 1;
                if (sno > maxValue) {
                    var i = 1;
                    var found = false;
                    var find = Object.assign({}, obj);
                    async.whilst(
                        function () {
                            if (i > maxValue) {
                                return false;
                            }
                            return !found;
                        },
                        function (callback) {
                            find[key] = i;
                            db.collection(collName).findOne(find, function (err, result) {
                                if (!result) {
                                    found = true;
                                } else {
                                    i++;
                                }
                                callback(err, result);
                            })
                        },
                        function (err, n) {
                            if (found)
                                callback(err, i);
                            else
                                callback({
                                    code: 'Could not create a new Id'
                                }, null);
                        })
                } else {
                    callback(err, sno);
                }
            } else {
                callback(err, null);
            }
        })
}

helperMongo.insert = function (obj, collName, callback) {
    db.collection(collName).insert(obj, callback);
}

helperMongo.updateNew = function (obj, collName, callback) {
    var query = {};
    try {
        query.id = mongo.ObjectId(obj._id);
    } catch (err) {
        return callback({
            code: 'Invalid Id'
        }, null);
    }
    if (obj.isDeleted) {
        query.isDeleted = obj.isDeleted;
    }

    db.collection(collName).update(query, {
        $set: obj,
        $currentDate: {
            utime: true
        }
    }, {
            upsert: false,
            multi: false,
        }, callback);
}

helperMongo.update = function (obj, collName, callback) {
    var id;
    try {
        id = mongo.ObjectId(obj._id);
    } catch (err) {
        return callback({
            code: 'Invalid Id'
        }, null);
    }
    delete obj._id
    // var set = Object.assign({}, obj);
    // delete set._id;
    // delete set.ctime;
    db.collection(collName).update({
        _id: id,
        isDeleted: false
    }, {
            $set: obj,
            $currentDate: {
                utime: true
            }
        }, {
            upsert: false,
            multi: false,
        }, callback);
}

helperMongo.getList = function (obj, collName, callback) {
    var limit = parseInt(obj.recordsPerPage || 20);
    var skip = (parseInt(obj.pageNo || 1) - 1) * limit;
    db.collection(targetColl).find(obj.query, obj.project || {})
        .sort(obj.sort || {})
        .skip(skip)
        .limit(limit, callback);
}

helperMongo.copyCollection = function (fromDb, fromCollection, toDb, toCollection, callback) {
    if (toCollection.constructor == Function) {
        callback = toCollection;
        toCollection = fromCollection;
    }

    var fromDb = mongo(fromDb);
    var toDb = mongo(toDb);

    var completed = false;
    var count = 0;
    async.whilst(
        function () {
            return !completed;
        },
        function (callback1) {
            try {
                fromDb.collection(fromCollection).find().limit(1).skip(count, function (err, result) {
                    if (!err && result) {
                        toDb.collection(toCollection || fromCollection).insert(result, callback1);
                        console.log(count++);
                    } else {
                        completed = true;
                        callback1(err, result);
                    }
                })
            } catch (err) {
                console.log('Done Copying');
                completed = true;
                callback1(err, null);
            }
        },
        function (err, n) {
            console.log(err, n);
            callback(err, n);
        }
    );
}

helperMongo.selectStandardSlots = function (collName, tsKey, pointKeys, fromTime, toTime, groupBy, callback) {
    var match = {};
    match[tsKey] = {
        $lt: toTime,
        $gte: fromTime
    }
    var project = {
        date: {
            $dateToString: {
                format: helperMongo.getDateFormat(groupBy),
                date: "$" + tsKey
            }
        }
    }
    pointKeys.forEach(key => {
        project[key] = 1;
    });

    var group = {
        _id: '$date'
    };
    pointKeys.forEach(key => {
        group[key] = {
            $sum: "$" + key
        };
    });

    db.collection(collName).aggregate({
        $match: match
    }, {
            $project: project
        }, {
            $group: {
                _id: "$date",
                energy: {
                    $sum: "$boxData.diffEnergy"
                }
            }
        },
        callback);
}

helperMongo.selectAverageInNSlots = function (collName, tsKey, pointkeys, fromTime, toTime, n, callback) {
    /// Create n slots of timestamps and then group with $avg
    var factor = Math.floor((toTime - fromTime) / n);

    var match = {};
    match[tsKey] = {
        $lt: toTime,
        $gte: fromTime
    };

    var project = {
        date: {
            $floor: {
                $divide: [{
                    $subtract: ["$" + tsKey, new Date(0)]
                }, factor]
            }
        }
    };
    pointKeys.forEach(key => {
        project[key] = 1;
    })

    var group = {
        _id: '$date'
    };
    pointKeys.forEach(key => {
        group[key] = {
            $avg: '$' + key
        };
    })

    db.collection('test_point_selection').aggregate({
        $match: match
    }, {
            $project: project
        }, {
            $group: group
        }, callback);
}

helperMongo.selectNSlots = function (collName, tsKey, pointkeys, fromTime, toTime, n, callback) {
    /// Create n slots of timestamps and then group with $first
    var factor = Math.floor((toTime - fromTime) / n);

    var match = {};
    match[tsKey] = {
        $lt: toTime,
        $gte: fromTime
    };

    var project = {
        date: {
            $floor: {
                $divide: [{
                    $subtract: ["$" + tsKey, new Date(0)]
                }, factor]
            }
        }
    };
    pointKeys.forEach(key => {
        project[key] = 1;
    })

    var group = {
        _id: '$date'
    };
    pointKeys.forEach(key => {
        group[key] = {
            $first: '$' + key
        };
    })

    db.collection('test_point_selection').aggregate({
        $match: match
    }, {
            $project: project
        }, {
            $group: group
        }, callback);
}

// helperMongo.selectAverageInNPoints = function(collName, tsKey, pointKeys, fromTime, toTime, n, callback) {
//     var match = {};
//     match[tsKey] = {
//         $lt: fromTime,
//         $gte: toTime
//     };
//
//     var push = {};
//     pointKeys.forEach(key => {
//         push[key] = '$' + key
//     })
//
//     db.collection(collName).aggregate({
//         $match: match
//     }, {
//         $group: {
//             _id: null,
//             data: {
//                 $push: push
//             },
//             count: {
//                 $sum: 1
//             }
//         }
//     }, {
//         $unwind: {
//             path: '$data',
//             includeArrayIndex: 'index'
//         }
//     }, {
//         $project: {
//             index: {
//                 $floor: {
//                     $divide: ['$index', {
//                         $divide: ['$count', n]
//                     }]
//                 }
//             },
//             data: 1
//         }
//     }, {
//         $group: {
//             _id: '$index',
//             data: {
//                 $first: '$data'
//             }
//         }
//     }, callback);
// }

helperMongo.selectNPoints = function (collName, tsKey, pointKeys, fromTime, toTime, n, callback) {
    var match = {};
    match[tsKey] = {
        $lt: toTime,
        $gte: fromTime
    };

    var push = {};
    pointKeys.forEach(key => {
        push[key] = '$' + key;
    })

    db.collection(collName).aggregate({
        $match: match
    }, {
            $group: {
                _id: null,
                data: {
                    $push: push
                },
                count: {
                    $sum: 1
                }
            }
        }, {
            $unwind: {
                path: '$data',
                includeArrayIndex: 'index'
            }
        }, {
            $project: {
                index: {
                    $floor: {
                        $divide: ['$index', {
                            $divide: ['$count', n]
                        }]
                    }
                },
                data: 1
            }
        }, {
            $group: {
                _id: '$index',
                data: {
                    $first: '$data'
                }
            }
        }, callback);
}

module.exports = helperMongo;
