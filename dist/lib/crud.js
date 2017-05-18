"use strict";
const express = require('express');
class CRUD {
    constructor(crud) {
        let router = express.Router();
        router.route("/")
            .get(crud.list || this.next)
            .post(crud.create || this.next)
            .all(this.methodNotAllowed());
        router.route("/:id")
            .get(crud.get || this.next)
            .put(crud.update || this.next)
            .delete(crud.remove || this.next)
            .all(this.methodNotAllowed());
        return router;
    }
    next(req, res, next) {
        console.log('Hit Next');
        next();
    }
    methodNotAllowed() {
        return function (req, res) {
            res.status(406).send({
                error: true,
                data: "Method Not Allowed"
            });
        };
    }
}
exports.CRUD = CRUD;
