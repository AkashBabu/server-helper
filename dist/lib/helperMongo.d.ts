import { ICallback } from "../lib.com";
export interface IMongoDoc {
    _id: string;
    utime: Date;
}
export interface IValidationNonExistence {
    query: object;
    errMsg?: string;
}
export interface IValidationNonExistenceUpdate {
    name: string;
    query?: object;
    errMsg?: string;
}
export interface IKey {
    name: string;
    type: string;
    min: Date | number;
    max: Date | number;
}
export interface ISplitTimeThenGrp {
    key: IKey;
    project: string[];
    groupBy?: string;
    groupLogic?: string;
    interval?: number;
    intervalUnits?: string;
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
    validateNonExistence(collName: string, validate: IValidationNonExistence | IValidationNonExistence[], cb: Function): void;
    validateNonExistenceOnUpdate(collName: string, obj: object | object[], validations: IValidationNonExistenceUpdate[] | IValidationNonExistenceUpdate, cb: Function): void;
    getById(collName: string, id: string, cb: Function): void;
    getNextSeqNo(collName: string, obj: object, cb: Function): void;
    update(collName: string, obj: object, exclude?: string[], cb?: Function): void;
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
    /**
     * Validates if there is any document matching the given query
     * @param collName collection name
     * @param validate find() query
     * @param cb callback
     */
    validateExistence(collName: string, validate: any, cb: Function): void;
    /**
     * Validate non existence for all the given validations
     * @param collName collection name
     * @param validations
     * @param cb
     */
    validateNonExistence(collName: string, validations: IValidationNonExistence | IValidationNonExistence[], cb: ICallback): void;
    /**
     * Validates that the updated document does not collide with unique fields in the collection
     * @param collName collection name
     * @param obj Updated document
     * @param validations
     * @param cb Callback
     */
    validateNonExistenceOnUpdate(collName: string, obj: IMongoDoc, validations: IValidationNonExistenceUpdate | IValidationNonExistenceUpdate[], cb: Function): void;
    /**
     * Get the document that matches the given id
     * @param collName collection name
     * @param id mongoDB document id
     * @param cb
     */
    getById(collName: string, id: string, cb: ICallback): void;
    /**
     * Get the max value of a numerical field in a collection
     * @param collName collection name
     * @param obj options
     * @param cb Callback
     */
    private getMaxValue(collName, obj, cb);
    /**
     * Get the next sequence number of a numerical field in a collection
     * @param collName collection name
     * @param obj options
     * @param cb Callback
     */
    getNextSeqNo(collName: string, obj: IMaxValue, cb: Function): void;
    /**
     * Updates the document excluding the specified fields from the object
     * @param collName collection name
     * @param obj Mongo Document
     * @param exclude fields to be excluded
     * @param cb Callback
     */
    update(collName: string, obj: IMongoDoc, exclude?: string[], cb?: Function): void;
    /**
     * Get a list of documents in a collection - can be used for CRUD - list apis
     * @param collName collection name
     * @param obj options
     * @param cb Callback
     */
    getList(collName: string, obj: IGetList, cb: Function): void;
    /**
     * Removes a document/sets isDeleted flag on the document
     * @param collName collection name
     * @param id mongoDb document id
     * @param removeDoc document will be removed if true, else will set isDeleted flag on the document
     * @param cb Callback
     */
    remove(collName: string, id: string, removeDoc: boolean | Function, cb?: Function): void;
    /**
     * Splits the selected range of documents by time and then groups them based on grouping logic
     * @param collName collection name
     * @param obj options
     * @param cb Callback
     */
    splitTimeThenGrp(collName: string, obj: ISplitTimeThenGrp, cb: Function): void;
    /**
     * Selects n number of documents from m range of selected documents based on grouping logic
     * @param collName collection name
     * @param obj options
     * @param cb Callback
     */
    selectNinM(collName: string, obj: ISelectNinM, cb: Function): void;
    private isValidationOnUpdate(data);
    private isValidateObject(data);
    private getObj(data, sort?);
}
