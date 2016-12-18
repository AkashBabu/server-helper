









var Crud = function(crud) {
    var router = require('express').Router();
    router.route('/')
        .get(crud.list || next)
        .post(crud.create || next)

    router.route('/:id')
        .get(crud.get || next)
        .put(curd.update || next)
        .delete(crud.remove || next)
        
    return router;
}

function next(req, res, next){
    next();
}

// function notFound(req, res, next) {
//     res.status(404).send({
//         error: true,
//         data: 'Not Found'
//     })
// }

module.exports = Crud;
