









var sh_mongo = require('mongojs');

var HelperTransform = function(){
    return this;
}

HelperTransform.prototype.toLowerCase = function(data){
    return data.toLowerCase();
}

HelperTransform.prototype.toUpperCase = function(data){
    return data.toUpperCase();
}

HelperTransform.prototype.toMongoId = function(db, id){
    try {
        return sh_mongo.ObjectId(id);
    } catch(err) {
        return null;
    }
}

HelperTransform.prototype.toInt = function(data){
    return parseInt(data);
}

HelperTransform.prototype.toFloat = function(data, dec){
    return parseFloat(data).toFixed(dec || 5);
}


module.exports = HelperTransform;