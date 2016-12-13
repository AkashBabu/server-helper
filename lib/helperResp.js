









var helperResp = {};


helperResp.sendMissingFields = function(res, comment) {
    res.status(400).send({
        error: true,
        data: comment || 'Required fields are missing'
    })
}

helperResp.sendInvalidId = function(res, comment) {
    res.status(400).send({
        error: true,
        data: comment || "Invalid id"
    })
}

helperResp.sendAccountNotSpecified = function(res, comment) {
    res.status(400).send({
        error: true,
        data: comment || 'Account not specified'
    })
}

helperResp.sendAsyncResp = function(res, err, data) {
    res.status(err ? 400 : 200).send({
        error: !!err,
        data: err ? err.code : data
    })
}

helperResp.sendNotFound = function(res, comment) {
    res.status(404).send({
        error: true,
        data: comment || 'Not Found'
    })
}

helperResp.sendError = function(res, comment){
    res.status(400).send({
        error: true,
        data: comment || "Error response"        
    })
}

helperResp.sendOk = function(res, comment){
    res.status(200).send({
        error: false,
        data: 'Success'
    })
}

module.exports = helperResp;
