var Crud = function(crud) {
    var router = require('express').Router();
    router.post('/', crud.insert || notFound);
    router.get('/list', crud.list || notFound);
    router.get('/:id', crud.get || notFound);
    router.put('/', crud.update || notFound);
    router.delete('/:id', crud.delete || notFound);

    // this.router = ;
    return router;
}

function notFound(req, res, next) {
    res.status(404).send({
        error: true,
        data: 'Not Found'
    })
}

module.exports = Crud;
