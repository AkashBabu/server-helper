const crypto = require('crypto');
const Chance = require('chance');
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


helper.appendCtime = function(obj) {
    if (obj && obj.constructor == Object) {
        obj.ctime = new Date();
    } else {
        throw new Error('wrong input');
    }
}

helper.appendUtime = function(obj) {
    if (obj && obj.constructor == Object) {
        obj.utime = new Date();
    } else {
        throw new Error('wrong input');
    }
}

helper.updateUtime = function(obj) {
    if (obj && obj.constructor == Object && obj.utime) {
        obj.utime = new Date();
    } else {
        throw new Error('wrong input');
    }
}

helper.convertToObjectQuery = function(prefix, obj){
  var query = {};
  for(var key in obj){
    query[prefix + key] = obj[key];
  }
  return query;
}

helper.validateFieldsExistence = function(obj, fields) {
    if (obj && fields && obj.constructor == Object && fields.constructor == Array) {
        for (var field of fields) {
            if (!obj[field]) {
                return false;
            }
        }
        return true;
    } else {
        throw new Error('wrong inputs');
    }
}

helper.validateFieldsExistenceStrict = function(obj, fields) {
    if (obj && fields && obj.constructor == Object && fields.constructor == Array) {
        var arr1 = Object.keys(obj);
        var arr2 = fields;
        if (arr1.length != arr2.length) {
            return false;
        }
        return arr1.every(val => {
            return arr2.indexOf(val) > -1 ? true : false;
        })
    } else {
        throw new Error('wrong inputs');
    }
}

helper.saltHash = function(pwd, minLength, maxLength) {
    if (pwd) {
        if (pwd < (minLength || 6)) {
            throw new Error('password too short');
        } else if (pwd > (maxLength || 20)) {
            throw new Error('password too long');
        } else {
            var salt = chance.string({
                length: 15
            });
            return {
                salt: salt,
                hash: crypto.createHmac('sha256', salt).update(pwd).digest('hex')
            }
        }
    } else {
        throw new Error('Password not passed');
    }
}

helper.verifySaltHash = function(salted, pwd) {
    if (salted && salted.constructor == Object && salted.salt && salted.hash) {
        if (pwd && pwd.constructor == String) {
            var thisHash = crypto.createHmac('sha256', salted.salt).update(pwd).digest('hex');
            return (salted.hash == thisHash);
        } else {
            throw new Error('Invalid second argument');
        }
    } else {
        throw new Error('Invalid first argument');
    }
}


module.exports = helper;
