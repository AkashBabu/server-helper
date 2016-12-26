








const sh_mongo = require('mongojs');
const sh_async = require('async');

var HelperMongo = function(connStr){
    if(!connStr){
        throw new Error('Mongo Connection String not provided');
    }

    this.sh_db = sh_mongo(connStr);
    return this;
}

HelperMongo.prototype.getDateFormat = function (group_by) {
    var self = this;
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



HelperMongo.prototype.createUniqueIndex = function (collName, indexOn, cb) {
    var self = this;
    self.sh_db.collection(collName).createIndex((indexOn.constructor == Object) ? indexOn : {
        indexOn: 1
    }, {
            unique: true
        }, cb);
}

HelperMongo.prototype.validateExistence = function (collName, validate, cb) {
    var self = this;
    self.sh_db.collection(collName).findOne(validate, cb);
}

HelperMongo.prototype.validateNonExistence = function (collName, validate, cb) {
    var self = this;
    self.sh_db.collection(collName).findOne(validate, function(err, result){
        cb(err, !result);
    });
}

HelperMongo.prototype.validateUnique = function (collName, validate, cb) {
    var self = this;
    self.sh_db.collection(collName).find(validate, function (err, result) {
        cb(err, result ? (result.length == 1 ? true : false) : null);
    })
}

HelperMongo.prototype.validateId = function (collName, id, convertId, cb) {
    var self = this;

    if (convertId.constructor == Function) {
        cb = convertId;
        convertId = true;
    }

    if (convertId) {
        try {
            id = self.sh_db.ObjectId(id);
        } catch (err) {
            // return cb(err, false);
            return cb({
                code: 'Invalid Id'
            })
        }
    }

    self.sh_db.collection(collName).findOne({
        _id: id
    }, cb);
}

HelperMongo.prototype.getForId = function (collName, id, convertId, cb) {
    var self = this;
    self.validateId.apply(self, arguments);
}

HelperMongo.prototype.getNextSeqNoNew = function (collName, obj, cb) {
    var self = this;
    self.sh_db.collection(collName).aggregate({
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
                    sh_async.whilst(
                        function () {
                            if (i > maxValue) {
                                return false;
                            }
                            return !found;
                        },
                        function (cb) {
                            find[key] = i;
                            self.sh_db.collection(collName).findOne(find, function (err, result) {
                                if (!result) {
                                    found = true;
                                } else {
                                    i++;
                                }
                                cb(err, result);
                            })
                        },
                        function (err, n) {
                            if (found) {
                                cb(err, i);
                            } else {
                                cb({
                                    code: 'Could not create a new Id'
                                }, null);
                            }
                        })
                } else {
                    cb(err, sno);
                }
            } else {
                cb(err, null);
            }
        })
}

HelperMongo.prototype.getNextSeqNo = function (collName, obj, key, maxValue, cb) {
    var self = this;
    self.sh_db.collection(collName).aggregate({
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
                    sh_async.whilst(
                        function () {
                            if (i > maxValue) {
                                return false;
                            }
                            return !found;
                        },
                        function (cb) {
                            find[key] = i;
                            self.sh_db.collection(collName).findOne(find, function (err, result) {
                                if (!result) {
                                    found = true;
                                } else {
                                    i++;
                                }
                                cb(err, result);
                            })
                        },
                        function (err, n) {
                            if (found)
                                cb(err, i);
                            else
                                cb({
                                    code: 'Could not create a new Id'
                                }, null);
                        })
                } else {
                    cb(err, sno);
                }
            } else {
                cb(err, null);
            }
        })
}

HelperMongo.prototype.insert = function (collName, obj, cb) {
    var self = this;
    self.sh_db.collection(collName).insert(obj, cb);
}

HelperMongo.prototype.update = function (collName, obj, convertId, cb) {
    var self = this;
    var query = {};

    if (convertId.constructor == Function) {
        cb = convertId;
        convertId = true;
    }

    if (convertId) {

        try {
            query._id = self.sh_db.ObjectId(obj._id);
        } catch (err) {
            return cb({
                code: 'Invalid Id'
            }, null);
        }

    }

    if (obj.isDeleted) {
        query.isDeleted = obj.isDeleted;
    }

    delete obj._id;
    obj.utime = new Date();
    self.sh_db.collection(collName).update(query, {
        $set: obj
    }, {
            upsert: false,
            multi: false,
        }, cb);
}

// HelperMongo.prototype.update = function (collName, obj, cb) {
    // var self = this;
//     var id;
//     try {
//         id = self.sh_db.ObjectId(obj._id);
//     } catch (err) {
//         return cb({
//             code: 'Invalid Id'
//         }, null);
//     }
//     delete obj._id
//     // var set = Object.assign({}, obj);
//     // delete set._id;
//     // delete set.ctime;
//     self.sh_db.collection(collName).update({
//         _id: id,
//         isDeleted: false
//     }, {
//             $set: obj,
//             $currentDate: {
//                 utime: true
//             }
//         }, {
//             upsert: false,
//             multi: false,
//         }, cb);
// }

HelperMongo.prototype.getList = function (collName, obj, cb) {
    var self = this;
    var limit = parseInt(obj.recordsPerPage || 20);
    var skip = (parseInt(obj.pageNo || 1) - 1) * limit;
    if(obj.search){
        var regex = new RegExp('.*' + obj.search + '.*');
        (obj.query ? obj.query: obj.query = {})[obj.searchField || 'name'] = {
            $regex: regex
        }
    }
    self.sh_db.collection(collName).find(obj.query, obj.project || {})
        .sort(obj.sort || {})
        .skip(skip)
        .limit(limit, cb);
}

HelperMongo.prototype.remove = function (collName, id, removeDoc, cb) {
    var self = this;
    try {
        id = self.sh_db.ObjectId(id);
    } catch (err) {
        return cb({
            code: 'Invalid Id'
        });
    }
    if (removeDoc) {
        self.sh_db.collection(collName).remove({
            _id: id
        }, cb);
    } else {
        self.sh_db.collection(collName).update({
            _id: id
        }, {
                $set: {
                    isDeleted: true
                },
                $currentDate: {
                    utime: true
                }
            }, {
                multi: false,
                upsert: false
            }, cb);
    }
}

HelperMongo.prototype.copyCollection = function (fromDb, fromCollection, toDb, toCollection, cb) {
    var self = this;
    if (toCollection.constructor == Function) {
        cb = toCollection;
        toCollection = fromCollection;
    }

    var fromDb = sh_mongo(fromDb);
    var toDb = sh_mongo(toDb);

    var completed = false;
    var count = 0;
    sh_async.whilst(
        function () {
            return !completed;
        },
        function (cb1) {
            try {
                fromDb.collection(fromCollection).find().limit(1).skip(count, function (err, result) {
                    if (!err && result) {
                        toDb.collection(toCollection || fromCollection).insert(result, cb1);
                        console.log(count++);
                    } else {
                        completed = true;
                        cb1(err, result);
                    }
                })
            } catch (err) {
                console.log('Done Copying');
                completed = true;
                cb1(err, null);
            }
        },
        function (err, n) {
            console.log(err, n);
            cb(err, n);
        }
    );
}

HelperMongo.prototype.selectStandardSlots = function (collName, tsKey, pointKeys, fromTime, toTime, groupBy, cb) {
    var self = this;
    var match = {};
    match[tsKey] = {
        $lt: toTime,
        $gte: fromTime
    }
    var project = {
        date: {
            $dateToString: {
                format: self.getDateFormat(groupBy),
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

    self.sh_db.collection(collName).aggregate({
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
        cb);
}

HelperMongo.prototype.selectAverageInNSlots = function (collName, tsKey, pointkeys, fromTime, toTime, n, cb) {
    var self = this;
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

    self.sh_db.collection('test_point_selection').aggregate({
        $match: match
    }, {
            $project: project
        }, {
            $group: group
        }, cb);
}

HelperMongo.prototype.selectNSlots = function (collName, tsKey, pointkeys, fromTime, toTime, n, cb) {
    var self = this;
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

    self.sh_db.collection('test_point_selection').aggregate({
        $match: match
    }, {
            $project: project
        }, {
            $group: group
        }, cb);
}

// HelperMongo.prototype.selectAverageInNPoints = function(collName, tsKey, pointKeys, fromTime, toTime, n, cb) {
    // var self = this;
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
//     self.sh_db.collection(collName).aggregate({
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
//     }, cb);
// }

HelperMongo.prototype.selectNPoints = function (collName, tsKey, pointKeys, fromTime, toTime, n, cb) {
    var self = this;
    var match = {};
    match[tsKey] = {
        $lt: toTime,
        $gte: fromTime
    };

    var push = {};
    pointKeys.forEach(key => {
        push[key] = '$' + key;
    })

    self.sh_db.collection(collName).aggregate({
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
        }, cb);
}

module.exports = HelperMongo;
