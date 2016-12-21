









var Crud = function(crud) {
    var router = require('express').Router();
    // router.get('/list', )
    router.route('/')
        .get(crud.list || next)
        .post(crud.create || next)

    router.route('/:id')
        .get(crud.get || next)
        .put(crud.update || next)
        .delete(crud.remove || next)

    return router;
}

function next(req, res, next){
    next();
}

module.exports = Crud;
