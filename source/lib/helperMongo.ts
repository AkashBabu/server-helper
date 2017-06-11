import * as sh_mongo from "mongojs"
import * as sh_async from "async"
import * as sh_Logger from "logger-switch"

import { ICallback } from "../lib.com"

export interface IMongoDoc {
    _id: string;
    utime: Date;
}

export interface IKey {
    name: string;
    type: string;
    min: Date | number;
    max: Date | number;
}

export interface IValidationObject {
    query?: object;
    errMsg?: string;
}

export interface IValidationOnUpdate extends IValidationObject {
    name: string;
}
export interface ISplitTimeThenGrp {
    key: IKey;
    groupBy?: string;
    groupLogic?: string;
    interval?: number;
    intervalUnits?: string;
    project: string[];
}
export interface ISelectNinM {
    groupLogic?: string;
    project: string[];
    numOfPoints: number;
    query: object;
}

export interface IGetList {
    query?: object | string;
    project?: object | string;
    sort?: object | string;
    recordsPerPage?: number | string;
    pageNo?: number | string;
    search?: string;
    searchField?: string;
}
export interface IMaxValue {
    query?: object;
    unwind?: object;
    key: string;
    maxValue?: number;
    minValue?: number;
    errMsg?: string
}
export interface IHelperMongo {
    getDateFormat(groupBy: string): string;
    validateExistence(collName: string, validate: object, cb: Function): void;
    validateNonExistence(collName: string, validate: IValidationObject | IValidationObject[], cb: Function): void;
    validateNonExistenceOnUpdate(collName: string, obj: object | object[], validations: IValidationOnUpdate[] | IValidationOnUpdate, cb: Function): void;
    getById(collName: string, id: string, cb: Function): void;
    getMaxValue(collName: string, obj: object, cb: Function): void;
    getNextSeqNo(collName: string, obj: object, cb: Function): void;
    update(collName: string, obj: object, cb: Function): void;
    getList(collName: string, obj: object, cb: Function): void;
    remove(collName: string, id: string, removeDoc: boolean, cb: Function): void;
    splitTimeThenGrp(collName: string, obj: ISplitTimeThenGrp, cb: Function): void;
    selectNinM(collName: string, obj: ISelectNinM, cb: Function): void;
}

export class HelperMongo implements IHelperMongo {
    private logger = new sh_Logger("sh-mongo")
    private db;
    constructor(connStr: string, debug: boolean) {

        this.db = sh_mongo(connStr);

        this.logger[debug ? "activate" : "deactivate"]();
        return this;
    }
    /**
     * @description Returns Groupby which can be used in Mongo functions
     * @param  {string} group_by
     * @returns string
     */
    public getDateFormat(groupBy: string): string {
        let format = "%Y-%m-%d";
        switch (groupBy || "") {
            case "year":
                format = "%Y"
                break;

            case "day":
                format = "%Y-%m-%d"
                break;

            case "month":
                format = "%Y-%m"
                break;

            case "day":
                format = "%Y-%m-%d"
                break;

            case "hour":
                format = "%Y-%m-%dT%H"
                break;

            case "min":
                format = "%Y-%m-%dT%H:%M"
                break;

            case "sec":
                format = "%Y-%m-%dT%H:%M:%S"
                break;

            case "milli":
                format = "%Y-%m-%dT%H:%M:%S.%L"
                break;

            default:
                format = "%Y-%m-%d"
        }
        return format;
    }
    public validateExistence(collName: string, validate: any, cb: Function): void {
        this.db.collection(collName).findOne(validate.query || validate, function (err, result) {
            if (!result) {
                cb(validate.errMsg || "Document Does not Exist")
            } else {
                cb(err, result);
            }
        });
    }
    public validateNonExistence(collName: string, validations: any, cb: ICallback): void {

        // if(this.isValidateObject(validations)) {
        //     validations = [validations];
        // }
        if (!Array.isArray(validations)) {
            validations = [validations]
        }

        sh_async.everySeries(
            validations,
            (condition: IValidationObject, cb1) => {
                this.db.collection(collName).findOne(condition.query || condition, (err, result) => {
                    if (result) {
                        cb1(condition.errMsg || "Duplicate Document")
                    } else {
                        cb1(err, !result);
                    }
                })
            },
            (err, done) => {
                cb(err, done);
            }
        )
    }

    public validateNonExistenceOnUpdate(collName: string, obj: IMongoDoc, validations: any, cb: Function): void {
        let id;
        try {
            id = this.db.ObjectId(obj._id);
        } catch (err) {
            return cb("Invalid Id")
        }

        // if (this.isValidationOnUpdate(validations)) {
        //     validations = [validations];
        // }
        if (!Array.isArray(validations)) {
            validations = [validations];
        }

        let dbOperations = 0;

        sh_async.autoInject({
            getExistingObj: (cb1) => {
                this.db.collection(collName).findOne({
                    _id: id
                }, cb1);
            },
            compareWithNewObj: (getExistingObj, cb1) => {
                if (getExistingObj) {
                    sh_async.each(
                        validations,
                        (field: IValidationOnUpdate, cb2) => {
                            if (getExistingObj[field.name] != obj[field.name]) {
                                dbOperations += 1;
                                let mongoQuery = {};
                                mongoQuery[field.name] = obj[field.name];
                                if (field.query) {
                                    mongoQuery = field.query;
                                }
                                this.db.collection(collName).findOne(mongoQuery, {
                                    _id: 1
                                }, function (err, result) {
                                    if (result) {
                                        cb2(field.errMsg ? field.errMsg : "Duplicate " + field.name)
                                    } else {
                                        cb2(err, !result);
                                    }
                                })
                            } else {
                                cb2(null, true);
                            }
                        }, cb1);
                } else {
                    cb1("Non Existing _id")
                }
            }
        }, function (err, results) {
            cb(err, dbOperations);
        })
    }
    public getById(collName: string, id: string, cb: ICallback): void {
        try {
            id = this.db.ObjectId(id);
        } catch (err) {
            return cb("Invalid Id")
        }

        this.db.collection(collName).findOne({
            _id: id
        }, cb)
    }
    public getMaxValue(collName: string, obj: IMaxValue, cb: Function): void {
        /**
         * Flow 
         * match -> unwind(optional) -> group (To find max)
         */

        let group = {
            _id: null,
            sno: {
                $max: "$" + obj.key
            }
        }

        let aggregate: Array<object> = [
            { $match: obj.query || {} }
        ]
        if (obj.unwind) { // Use aggregate only when unwind is specified
            aggregate.push({
                "$unwind": obj.unwind[0] == "$" ? obj.unwind : "$" + obj.unwind
            })
        }
        aggregate.push({
            "$group": group
        })
        this.db.collection(collName).aggregate(aggregate, (err, result) => {
            if (!err) {
                if (result && result[0]) {
                    cb(null, result[0].sno);
                } else {
                    cb(null, 0);
                }
            } else {
                cb(err);
            }
        });
    }
    public getNextSeqNo(collName: string, obj: IMaxValue, cb: Function): void {
        this.getMaxValue(collName, obj, (err, result) => {
            if (!err) {
                let sno = result + 1;
                if (obj.maxValue && sno > obj.maxValue) {
                    let i = (obj.hasOwnProperty("minValue") ? obj.minValue : 1);
                    let found = false;
                    let find = Object.assign({}, obj.query);
                    sh_async.whilst(
                        () => {
                            if (i > obj.maxValue) {
                                return false;
                            }
                            return !found;
                        },
                        (cb1) => {
                            find[obj.key] = i;
                            this.db.collection(collName).findOne(find, function (err1, result1) {
                                if (!result1) {
                                    found = true;
                                } else {
                                    i++;
                                }
                                cb1(err1, result1);
                            })
                        },
                        function (err1, n) {
                            if (found) {
                                cb(err1, i);
                            } else {
                                cb(obj.errMsg || "Could not Get Next Sequence Number", null);
                            }
                        })
                } else {
                    if (obj.minValue && sno < obj.minValue) {
                        sno = obj.minValue;
                    }
                    cb(err, sno);
                }
            } else {
                cb(err, null);
            }
        })
    }
    public update(collName: string, obj: IMongoDoc, cb: Function): void {
        let id;
        try {
            id = this.db.ObjectId(obj._id);
        } catch (err) {
            return cb("Invalid Id");
        }
        delete obj._id;
        obj.utime = new Date();

        this.db.collection(collName).update({
            _id: id
        }, {
                $set: obj
            }, {
                upsert: false,
                multi: false,
            }, cb);
    }
   
    public getList(collName: string, obj: IGetList, cb: Function): void {
        obj = obj || {};
        obj.query = this.getObj(obj.query);
        obj.project = this.getObj(obj.project);
        obj.sort = this.getObj(obj.sort, true);

        if (obj.search) {
            let regex = new RegExp(".*" + obj.search + ".*", "i");
            (obj.query)[obj.searchField || "name"] = {
                $regex: regex
            }
        }

        sh_async.autoInject({
            getCount: (cb1) => {
                this.db.collection(collName).find(obj.query).count(cb1);
            },
            getList: (cb1) => {
                if (obj.recordsPerPage) {
                    let limit = parseInt(obj.recordsPerPage.toString());
                    let skip = (parseInt(obj.pageNo ? obj.pageNo.toString() : "1") - 1) * limit;

                    this.db.collection(collName).find(obj.query, obj.project)
                        .sort(obj.sort)
                        .skip(skip)
                        .limit(limit, cb1);
                } else {
                    this.db.collection(collName).find(obj.query, obj.project)
                        .sort(obj.sort, cb1);
                }
            }
        }, function (err, results) {
            cb(err, {
                count: results.getCount,
                list: results.getList
            })
        })
    }
    public remove(collName: string, id: string, removeDoc: boolean | Function, cb?: Function): void {

        try {
            id = this.db.ObjectId(id);
        } catch (err) {
            return cb("Invalid Id");
        }

        if (!cb && typeof removeDoc == "function") {
            cb = removeDoc;
            removeDoc = true;
        }

        if (removeDoc) {
            this.db.collection(collName).remove({
                _id: id
            }, cb);
        } else {
            this.db.collection(collName).update({
                _id: id
            }, {
                    $set: {
                        isDeleted: true,
                        deltime: new Date()
                    }
                }, {
                    multi: false,
                    upsert: false
                }, cb);
        }
    }
    public splitTimeThenGrp(collName: string, obj: ISplitTimeThenGrp, cb: Function): void {
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
        }

        let dateField: string | object = "$" + obj.key.name;
        if (obj.key.type.toLowerCase() == "unix") {
            dateField = {
                $add: [new Date(0), "$" + obj.key.name]
            }
        }

        let project1 = {
            date: {
                $dateToString: {
                    format: self.getDateFormat(obj.groupBy),
                    date: dateField
                }
            }
        }
        obj.project.forEach((reqField: string) => {
            project1[reqField] = 1
        })

        let group = {
            _id: "$date"
        };
        obj.project.forEach((reqField) => {
            group[reqField] = {}
            group[reqField][obj.groupLogic || "$first"] = "$" + reqField;
        })

        let aggregate: object[] = [
            { $match: match },
            { $project: project1 },
            { $group: group }
        ]

        let project2 = {}
        if (obj.key.type.toLowerCase() == "unix") {
            project2[obj.key.name] = {
                $subtract: ["$_id", new Date(0)]
            }
            obj.project.forEach((reqField: string) => {
                project2[reqField] = 1
            })

        } else {
            project2[obj.key.name] = "$_id";
            obj.project.forEach((reqField: string) => {
                project2[reqField] = 1
            })
        }
        aggregate.push({ $project: project2 });

        this.db.collection(collName).aggregate(aggregate, cb);
    }
    public selectNinM(collName: string, obj: ISelectNinM, cb: Function): void {
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
        obj.project.forEach((key) => {
            push[key] = "$" + key;
        })

        let group1 = {
            _id: null,
            data: {
                $push: push
            },
            count: {
                $sum: 1
            }
        }

        let unwind = {
            path: "$data",
            includeArrayIndex: "index"
        }

        let project = {
            nth: {
                $floor: {
                    $divide: ["$index", {
                        $divide: ["$count", obj.numOfPoints]
                    }]
                }
            },
            data: 1
        }

        let group2: any = {
            _id: "$nth",
        }
        group2.data = {}
        group2.data[obj.groupLogic] = "$data";

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
        }]

        this.db.collection(collName).aggregate(aggregate, cb);
    }


    private isValidationOnUpdate(data: IValidationOnUpdate | IValidationOnUpdate[]): data is IValidationOnUpdate {
        return (<IValidationOnUpdate[]>data).length !== undefined;
    }

    private isValidateObject(data: IValidationObject | IValidationObject[]): data is IValidationObject {
        return (<IValidationObject[]>data).length !== undefined;
    }
     private getObj(data: string | object, sort?: boolean): object {
        if (data) {
            if (typeof data == "string") {
                try {
                    data = JSON.parse(data);
                    return <object>data;
                } catch (err) {
                    this.logger.error(err);
                    if (sort == true) {
                        data = data.replace(/ /g, "");
                        if (data[0] == "-") {
                            let val = data.slice(1);
                            data = {};
                            data[val] = -1;
                        } else {
                            let val = data
                            data = {};
                            data[val] = 1;
                        }
                        return data;
                    } else {
                        return {};
                    }
                }
            }
            return data;
        }
        return {}
    }
}