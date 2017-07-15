export interface IHelperValidate {
    range(data: number, min: number, max: number): boolean;
    length(data: string | any[], min: number, max?: number): boolean;
    isMongoId(id: string): boolean;
    in(data: any, arr: any[]): boolean;
    isName(name: string): boolean;
    isEmail(email: string): boolean;
    isAlpha(data: string): boolean;
    isNumeric(data: string): boolean;
    isAlphaNumeric(data: string): boolean;
    isDate(dateStr: string, format: string): boolean;
    isRegex(data: string, regexStr: string): boolean;
}
export declare class HelperValidate implements IHelperValidate {
    private logger;
    constructor(debug: boolean);
    /**
     * Validate the range of the number
     * @param data
     * @param min lower limit
     * @param max upper limit
     *
     * @returns isValid/not
     */
    range(data: number, min: number, max: number): boolean;
    /**
     * Validate the length of the string/array
     * @param data
     * @param min Lower length limit
     * @param max Upper length limit
     *
     * @returns isValid/not
     */
    length(data: string | any[], min: number, max?: number): boolean;
    /**
     * Validates if the given string is a valid mongoId
     * @param id MongoDB Document _id
     *
     * @returns isValid/not
     */
    isMongoId(id: string): boolean;
    /**
     * Checks if the data is present in the given array
     * @param data
     * @param arr
     *
     * @returns isValid/not
     */
    in(data: any, arr: any[]): boolean;
    /**
     * validate if the given string matches the Name format
     * @param name
     *
     * @returns isValid/not
     */
    isName(name: string): boolean;
    /**
     * validate if the given string matches the Eamil format
     * @param email
     *
     * @returns isValid/not
     */
    isEmail(email: string): boolean;
    /**
     * validate if the given string contains only Alphabets
     * @param data
     *
     * @returns isValid/not
     */
    isAlpha(data: string): boolean;
    /**
     * validate if the given string contains only numbers
     * @param data
     *
     * @returns isValid/not
     */
    isNumeric(data: string): boolean;
    /**
     * validate if the given string is Alphabets and numbers
     * @param data
     *
     * @returns isValid/not
     */
    isAlphaNumeric(data: string): boolean;
    /**
     * Validate if the given string is in Data format
     * @param dateStr
     * @param format Moment date format
     *
     * @returns isValid/not
     */
    isDate(dateStr: string, format: string): boolean;
    /**
     * Check if the data matches the regexStr pattern
     * @param data
     * @param regexStr
     *
     * @returns isValid/not
     */
    isRegex(data: string, regexStr: string): boolean;
}
