import * as sh_mongo from "mongojs"
import * as sh_moment from "moment"
import * as sh_Logger from "logger-switch"

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

export class HelperValidate implements IHelperValidate {
    private logger = new sh_Logger("sh-validate");
    constructor(debug: boolean) {
        this.logger[debug ? "activate" : "deactivate"]();
    }
    public range(data: number, min: number, max: number): boolean {
        if (data >= min && data <= max) {
            return true;
        }
        return false;
    }
    public length(data: string, min: number, max?: number): boolean {
        let len = data.length;
        if (max) {
            if (len >= min && len <= max) {
                return true;
            }
            return false;
        } else {
            return len >= min;
        }
    }
    public isMongoId(id: string): boolean {
        try {
            sh_mongo.ObjectId(id);
            return true;
        } catch (err) {
            return false;
        }
    }
    public in(data: any, arr: any[]): boolean {
        return (arr.indexOf(data) != -1);
    }
    public isName(name: string): boolean {
        return /^([a-zA-Z0-9]|[-_ ]|\.)+$/.test(name);
    }
    public isEmail(email: string): boolean {
        return /^([a-zA-Z0-9._%+-])+@[a-zA-Z.-]+\.[a-zA-Z]{2,}$/.test(email);
    }
    public isAlpha(data: string): boolean {
        return /^[a-zA-Z ]+$/.test(data);
    }
    public isNumeric(data: string): boolean {
        return /^[0-9.]+$/.test(data);
    }
    public isAlphaNumeric(data: string): boolean {
        return /^[a-zA-Z0-9]+$/.test(data);
    }
    public isDate(dateStr: string, format: string): boolean {
        return sh_moment(dateStr, format)._isValid;
    }
    public isRegex(data: string, regexStr: string): boolean {
        let regex = new RegExp(regexStr);
        return regex.test(data);
    }
}