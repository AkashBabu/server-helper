"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
class CRUD {
    constructor(crud) {
        this.router = express.Router({ mergeParams: true });
        this.router.route("/")
            .get(crud.list || this.next)
            .post(crud.create || this.next);
        // .all(this.methodNotAllowed())
        this.router.route("/:id")
            .get(crud.get || this.next)
            .put(crud.update || this.next)
            .delete(crud.remove || this.next);
        // .all(this.methodNotAllowed())
        return this.router;
    }
    next(req, res, next) {
        next();
    }
    methodNotAllowed() {
        return function (req, res) {
            res.status(405).send({
                error: true,
                data: "Method Not Allowed"
            });
        };
    }
}
exports.CRUD = CRUD;
