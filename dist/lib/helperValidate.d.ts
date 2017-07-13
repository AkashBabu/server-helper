export interface IHelperValidate {
    range(data: number, min: number, max: number): boolean;
    length(data: string, min: number, max?: number): boolean;
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
    range(data: number, min: number, max: number): boolean;
    length(data: string, min: number, max?: number): boolean;
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
