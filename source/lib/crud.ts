import * as express from "express"

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
    public router;
    constructor(crud: ICRUD) {
        this.router = express.Router({mergeParams: true})
        this.router.route("/")
            .get(crud.list || this.next)
            .post(crud.create || this.next)
            // .all(this.methodNotAllowed())

        this.router.route("/:id")
            .get(crud.get || this.next)
            .put(crud.update || this.next)
            .delete(crud.remove || this.next)
            // .all(this.methodNotAllowed())

        return this.router;
    }


    private next(req, res, next) {
        next();
    }
    private methodNotAllowed(): IRestHandler {
        return function (req, res) {
            res.status(405).send({
                error: true,
                data: "Method Not Allowed"
            })
        }
    }
}