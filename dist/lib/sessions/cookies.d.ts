import { IMiddleware } from "../../lib.com";
export interface IUrl {
    url: string;
    method: string;
}
export interface IPassportOptions {
    successRedirect: string;
    failureRedirect: string;
    failureFlash?: boolean;
}
export interface ICookieOptions {
    collName: string;
    connStr: string;
    login: IPassportOptions;
    register: IPassportOptions;
    cookie: Object;
    secret: string;
    redisStore: Object;
    passportSerializer?: (user, cb) => void;
    passportDeserializer?: (userId, cb) => void;
    passportLogin?: (req, email, passport, cb) => void;
    passportRegister?: (req, email, passport, cb) => void;
}
export interface ICookie {
    login(): IMiddleware;
    register(): IMiddleware;
    logout(): IMiddleware;
    validate(whitelist?: (string | IUrl)[], failureRedirect?: string): IMiddleware;
}
export declare class Cookie implements ICookie {
    private options;
    private db;
    private logger;
    private helperResp;
    private helper;
    private store;
    private session;
    private passport;
    private app;
    constructor(options: ICookieOptions, debug?: boolean);
    login(): IMiddleware;
    register(): IMiddleware;
    validate(whitelist?: (string | IUrl)[], failureRedirect?: string): IMiddleware;
    logout(): IMiddleware;
    private configureSession(app);
    private configurePassport(passport);
}
