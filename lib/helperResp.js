var Logger = require('logger-switch');
var logger = new Logger('sh-Resp');
var HelperResp = function(debug) {

    // this.logger = new Logger('sh-Mongo');
    logger[debug ? 'activate' : 'deactivate']();
    return this;
};


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

HelperResp.prototype.sendUnauth = function(res, comment) {
  res.status(401).send({
      error: true,
      data: comment || 'Unauthorized'
  })
}

HelperResp.sendServerError = function(res, comment){
    res.status(500).send("Internal Server Error\n" + (comment || ""))
}

module.exports = HelperResp;
