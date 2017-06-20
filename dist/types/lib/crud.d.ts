export interface IHTTPResp {
    status(code: number): {
        send(data: any): void;
    };
}
export interface IRestHandler {
    (req: object, res: IHTTPResp, next?: Function): void;
}
export interface ICRUD {
    create: IRestHandler;
    update: IRestHandler;
    remove: IRestHandler;
    get: IRestHandler;
    list: IRestHandler;
}
export declare class CRUD {
    router: any;
    constructor(crud: ICRUD);
    private next(req, res, next);
    private methodNotAllowed();
}
