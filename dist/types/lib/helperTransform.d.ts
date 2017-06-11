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
