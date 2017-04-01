








var sh_Logger = require('logger-switch');
var sh_logger = new sh_Logger('sh-resp');

/**
 * Constructor
 */
var HelperResp = function(debug) {
    sh_logger[debug ? 'activate' : 'deactivate']();
    return this;
};

/**
 * Send Missing Fields as response
 */
HelperResp.prototype.sendMissingFields = function(res, comment) {
    res.status(400).send({
        error: true,
        data: comment || 'Required fields are missing'
    })
}

HelperResp.prototype.sendInvalidId = function(res, comment) {
    res.status(400).send({
        error: true,
        data: comment || "Invalid id"
    })
}

HelperResp.prototype.sendAccountNotSpecified = function(res, comment) {
    res.status(400).send({
        error: true,
        data: comment || 'Account not specified'
    })
}

HelperResp.prototype.sendAsyncResp = function(res, err, data) {
    res.status(err ? 400 : 200).send({
        error: !!err,
        data: err ? err.code : data
    })
}

HelperResp.prototype.sendNotFound = function(res, comment) {
    res.status(404).send({
        error: true,
        data: comment || 'Not Found'
    })
}

HelperResp.prototype.sendError = function(res, comment) {
    res.status(400).send({
        error: true,
        data: comment || "Error response"
    })
}

HelperResp.prototype.sendOk = function(res, comment) {
    res.status(200).send({
        error: false,
        data: comment || 'Success'
    })
}

HelperResp.sendServerError = function(res, comment){
    res.status(500).send("Internal Server Error\n" + (comment || ""))
}

HelperResp.prototype.handleResult = function (err, result) {
    var sh_helperResp = new HelperResp(true);
    if (result) {
        sh_helperResp.sendOk(this, result);
    } else {
        if (err) {
            sh_logger.error(err);
        }
        sh_helperResp.sendError(this, err ? err.code : result);
    }
}

module.exports = HelperResp;
