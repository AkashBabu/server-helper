import * as sh_mongo from "mongojs"
import * as sh_moment from "moment"
import * as sh_Logger from "logger-switch"

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

export class HelperValidate implements IHelperValidate {
    private logger = new sh_Logger("sh-validate");
    constructor(debug: boolean) {
        this.logger[debug ? "activate" : "deactivate"]();

        return this;
    }

    /**
     * Validate the range of the number
     * @param data 
     * @param min lower limit
     * @param max upper limit
     * 
     * @returns isValid/not
     */
    public range(data: number, min: number, max: number): boolean {
        if (data >= min && data <= max) {
            return true;
        }
        return false;
    }

    /**
     * Validate the length of the string/array
     * @param data 
     * @param min Lower length limit
     * @param max Upper length limit
     * 
     * @returns isValid/not
     */
    public length(data: string | any[], min: number, max?: number): boolean {
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

    /**
     * Validates if the given string is a valid mongoId
     * @param id MongoDB Document _id
     * 
     * @returns isValid/not
     */
    public isMongoId(id: string): boolean {
        try {
            sh_mongo.ObjectId(id);
            return true;
        } catch (err) {
            return false;
        }
    }

    /**
     * Checks if the data is present in the given array
     * @param data 
     * @param arr 
     * 
     * @returns isValid/not
     */
    // TODO Add support for checking data if the type is Object or array
    public in(data: any, arr: any[]): boolean {
        if (Array.isArray(data)) {
            return arr.some(item => {
                if (Array.isArray(item)) {
                    if (data.length == item.length) {
                        return item.every(elem => data.indexOf(elem) > -1)
                    }
                    return false;
                }
                return false;
            })

        } else if (typeof data == 'object') {
            return arr.some(item => {
                if (typeof item == 'object') {
                    return Object.keys(item).every(key => item[key] == data[key])
                }
                return false;
            })
        }
        return (arr.indexOf(data) != -1);
    }

    /**
     * validate if the given string matches the Name format 
     * @param name 
     * 
     * @returns isValid/not
     */
    public isName(name: string): boolean {
        return /^([a-zA-Z0-9]|[-_ ]|\.)+$/.test(name);
    }

    /**
     * validate if the given string matches the Eamil format 
     * @param email 
     * 
     * @returns isValid/not
     */
    public isEmail(email: string): boolean {
        return /^([a-zA-Z0-9._%+-])+@[a-zA-Z.-]+\.[a-zA-Z]{2,}$/.test(email);
    }

    /**
     * validate if the given string contains only Alphabets
     * @param data 
     * 
     * @returns isValid/not
     */
    public isAlpha(data: string): boolean {
        return /^[a-zA-Z ]+$/.test(data);
    }

    /**
     * validate if the given string contains only numbers
     * @param data 
     * 
     * @returns isValid/not
     */
    public isNumeric(data: string): boolean {
        return /^[0-9.]+$/.test(data);
    }

    /**
     * validate if the given string is Alphabets and numbers
     * @param data 
     * 
     * @returns isValid/not
     */
    public isAlphaNumeric(data: string): boolean {
        return /^[a-zA-Z0-9]+$/.test(data);
    }

    /**
     * Validate if the given string is in Data format
     * @param dateStr 
     * @param format Moment date format
     * 
     * @returns isValid/not
     */
    public isDate(dateStr: string, format: string): boolean {
        return sh_moment(dateStr, format)._isValid;
    }

    /**
     * Check if the data matches the regexStr pattern
     * @param data 
     * @param regexStr 
     * 
     * @returns isValid/not
     */
    public isRegex(data: string, regexStr: string): boolean {
        let regex = new RegExp(regexStr);
        return regex.test(data);
    }
}