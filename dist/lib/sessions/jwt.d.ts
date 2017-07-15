import { IMiddleware } from "../../lib.com";
export interface IUrl {
    url: string;
    method: string;
}
export interface IJWTOptions {
    collName: string;
    connStr: string;
    secret: string;
    validity: number;
    login?: (user, cb) => void;
    register?: (user, cb) => void;
    validate?: (user, cb) => void;
}
export interface IJWT {
    login: () => IMiddleware;
    register: () => IMiddleware;
    validate: (whitelist?: (string | IUrl)[]) => IMiddleware;
}
export declare class JWT implements IJWT {
    private options;
    private db;
    private helper;
    private helperResp;
    private logger;
    constructor(options: IJWTOptions, debug?: boolean);
    /**
     * Login Handler
     */
    login(): IMiddleware;
    /**
     * Registration handler
     */
    register(): IMiddleware;
    /**
     * Validation handler
     * @param {string=} whitelist - Whitelisted url, that dont need authentication
     */
    validate(whitelist?: (string | IUrl)[]): IMiddleware;
    private isUndefined(data);
    private isDefined(data);
    private sendToken(res, user);
}
