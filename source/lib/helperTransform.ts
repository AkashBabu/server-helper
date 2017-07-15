import * as sh_mongo from "mongojs"
import * as sh_Chance from "chance"
import * as sh_crypto from "crypto"
import * as sh_S from "string"
import * as moment from "moment"
import * as sh_Logger from "logger-switch"

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

export class HelperTransform implements IHelperTransform {
    private logger = new sh_Logger("sh-transform")
    private chance = new sh_Chance();
    constructor(debug: boolean) {
        this.logger[debug ? "activate" : "deactivate"]();

        return this;
    }

    /**
     * Transforms the given string to Lower Case
     * @param data Data to be transformed
     * 
     * @returns upperCased string
     */
    public toLowerCase(data: string): string {
        return data.toLowerCase();
    }

    /**
     * Transforms the given string to Upper Case
     * @param data Data to be transformed
     * 
     * @returns lowerCase string
     */
    public toUpperCase(data: string): string {
        return data.toUpperCase();
    }

    /**
     * Transforms mongo id to Mongo Object id
     * @param id Mongo Document id in string
     * 
     * @returns MongoObjectId
     */
    public toMongoId(id: string): object {
        try {
            return sh_mongo.ObjectId(id);
        } catch (err) {
            this.logger.error(err)
            return null;
        }
    }

    /**
     * Transforms the given string to Date Object
     * @param dateStr Date string
     * 
     * @returns Date Object
     */
    public toDate(dateStr: string): Date {
        return new Date(dateStr)
    }

    /**
     * Transforms the given string to moment object
     * @param dateStr Moment Date String
     * 
     * @returns moment object
     */
    public toMoment(dateStr: string): object {
        try {
            return moment(dateStr)
        } catch (err) {
            this.logger.error(err)
            return null
        }
    }

    /**
     * Parse string to number
     * @param data number in string
     * 
     * @returns parsed number
     */
    public toInt(data: string): number {
        return parseInt(data);
    }

    /**
     * Parses string to float
     * @param data float in string
     * @param dec decimal points
     * 
     * @return parsed float 
     */
    public toFloat(data: string, dec?: number): number {
        return parseFloat(parseFloat(data).toFixed(dec || 5));
    }

    /**
     * Adds salt and hashes the given the string
     * @param pwd Password
     * 
     * @return salth hashed password
     */
    public toSaltHash(pwd: string): string {
        let salt = this.chance.string({
            length: 16,
            pool: "abcde1234567890"
        });
        let salted = salt + sh_crypto.createHmac("sha256", salt).update(pwd).digest("hex")
        return salted;
    }

    /**
     * Removes all the html tags and the data inbetween the tags
     * @param str 
     * 
     * @return string without tags
     */
    public stripXss(str: string): string {
        if (typeof str == "string") {
            return str.replace(/(<.*>(.*)<\/?.*>)/, "");
        }
        else {
            this.logger.error("Invalid Type for stripXss");
            return "";
        }
    }
}