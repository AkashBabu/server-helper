export interface IHelperTransform {
    toLowerCase(data: string): string;
    toUpperCase(data: string): string;
    toMongoId(id: string): object;
    toDate(dateStr: string): Date;
    toMoment(dateStr: string): object;
    toInt(data: string): number;
    toFloat(data: string, dec?: number): number;
    toSaltHash(pwd: string): string;
    stripXss(str: string): string;
}
export declare class HelperTransform implements IHelperTransform {
    private logger;
    private chance;
    constructor(debug: boolean);
    /**
     * Transforms the given string to Lower Case
     * @param data Data to be transformed
     *
     * @returns upperCased string
     */
    toLowerCase(data: string): string;
    /**
     * Transforms the given string to Upper Case
     * @param data Data to be transformed
     *
     * @returns lowerCase string
     */
    toUpperCase(data: string): string;
    /**
     * Transforms mongo id to Mongo Object id
     * @param id Mongo Document id in string
     *
     * @returns MongoObjectId
     */
    toMongoId(id: string): object;
    /**
     * Transforms the given string to Date Object
     * @param dateStr Date string
     *
     * @returns Date Object
     */
    toDate(dateStr: string): Date;
    /**
     * Transforms the given string to moment object
     * @param dateStr Moment Date String
     *
     * @returns moment object
     */
    toMoment(dateStr: string): object;
    /**
     * Parse string to number
     * @param data number in string
     *
     * @returns parsed number
     */
    toInt(data: string): number;
    /**
     * Parses string to float
     * @param data float in string
     * @param dec decimal points
     *
     * @return parsed float
     */
    toFloat(data: string, dec?: number): number;
    /**
     * Adds salt and hashes the given the string
     * @param pwd Password
     *
     * @return salth hashed password
     */
    toSaltHash(pwd: string): string;
    /**
     * Removes all the html tags and the data inbetween the tags
     * @param str
     *
     * @return string without tags
     */
    stripXss(str: string): string;
}
