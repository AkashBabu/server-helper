import * as express from 'express'

export interface IHTTPResp {
    status(code: number): { send(data: any): void }
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

export class CRUD {
    constructor(crud: ICRUD) {
        let router = express.Router()
        router.route("/")
            .get(crud.list || this.next)
            .post(crud.create || this.next)
            .all(this.methodNotAllowed())

        router.route("/:id")
            .get(crud.get || this.next)
            .put(crud.update || this.next)
            .delete(crud.remove || this.next)
            .all(this.methodNotAllowed())

        return router;
    }


    private next(req, res, next) {
        console.log('Hit Next');
        next();
    }
    private methodNotAllowed(): IRestHandler {
        return function (req, res) {
            res.status(406).send({
                error: true,
                data: "Method Not Allowed"
            })
        }
    }
}