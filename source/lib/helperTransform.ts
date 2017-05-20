import * as sh_mongo from "mongojs"
import * as sh_Chance from "chance"
import * as sh_crypto from "crypto"
import * as sh_S from "string"
import * as moment from "moment"
import * as sh_Logger from 'logger-switch'

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
    sh_logger = new sh_Logger("sh-transform")
    sh_chance = new sh_Chance();
    constructor(debug: boolean) {
        this.sh_logger[debug ? 'activate' : 'deactivate']();
    }

    toLowerCase(data: string): string {
        return data.toLowerCase();
    }
    toUpperCase(data: string): string {
        return data.toUpperCase();
    }
    toMongoId(id: string): object {
        try {
            return sh_mongo.ObjectId(id);
        } catch (err) {
            this.sh_logger.error(err)
            return null;
        }
    }
    toDate(dateStr: string): Date {
        return new Date(dateStr)
    }
    toMoment(dateStr: string): object {
        try {
            return moment(dateStr)
        } catch (err) {
            this.sh_logger.error(err)
            return null
        }
    }
    toInt(data: string): number {
        return parseInt(data);
    }
    toFloat(data: string, dec?: number): number {
        return parseFloat(parseFloat(data).toFixed(dec || 5));
    }
    toSaltHash(pwd: string): string {
        var salt = this.sh_chance.string({
            length: 16,
            pool: 'abcde1234567890'
        });
        var salted = salt + sh_crypto.createHmac('sha256', salt).update(pwd).digest('hex')
        return salted;
    }
    stripXss(str: string): string {
        if (str.constructor == String)
            return str.replace(/(<.*>(.*)<\/?.*>)/, "");
        else {
            this.sh_logger.error("Invalid Type for stripXss");
            return "";
        }
    }
}