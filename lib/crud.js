









var Crud = function (crud) {
    var router = require('express').Router();
    
    router.route('/')
        .get(crud.list || next)
        .post(crud.create || next)
        .all(methodNotAllowed())

    router.route('/:id')
        .get(crud.get || next)
        .put(crud.update || next)
        .delete(crud.remove || next)
        .all(methodNotAllowed())

    return router;
}

function methodNotAllowed() {
    return function (req, res, next) {
        res.status(406).send({
            error: true,
            data: "Method Not Allowed"
        })
    }
}

function next(req, res, next) {
    next();
}

module.exports = Crud;
