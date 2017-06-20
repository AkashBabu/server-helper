import { ICallback } from "../lib.com";
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
    errMsg?: string;
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
export declare class HelperMongo implements IHelperMongo {
    private logger;
    private db;
    constructor(connStr: string, debug: boolean);
    /**
     * @description Returns Groupby which can be used in Mongo functions
     * @param  {string} group_by
     * @returns string
     */
    getDateFormat(groupBy: string): string;
    validateExistence(collName: string, validate: any, cb: Function): void;
    validateNonExistence(collName: string, validations: any, cb: ICallback): void;
    validateNonExistenceOnUpdate(collName: string, obj: IMongoDoc, validations: any, cb: Function): void;
    getById(collName: string, id: string, cb: ICallback): void;
    getMaxValue(collName: string, obj: IMaxValue, cb: Function): void;
    getNextSeqNo(collName: string, obj: IMaxValue, cb: Function): void;
    update(collName: string, obj: IMongoDoc, cb: Function): void;
    getList(collName: string, obj: IGetList, cb: Function): void;
    remove(collName: string, id: string, removeDoc: boolean | Function, cb?: Function): void;
    splitTimeThenGrp(collName: string, obj: ISplitTimeThenGrp, cb: Function): void;
    selectNinM(collName: string, obj: ISelectNinM, cb: Function): void;
    private isValidationOnUpdate(data);
    private isValidateObject(data);
    private getObj(data, sort?);
}
