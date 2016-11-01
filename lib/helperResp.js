var helperResp = {};


helperResp.sendMissingFields = function(res) {
    res.status(400).send({
        error: true,
        data: 'Required fields are missing'
    })
}

helperResp.sendInvalidId = function(res) {
    res.status(400).send({
        error: true,
        data: "Invalid id"
    })
}

helperResp.sendAccountNotSpecified = function(res) {
    res.status(400).send({
        error: true,
        data: 'Account not specified'
    })
}

helperResp.sendAsyncResp = function(res, err, data) {
    res.status(err ? 400 : 200).send({
        error: !!err,
        data: err ? err.code : data
    })
}

helperResp.sendNotFound = function(res) {
    res.status(404).send({
        error: true,
        data: 'Not Found'
    })
}

module.exports = helperResp;
