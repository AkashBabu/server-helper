var helper = require('./helper');
const mongojs = require('mongojs');
const async = require('async');
// var mongo = require('mongojs');
// var db = require()
var helperDb = {};

helperDb.createUniqueIndex = function(indexOn, collName, callback) {
    db.collection(collName).createIndex((indexOn.constructor == Object) ? indexOn : {
        indexOn: 1
    }, {
        unique: true
    }, callback);
}

helperDb.validateExistence = function(validate, collName, callback) {
    db.collection(collName).findOne(validate, callback);
}

helperDb.validateUnique = function(validate, collName, callback) {
    db.collection(collName).find(validate, function(err, result) {
        callback(err, result ? (result.length == 1 ? true : false) : null);
    })
}

helperDb.getNextSeqNoNew = function(obj, collName, callback) {
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
    }, function(err, result) {
        if (!err) {
            var sno = result.length ? result[0].sno + 1 : 1;
            if (obj.maxValue && sno > maxValue) {
                var i = 1;
                var found = false;
                var find = Object.assign({}, obj.query);
                async.whilst(
                    function() {
                        if (i > maxValue) {
                            return false;
                        }
                        return !found;
                    },
                    function(callback) {
                        find[key] = i;
                        db.collection(collName).findOne(find, function(err, result) {
                            if (!result) {
                                found = true;
                            } else {
                                i++;
                            }
                            callback(err, result);
                        })
                    },
                    function(err, n) {
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

helperDb.getNextSeqNo = function(obj, key, maxValue, collName, callback) {
    db.collection(collName).aggregate({
        $match: obj
    }, {
        $group: {
            _id: null,
            sno: {
                $max: '$' + key
            }
        }
    }, function(err, result) {
        if (!err) {
            var sno = result.length ? result[0].sno + 1 : 1;
            if (sno > maxValue) {
                var i = 1;
                var found = false;
                var find = Object.assign({}, obj);
                async.whilst(
                    function() {
                        if (i > maxValue) {
                            return false;
                        }
                        return !found;
                    },
                    function(callback) {
                        find[key] = i;
                        db.collection(collName).findOne(find, function(err, result) {
                            if (!result) {
                                found = true;
                            } else {
                                i++;
                            }
                            callback(err, result);
                        })
                    },
                    function(err, n) {
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

helperDb.insert = function(obj, collName, callback) {
    helper.appendCtime(obj);
    helper.appendUtime(obj);
    db.collection(collName).insert(obj, callback);
}

helperDb.updateNew = function(obj, collName, callback) {
    var query = {};
    try {
        query.id = mongo.ObjectId(obj._id);
    } catch (err) {
        return callback({
            code: 'Invalid Id'
        }, null);
    }
    helper.updateUtime(obj);
    if (obj.isDeleted) {
        query.isDeleted = obj.isDeleted;
    }

    db.collection(collName).update(query, {
        $set: obj
    }, {
        upsert: false,
        multi: false,
    }, callback);
}

helperDb.update = function(obj, collName, callback) {
    var id;
    try {
        id = mongo.ObjectId(obj._id);
    } catch (err) {
        return callback({
            code: 'Invalid Id'
        }, null);
    }
    var set = Object.assign({}, obj);
    delete set._id;
    delete set.ctime;
    helper.updateUtime(set);
    db.collection(collName).update({
        _id: id,
        isDeleted: false
    }, {
        $set: set
    }, {
        upsert: false,
        multi: false,
    }, callback);
}

helperDb.getList = function(obj, collName, callback) {
    var limit = parseInt(obj.recordsPerPage || 20);
    var skip = (parseInt(obj.pageNo || 1) - 1) * limit;
    db.collection(targetColl).find(obj.query, obj.project || {})
        .sort(obj.sort || {})
        .skip(skip)
        .limit(limit, callback);
}

helperDb.copyCollection = function(fromDb, fromCollection, toDb, toCollection, callback) {
    if(toCollection.constructor == Function){
      callback = toCollection;
      toCollection = fromCollection;
    }

    var fromDb = mongo(fromDb);
    var toDb = mongo(toDb);

    var completed = false;
    var count = 0;
    async.whilst(
        function() {
            return !completed;
        },
        function(callback1) {
            try {
                fromDb.collection(fromCollection).find().limit(1).skip(count, function(err, result) {
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
        function(err, n) {
            console.log(err, n);
            callback(err, n);
        }
    );
}


helperDb.insert()

module.exports = helperDb;
