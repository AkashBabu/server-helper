const crypto = require('crypto');
const Chance = require('chance');
var helperResp = require('./helperResp');
var chance = new Chance();
var helper = {};

helper.getDateFormat = function(group_by) {
    var format = "%Y-%m-%d";
    switch (group_by || '') {
        case 'year':
            format = "%Y"
            break;

        case 'month':
            format = "%Y-%m"
            break;

        case 'hour':
            format = "%Y-%m-%dT%H"
            break;

        case 'day':
            format = "%Y-%m-%d"
            break;

        default:
            format = "%Y-%m-%d"
    }
    return format;
}

helper.prefixToQueryObject = function(prefix, obj){
  var query = {};
  for(var key in obj){
    query[prefix + key] = obj[key];
  }
  return query;
}

helper.validateFieldNamesExistence = function(obj, fieldNames, strict) {
    if(strict && (Object.keys(obj).length != fieldNames.length)){
        return false;
    }

    return fieldNames.every(fieldName => {
        return obj[fieldName];
    })
}

helper.validateFieldsExistence = function(obj, fieldSpecs, strict){
    if(strict && (Object.keys(obj).length != fieldSpecs.length)){
        return false;
    }

    return fieldSpecs.every(fieldSpec => {
        return obj[fieldSpec.name]

        && obj[fieldSpec.name].constructor == fieldSpec.type
    })
}

helper.saltHash = function(pwd, minLength, maxLength) {
    var salt = chance.string({
        length: 16,
        pool: 'abcde1234567890'
    });
    console.log(salt + crypto.createHmac('sha256', salt).update(pwd).digest('hex'));
    return salt + crypto.createHmac('sha256', salt).update(pwd).digest('const crypto = require('crypto');
const Chance = require('chance');
var helperResp = require('./helperResp');
var chance = new Chance();
var helper = {};

helper.getDateFormat = function(group_by) {
    var format = "%Y-%m-%d";
    switch (group_by || '') {
        case 'year':
            format = "%Y"
            break;

        case 'month':
            format = "%Y-%m"
            break;

        case 'hour':
            format = "%Y-%m-%dT%H"
            break;

        case 'day':
            format = "%Y-%m-%d"
            break;

        default:
            format = "%Y-%m-%d"
    }
    return format;
}

helper.prefixToQueryObject = function(prefix, obj){
  var query = {};
  for(var key in obj){
    query[prefix + key] = obj[key];
  }
  return query;
}

helper.validateFieldNamesExistence = function(obj, fieldNames, strict) {
    if(strict && (Object.keys(obj).length != fieldNames.length)){
        return false;
    }

    return fieldNames.every(fieldName => {
        return obj[fieldName];
    })
}

helper.validateFieldsExistence = function(obj, fieldSpecs, strict){
    if(strict && (Object.keys(obj).length != fieldSpecs.length)){
        return false;
    }

    return fieldSpecs.every(fieldSpec => {
        return obj[fieldSpec.name]
        && obj[fieldSpec.name].constructor == fieldSpec.type
    })
}

helper.saltHash = function(pwd, minLength, maxLength) {
    var salt = chance.string({
        length: 16,
        pool: 'abcde1234567890'
    });
    console.log(salt + crypto.createHmac('sha256', salt).update(pwd).digest('hex'));
    return salt + crypto.createHmac('sha256', salt).update(pwd).digest('hex')
}

helper.verifySaltHash = function(salted, pwd) {
    var hashed = {
        salt: salted.slice(0,16),
        hash: salted.slice(16)
    }

    var thisHash = crypto.createHmac('sha256', hashed.salt).update(pwd).digest('hex');
    return (hashed.hash == thisHash);
}

helper.handleResult = function(err, result){
    console.log('In Handle Result:', err, result);
    if(!err && result){
        helperResp.sendOk(this, result);
    } else {
        helperResp.sendError(this, err ? err.code: result);
    }
}


module.exports = helper;
hex') 
}

helper.verifySaltHash = function(salted, pwd) {
    var hashed = {
        salt: salted.slice(0,16),
        hash: salted.slice(16)
    }

    var thisHash = crypto.createHmac('sha256', hashed.salt).update(pwd).digest('hex');
    return (hashed.hash == thisHash);
}

helper.handleResult = function(res, err, result){
    if(!err && result){
        helperResp.sendOk(res, result);
    } else {
        helperResp.sendError(res, err ? err.code: result);
    }
}


module.exports = helper;
