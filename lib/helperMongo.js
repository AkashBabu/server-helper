const sh_mongo = require('mongojs');
const sh_async = require('async');
var sh_Logger = require('logger-switch');
var sh_logger = new sh_Logger('sh-mongo');


/**
 * @constructor
 */
var HelperMongo = function(connStr, debug) {
    if (!connStr) {
        throw new Error('Mongo Connection String not provided');
    }

    sh_logger[debug ? 'activate' : 'deactivate']();
    this.sh_db = sh_mongo(connStr);
    return this;
}


/**
 * Convert group by to date format for aggregate queries
 * 
 * @param {string} groupBy - sec, min, hour, month, year
 */
HelperMongo.prototype.getDateFormat = function(group_by) {
    var format = "%Y-%m-%d";
    switch (group_by || '') {
        case 'year':
            format = "%Y"
            break;

        case 'day':
            format = "%Y-%m-%d"
            break;

        case 'month':
            format = "%Y-%m"
            break;

        case 'day':
            format = "%Y-%m-%d"
            break;

        case 'hour':
            format = "%Y-%m-%dT%H"
            break;

        case 'min':
            format = "%Y-%m-%dT%H:%M"
            break;

        case 'sec':
            format = "%Y-%m-%dT%H:%M:%S"
            break;

        case 'milli':
            format = "%Y-%m-%dT%H:%M:%S.%L"
            break;

        default:
            format = "%Y-%m-%d"
    }
    return format;
}


/**
 * Create unique index on the collection for the given key
 * 
 * @param {string} collName - collection name
 * @param {object} indexOn - index object or key
 * @param {function} cb - callback
 */
HelperMongo.prototype.createUniqueIndex = function(collName, indexOn, cb) {
    var self = this;
    self.sh_db.collection(collName).createIndex((indexOn.constructor == Object) ? indexOn : {
        indexOn: 1
    }, {
        unique: true
    }, cb);
}

/**
 * Validate that a document with unique fields exists
 * 
 * @param {string} collName - collection name
 * @param {array} validate - validations
 * @param {function} cb - callback
 */
HelperMongo.prototype.validateExistence = function(collName, validate, cb) {
    var self = this;
    self.sh_db.collection(collName).findOne(validate, cb);
}

/**
 * Validate that a document doesnt exist for the given query
 * 
 * @param {string} collName - collection name
 * @param {array} validate - validations
 * @param {function} cb - callback
 */
HelperMongo.prototype.validateNonExistence = function(collName, validate, cb) {
    var self = this;
    self.sh_db.collection(collName).findOne(validate, function(err, result) {
        cb(err, !result);
    });
}

/**
 * Validate that a document with unique fields is not already present
 * 
 * @param {string} collName - collection name
 * @param {array} validate - validations
 * @param {function} cb - callback
 */
HelperMongo.prototype.validateNonExistenceWithMsg = function(collName, validate, cb) {
    var self = this;
    if (validate && validate.constructor == Object) {
        validate = [validate]
    }
    sh_async.everySeries(
        validate,
        function(condition, cb1) {
            self.sh_db.collection(collName).findOne(condition.query, function(err, result) {
                if (result) {
                    cb1({
                        code: condition.errMsg || "Duplicate Document"
                    });
                } else {
                    cb1(err, !result);
                }
            })
        },
        function(err, done) {
            cb(err, done);
        }
    )
}

/**
 * Validate that a document must not exist for the changed params whose value has to be unique
 * 
 * @param {string} collName - collection name
 * @param {object} obj - changed document
 * @param {array} fields - no duplicate validations
 * @param {function} cb - callback  
 */
HelperMongo.prototype.validateNonExistenceWhileUpdate = function(collName, obj, fields, cb) {
    var self = this;
    var id;
    try {
        id = self.sh_db.ObjectId(obj._id);
    } catch (err) {
        return cb({
            code: "Invalid Id"
        })
    }

    sh_async.autoInject({
        getExistingObj: function(cb1) {
            self.sh_db.collection(collName).findOne({
                _id: id
            }, cb1);
        },
        compareWithNewObj: function(getExistingObj, cb1) {
            if (getExistingObj) {
                sh_async.each(
                    fields,
                    function(field, cb2) {
                        if (getExistingObj[field.name] != obj[field.name]) {
                            var mongoQuery = {};
                            mongoQuery[field.name] = obj[field.name];
                            if (field.query) {
                                mongoQuery = field.query;
                            }
                            self.sh_db.collection(collName).findOne(mongoQuery, {
                                _id: 1
                            }, function(err, result) {
                                if (result) {
                                    cb2({
                                        code: field.errMsg ? field.errMsg : "Invalid " + field.name
                                    })
                                } else {
                                    cb2(err, !result);
                                }
                            })
                        } else {
                            cb2(null, true);
                        }
                    },
                    function(err, done) {

                        cb1(err, done);
                    }
                )
            } else {
                cb1({
                    code: "Non Existing _id"
                })
            }
        }
    }, function(err, results) {

        cb(err, results.compareWithNewObj);
    })
}

/**
 * Validate Unique existence for the given query
 * 
 * @param {string} collName - collection name
 * @param {object} validate - query to check the documents
 * @param {function} cb - callback 
 */
HelperMongo.prototype.noDuplicate = function(collName, validate, cb) {
    var self = this;

    self.sh_db.collection(collName).find(validate, function(err, result) {
        // console.log("noDupMongo:", err, result);
        cb(err, result && result.length < 2);
    })
}

HelperMongo.prototype.validateUnique = function(collName, validate, cb) {
    var self = this;
    self.sh_db.collection(collName).find(validate, function(err, result) {
        cb(err, result ? (result.length == 1 ? true : false) : null);
    })
}

/**
 * Validate if a document for the given id exists
 * 
 * @param {string} collName - collection name
 * @param {string} id - Mongo document id
 * @param {boolean} convertId - Specifies if the id has to be converted Id or not
 * @param {function} cb - callback
 */
HelperMongo.prototype.validateId = function(collName, id, convertId, cb) {
    var self = this;

    if (convertId.constructor == Function) {
        console.warn("Deprecation Warning! Use of convertId will be deprecated in future releases")
        cb = convertId;
        convertId = true;
    }

    try {
        id = self.sh_db.ObjectId(id);
    } catch (err) {
        return cb({
            code: 'Invalid Id'
        })
    }

    self.sh_db.collection(collName).findOne({
        _id: id
    }, (err, doc) => {
        cb(err, !!doc);
    });
}


/**
 * Get a document for the given id
 * 
 * @param {string} collName - collection name
 * @param {string} id - mongo document id
 * @param {boolean} convertId - Specifies if the id has to converted to Mongo Id or not
 * @param {function} cb - callback
 */
HelperMongo.prototype.getForId = function(collName, id, convertId, cb) {
    var self = this;
    if (convertId.constructor == Function) {
        console.warn("Deprecation Warning! Use of convertId will be deprecated in future releases")
        cb = convertId;
        convertId = true;
    }

    var id;
    try {
        id = self.sh_db.ObjectId(id);
    } catch (err) {
        return cb({
            code: 'Invalid Id'
        })
    }

    self.sh_db.collection(collName).findOne({
        _id: id
    }, cb)
}


/**
 * Get Max value of key in a collection 
 * 
 * @param {string} collName - collection name
 * @param {object} obj
 * @param {string} obj.key
 * @param {object} [obj.query={}] - mongo find query (useful incase of finding max within the document array)
 * @param {object} [obj.unwind={}] - mongo aggregation unwind (useful incase of finding max within the document array)
 * @param {function} cb - callback
 */
HelperMongo.prototype.getMax = function(collName, obj, cb) {
    var self = this;

    self.sh_db.collection(collName).aggregate({
        $match: obj.query || {}
    }, {
        $unwind: obj.unwind || '$' + obj.key
    }, {
        $group: {
            _id: null,
            sno: {
                $max: '$' + obj.key
            }
        }
    }, cb);
}

/**
 * To find the next Sequence number in incremental format
 * @param {string} collName - collection name
 * @param {object} obj
 * @param {string} obj.key - Key on which max Seq has to be found
 * @param {string} [obj.errMsg='Could not Get Next Sequence Number'] - Message to return when a new Seq No could not be created
 * @param {number} [obj.maxValue] - The max permissable value for the key
 * @param {number} [obj.minValue=1] - the min permissable value for the key
 * @param {object} [obj.query={}] - mongo find query (useful incase of finding max within the document array)
 * @param {object} [obj.unwind={}] - mongo aggregation unwind (useful incase of finding max within the document array)
 * @param {function} cb - format(err, sno)
 */
HelperMongo.prototype.getNextSeqNo = function(collName, obj, cb) {
    var self = this;

    self.getMax(collName, obj, function(err, result) {
        if (!err) {
            var sno = result.length ? result[0][obj.key] + 1 : (obj.hasOwnProperty('minValue') ? obj.minValue : 1)
            if (obj.maxValue && sno > obj.maxValue) {
                var i = (obj.hasOwnProperty('minValue') ? obj.minValue : 1);
                var found = false;
                var find = Object.assign({}, obj.query);
                sh_async.whilst(
                    function() {
                        if (i > maxValue) {
                            return false;
                        }
                        return !found;
                    },
                    function(cb) {
                        find[obj.key] = i;
                        self.sh_db.collection(collName).findOne(find, function(err, result) {
                            if (!result) {
                                found = true;
                            } else {
                                i++;
                            }
                            cb(err, result);
                        })
                    },
                    function(err, n) {
                        if (found) {
                            cb(err, i);
                        } else {
                            cb({
                                code: obj.errMsg || 'Could not Get Next Sequence Number'
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

/**
 * Insert a doc
 * 
 * @param {string} collName - collection name
 * @param {obj} obj - Document to insert
 * @param {function} cb - callback
 */
HelperMongo.prototype.insert = function(collName, obj, cb) {
    var self = this;
    self.sh_db.collection(collName).insert(obj, cb);
}


/**
 * Update a doc
 * 
 * @param {string} collName - collection name
 * @param {obj} obj - Document to update (must include _id)
 * @param {boolean} convertId - Specifies if _id in object should be converted or not
 * @param {function} cb - callback
 */
HelperMongo.prototype.update = function(collName, obj, convertId, cb) {
    var self = this;

    if (convertId.constructor == Function) {
        console.warn("Deprecation Warning! Use of convertId will be deprecated in future releases")
        cb = convertId;
        convertId = true;
    }

    var id;
    try {
        id = self.sh_db.ObjectId(obj._id);
    } catch (err) {
        return cb({
            code: 'Invalid Id'
        });
    }

    // if (obj.isDeleted) {
    //     query.isDeleted = obj.isDeleted;
    // }

    delete obj._id;
    obj.utime = new Date();

    self.sh_db.collection(collName).update({
        _id: id
    }, {
        $set: obj
    }, {
        upsert: false,
        multi: false,
    }, cb);
}

/**
 * For getting list 
 * @param {string} collName - collection Name
 * 
 * @param {object} obj
 * @param {object} obj.query - Query for Documents
 * @param {object} obj.project - Fields to project
 * @param {object} obj.sort - Sorting
 * @param {string} obj.search - Search String or value
 * @param {string} obj.searchField - Field on which search string has to be applied
 * @param {number} obj.recordsPerPage - Number of documents to fetch
 * @param {number} obj.pageNo - Page No 
 * 
 * @param {boolean} parse - Specifies if the query, project and sort has to be parsed to JSON object or not
 * @param {function} cb - callback
 */
HelperMongo.prototype.getList = function(collName, obj, parse, cb) {
    var self = this;

    if (!cb) {
        cb = parse;
        parse = false;
    }

    obj = obj || {};
    if (obj.query && typeof obj.query == String) {
        obj.query = JSON.parse(obj.query || '{}');
    }
    if (obj.sort && typeof obj.sort == String) {
        obj.sort = JSON.parse(obj.sort || '{}');
    }
    if (obj.project && typeof obj.project == String) {
        obj.project = JSON.parse(obj.project || '{}');
    }

    // if (parse) {
    // } else {
    //     obj.query = obj.query || {};
    //     obj.project = obj.project || {};
    //     obj.sort = obj.sort || {};
    // }

    if (obj.search) {
        var regex = new RegExp('.*' + obj.search + '.*', 'i');
        (obj.query)[obj.searchField || 'name'] = {
            $regex: regex
        }
    }

    sh_async.autoInject({
        getCount: function(cb) {
            self.sh_db.collection(collName).find(obj.query || {}).count(cb);
        },
        getList: function(cb) {
            if (obj.recordsPerPage) {
                var limit = parseInt(obj.recordsPerPage);
                var skip = (parseInt(obj.pageNo || 1) - 1) * limit;

                self.sh_db.collection(collName).find(obj.query, obj.project)
                    .sort(obj.sort)
                    .skip(skip)
                    .limit(limit, cb);
            } else {

                self.sh_db.collection(collName).find(obj.query, obj.project)
                    .sort(obj.sort, cb);
            }
        }
    }, function(err, results) {
        cb(err, {
            count: results.getCount,
            list: results.getList
        })
    })
}

/**
 * Remove a document
 * @param {string} collName - collection name
 * @param {string} id - id of the document to be removed
 * @param {boolean} removeDoc - Specifies if the document should be removed or isDeleted must be set to true
 * @param {function} cb - callback
 */
HelperMongo.prototype.remove = function(collName, id, removeDoc, cb) {
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
                isDeleted: true,
                dtime: new Date()
            }
        }, {
            multi: false,
            upsert: false
        }, cb);
    }
}

/**
 * Copy collection between dbs
 * @param {string} fromDb - from DB connection string
 * @param {string} fromCollection - Collection Name to copy from
 * @param {string} toDb - to DB connection string
 * @param {string} [toCollection=fromCollection] - collection Name to copy to
 */
HelperMongo.prototype.copyCollection = function(fromDb, fromCollection, toDb, toCollection, cb) {
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
        function() {
            return !completed;
        },
        function(cb1) {
            try {
                fromDb.collection(fromCollection).find().limit(1).skip(count, function(err, result) {
                    if (!err && result) {
                        toDb.collection(toCollection || fromCollection).insert(result, cb1);
                        console.log(count++);
                    } else {
                        completed = true;
                        cb1(err, result);
                    }
                })
            } catch (err) {
                sh_logger.log('Done Copying');
                completed = true;
                cb1(err, null);
            }
        },
        function(err, n) {
            console.log(err, n);
            cb(err, n);
        }
    );
}


/**
 * Get sum in each slot (standard - sec, hour, min, day, month, year)
 * 
 * @param {string} collName - collection name
 * @param {obj} object
 * @param {string} obj.tsKey
 * @param {string} obj.pointKeys
 * @param {date} obj.fromTime
 * @param {date} obj.toTime
 * @param {string} groupBy - slot type - sec, hour, min, day, month, year
 * 
 * @param {function} cb - callback
 */
HelperMongo.prototype.sumInStandardSlots = function(collName, obj, cb) {
    var self = this;
    var match = {};
    match[obj.tsKey] = {
        $lt: obj.toTime,
        $gte: obj.fromTime
    }
    var project = {
        date: {
            $dateToString: {
                format: self.getDateFormat(obj.groupBy),
                date: "$" + obj.tsKey
            }
        }
    }

    var group = {
        _id: '$date'
    };
    obj.pointKeys.forEach(key => {
        project[key] = 1;
        group[key] = {
            $sum: "$" + key
        };
    });

    self.sh_db.collection(collName).aggregate({
            $match: match
        }, {
            $project: project
        }, {
            $group: group
        },
        cb);
}

/**
 * get average in each N slices of time range
 * 
 * @param {string} collName - collection name
 * @param {obj} object
 * @param {string} obj.tsKey
 * @param {string} obj.pointKeys
 * @param {date} obj.fromTime
 * @param {date} obj.toTime
 * @param {string} n - number of time slices
 * 
 * @param {function} cb - callback
 */
HelperMongo.prototype.avgInNSlots = function(collName, obj, cb) {
    var self = this;

    var factor = Math.floor((obj.toTime - obj.fromTime) / obj.n);
    var match = {};
    match[obj.tsKey] = {
        $lt: obj.toTime,
        $gte: obj.fromTime
    };

    var project = {
        date: {
            $floor: {
                $divide: [{
                    $subtract: ["$" + obj.tsKey, new Date(0)]
                }, factor]
            }
        }
    };

    var group = {
        _id: '$date'
    };
    obj.pointKeys.forEach(key => {
        project[key] = 1;
        group[key] = {
            $avg: '$' + key
        };
    })

    self.sh_db.collection(collName).aggregate({
        $match: match
    }, {
        $project: project
    }, {
        $group: group
    }, cb);
}

/**
 * Select N slot in the time range and pick the first in each time slice
 *  
 * @param {string} collName - collection name
 * @param {obj} object
 * @param {string} obj.tsKey
 * @param {string} obj.pointKeys
 * @param {date} obj.fromTime
 * @param {date} obj.toTime
 * @param {string} n - number of time slices
 * 
 * @param {function} cb - callback
 */
HelperMongo.prototype.firstInNSlots = function(collName, obj, cb) {
    var self = this;

    var factor = Math.floor((obj.toTime - obj.fromTime) / obj.n);
    var match = {};
    match[obj.tsKey] = {
        $lt: obj.toTime,
        $gte: obj.fromTime
    };

    var project = {
        date: {
            $floor: {
                $divide: [{
                    $subtract: ["$" + obj.tsKey, new Date(0)]
                }, factor]
            }
        }
    };

    var group = {
        _id: '$date'
    };
    obj.pointKeys.forEach(key => {
        project[key] = 1;
        group[key] = {
            $first: '$' + key
        };
    })

    self.sh_db.collection(collName).aggregate({
        $match: match
    }, {
        $project: project
    }, {
        $group: group
    }, cb);
}


/**
 * Select N points in the given time range
 * 
 * @param {string} collName - collection name
 * @param {obj} object
 * @param {string} obj.tsKey
 * @param {string} obj.pointKeys
 * @param {date} obj.fromTime
 * @param {date} obj.toTime
 * @param {string} n - number of points to select
 * 
 * @param {function} cb - callback
 */
HelperMongo.prototype.selectNPoints = function(collName, obj, cb) {
    var self = this;
    var match = {};
    match[obj.tsKey] = {
        $lt: obj.toTime,
        $gte: obj.fromTime
    };

    var push = {};
    obj.pointKeys.forEach(key => {
        push[key] = '$' + key;
    })

    var group1 = {
        _id: null,
        data: {
            $push: push
        },
        count: {
            $sum: 1
        }
    }

    var unwind = {
        path: '$data',
        includeArrayIndex: 'index'
    }

    var project = {
        index: {
            $floor: {
                $divide: ['$index', {
                    $divide: ['$count', n]
                }]
            }
        },
        data: 1
    }

    var group2 = {
        _id: '$index',
        data: {
            $first: '$data'
        }
    }

    self.sh_db.collection(collName).aggregate({
        $match: match
    }, {
        $group: group1
    }, {
        $unwind: unwind
    }, {
        $project: project
    }, {
        $group: group
    }, cb);
}

module.exports = HelperMongo;