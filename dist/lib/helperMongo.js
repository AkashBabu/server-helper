"use strict";
const sh_mongo = require("mongojs");
const sh_async = require("async");
const sh_Logger = require('logger-switch');
class HelperMongo {
    constructor(connStr, debug) {
        this.sh_logger = new sh_Logger('sh-mongo');
        this.sh_db = sh_mongo(connStr);
        this.sh_logger[debug ? 'activate' : 'deactivate']();
    }
    getDateFormat(group_by) {
        let format = "%Y-%m-%d";
        switch (group_by || '') {
            case 'year':
                format = "%Y";
                break;
            case 'day':
                format = "%Y-%m-%d";
                break;
            case 'month':
                format = "%Y-%m";
                break;
            case 'day':
                format = "%Y-%m-%d";
                break;
            case 'hour':
                format = "%Y-%m-%dT%H";
                break;
            case 'min':
                format = "%Y-%m-%dT%H:%M";
                break;
            case 'sec':
                format = "%Y-%m-%dT%H:%M:%S";
                break;
            case 'milli':
                format = "%Y-%m-%dT%H:%M:%S.%L";
                break;
            default:
                format = "%Y-%m-%d";
        }
        return format;
    }
    validateExistence(collName, validate, cb) {
        this.sh_db.collection(collName).findOne(validate.query || validate, function (err, result) {
            if (!result) {
                cb(validate.errMsg || "Document Does not Exist");
            }
            else {
                cb(err, result);
            }
        });
    }
    validateNonExistence(collName, validate, cb) {
        if (validate && validate.constructor == Object) {
            validate = [validate];
        }
        sh_async.everySeries(validate, (condition, cb1) => {
            this.sh_db.collection(collName).findOne(condition.query || condition, function (err, result) {
                if (result) {
                    cb1(condition.errMsg || "Duplicate Document");
                }
                else {
                    cb1(err, !result);
                }
            });
        }, function (err, done) {
            cb(err, done);
        });
    }
    validateNonExistenceOnUpdate(collName, obj, validations, cb) {
        let id;
        try {
            id = this.sh_db.ObjectId(obj._id);
        }
        catch (err) {
            return cb("Invalid Id");
        }
        sh_async.autoInject({
            getExistingObj: (cb1) => {
                this.sh_db.collection(collName).findOne({
                    _id: id
                }, cb1);
            },
            compareWithNewObj: (getExistingObj, cb1) => {
                if (getExistingObj) {
                    sh_async.each(validations, (field, cb2) => {
                        if (getExistingObj[field.name] != obj[field.name]) {
                            let mongoQuery = {};
                            mongoQuery[field.name] = obj[field.name];
                            if (field.query) {
                                mongoQuery = field.query;
                            }
                            this.sh_db.collection(collName).findOne(mongoQuery, {
                                _id: 1
                            }, function (err, result) {
                                if (result) {
                                    cb2(field.errMsg ? field.errMsg : "Invalid " + field.name);
                                }
                                else {
                                    cb2(err, !result);
                                }
                            });
                        }
                        else {
                            cb2(null, true);
                        }
                    }, cb1);
                }
                else {
                    cb1("Non Existing _id");
                }
            }
        }, function (err, results) {
            cb(err, results.compareWithNewObj);
        });
    }
    getById(collName, id, cb) {
        try {
            id = this.sh_db.ObjectId(id);
        }
        catch (err) {
            return cb('Invalid Id');
        }
        this.sh_db.collection(collName).findOne({
            _id: id
        }, cb);
    }
    getMaxValue(collName, obj, cb) {
        this.sh_db.collection(collName).aggregate({
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
    getNextSeqNo(collName, obj, cb) {
        this.getMaxValue(collName, obj, function (err, result) {
            if (!err) {
                let sno = result.length ? result[0][obj.key] + 1 : (obj.hasOwnProperty('minValue') ? obj.minValue : 1);
                if (obj.maxValue && sno > obj.maxValue) {
                    let i = (obj.hasOwnProperty('minValue') ? obj.minValue : 1);
                    let found = false;
                    let find = Object.assign({}, obj.query);
                    sh_async.whilst(() => {
                        if (i > obj.maxValue) {
                            return false;
                        }
                        return !found;
                    }, (cb) => {
                        find[obj.key] = i;
                        this.sh_db.collection(collName).findOne(find, function (err, result) {
                            if (!result) {
                                found = true;
                            }
                            else {
                                i++;
                            }
                            cb(err, result);
                        });
                    }, function (err, n) {
                        if (found) {
                            cb(err, i);
                        }
                        else {
                            cb({
                                code: obj.errMsg || 'Could not Get Next Sequence Number'
                            }, null);
                        }
                    });
                }
                else {
                    if (obj.minValue && sno < obj.minValue) {
                        sno = obj.minValue;
                    }
                    cb(err, sno);
                }
            }
            else {
                cb(err, null);
            }
        });
    }
    update(collName, obj, cb) {
        let id;
        try {
            id = this.sh_db.ObjectId(obj._id);
        }
        catch (err) {
            return cb('Invalid Id');
        }
        delete obj._id;
        obj.utime = new Date();
        this.sh_db.collection(collName).update({
            _id: id
        }, {
            $set: obj
        }, {
            upsert: false,
            multi: false,
        }, cb);
    }
    getList(collName, obj, cb) {
        obj = obj || {};
        if (obj.query && typeof obj.query == 'string') {
            obj.query = JSON.parse(obj.query || '{}');
        }
        if (obj.sort && typeof obj.sort == 'string') {
            obj.sort = JSON.parse(obj.sort || '{}');
        }
        if (obj.project && typeof obj.project == 'string') {
            obj.project = JSON.parse(obj.project || '{}');
        }
        if (obj.search) {
            let regex = new RegExp('.*' + obj.search + '.*', 'i');
            (obj.query)[obj.searchField || 'name'] = {
                $regex: regex
            };
        }
        sh_async.autoInject({
            getCount: (cb) => {
                this.sh_db.collection(collName).find(obj.query || {}).count(cb);
            },
            getList: (cb) => {
                if (obj.recordsPerPage) {
                    let limit = parseInt(obj.recordsPerPage.toString());
                    let skip = (parseInt(obj.pageNo ? obj.pageNo.toString() : "1") - 1) * limit;
                    this.sh_db.collection(collName).find(obj.query, obj.project)
                        .sort(obj.sort)
                        .skip(skip)
                        .limit(limit, cb);
                }
                else {
                    this.sh_db.collection(collName).find(obj.query, obj.project)
                        .sort(obj.sort, cb);
                }
            }
        }, function (err, results) {
            cb(err, {
                count: results.getCount,
                list: results.getList
            });
        });
    }
    remove(collName, id, removeDoc, cb) {
        try {
            id = this.sh_db.ObjectId(id);
        }
        catch (err) {
            return cb({
                code: 'Invalid Id'
            });
        }
        if (removeDoc) {
            this.sh_db.collection(collName).remove({
                _id: id
            }, cb);
        }
        else {
            this.sh_db.collection(collName).update({
                _id: id
            }, {
                $set: {
                    isDeleted: true,
                    delTime: new Date()
                }
            }, {
                multi: false,
                upsert: false
            }, cb);
        }
    }
    splitTimeThenGrp(collName, obj, cb) {
        /**
         * LOGIC
         * find match -> required docs
         * then project -> generate n attach date with each item based on 'groupBy'/'interval'
         * then group -> with date as id and project required fields
         *
         * 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15
         * match -> 3 4 5 6 7 8 9 10 11 12
         * project -> 3.date = a, 4.date = a, 5.date = b, 6.date = b,
         * group($first) -> 3, 5
         */
        let self = this;
        let match = {};
        match[obj.key.name] = {
            $gte: obj.key.min,
            $lt: obj.key.max
        };
        let dateField = '$' + obj.key.name;
        if (obj.key.type.toLowerCase() == 'unix') {
            dateField = {
                $add: [new Date(0), "$" + obj.key.name]
            };
        }
        let project1 = {
            date: {
                $dateToString: {
                    format: self.getDateFormat(obj.groupBy),
                    date: dateField
                }
            }
        };
        obj.project.forEach((reqField) => {
            project1[reqField] = 1;
        });
        let group = {
            _id: '$date'
        };
        obj.project.forEach((reqField) => {
            group[reqField] = {};
            group[reqField][obj.groupLogic || "$first"] = "$" + reqField;
        });
        let aggregate = [
            { $match: match },
            { $project: project1 },
            { $group: group }
        ];
        let project2 = {};
        if (obj.key.type.toLowerCase() == 'unix') {
            project2[obj.key.name] = {
                $subtract: ['$_id', new Date(0)]
            };
            obj.project.forEach((reqField) => {
                project2[reqField] = 1;
            });
        }
        else {
            project2[obj.key.name] = '$_id';
            obj.project.forEach((reqField) => {
                project2[reqField] = 1;
            });
        }
        aggregate.push({ $project: project2 });
        this.sh_db.collection(collName).aggregate(aggregate, cb);
    }
    selectNinM(collName, obj, cb) {
        /**
         * LOGIC
         * match -> the required docs
         * then group -> to form an array of matched docs
         * then unwind -> to assign index to each doc
         * then project -> generate and attach 'n' which is computed using 'numOfPoints' to return
         * then group -> with n as _id to return 'numOfPoints' documents
         *
         * 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15
         * match -> 3 4 5 6 7 8 9 10 11 12 13
         * group -> {id: null, data: [3 4 5 6 7 8 9 10 11 12 13]}
         * unwind -> 3.index = 1, 4.index = 2 ...
         * project -> 3.nth = 1, 4.nth = 1, 5.nth = 2, 6.nth = 2 ...
         * group -> 3, 5, 7
         */
        let match = obj.query;
        let push = {};
        obj.project.forEach(key => {
            push[key] = '$' + key;
        });
        let group1 = {
            _id: null,
            data: {
                $push: push
            },
            count: {
                $sum: 1
            }
        };
        let unwind = {
            path: '$data',
            includeArrayIndex: 'index'
        };
        let project = {
            nth: {
                $floor: {
                    $divide: ['$index', {
                            $divide: ['$count', obj.numOfPoints]
                        }]
                }
            },
            data: 1
        };
        let group2 = {
            _id: '$nth',
        };
        group2.data = {};
        group2.data[obj.groupLogic] = '$data';
        let aggregate = [{
                $match: match
            }, {
                $group: group1
            }, {
                $unwind: unwind
            }, {
                $project: project
            }, {
                $group: group2
            }];
        this.sh_db.collection(collName).aggregate(aggregate, cb);
    }
}
exports.HelperMongo = HelperMongo;