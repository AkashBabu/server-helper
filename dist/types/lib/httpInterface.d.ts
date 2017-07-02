export interface IOperation {
    method: string;
    api: string;
}
export interface ICollProvider {
    name: string;
    operations: IOperation[];
}
export interface IDBProvider {
    url?: string;
    host?: string;
    port?: string | number;
    dbName?: string;
}
export interface IConfig {
    collections?: ICollProvider[];
    db?: IDBProvider;
}
export interface IExpressMiddleware {
    (req: any, res: any, next?: Function): void;
}
export declare class HTTPInterface {
    private config;
    router: any;
    private db;
    private helperResp;
    private logger;
    private helperMongo;
    constructor(config: IConfig, debug?: boolean);
    private processConfiguration();
    private configureRoutes();
    private getCollNames();
    private validateMiddleware();
    private createHandler();
    private getHandler();
    private listHandler();
    private updateHandler();
    private removeHandler();
}
