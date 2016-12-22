var helperTransform = {};









helperTransform.toLowerCase = function(data){
    return data.toLowerCase();
}

helperTransform.toUpperCase = function(data){
    return data.toUpperCase();
}

helperTransform.toMongoId = function(db, id){
    try {
        return db.ObjectId(id);
    } catch(err) {
        return null;
    }
}

helperTransform.toInt = function(data){
    return parseInt(data);
}

helperTransform.toFloat = function(data, dec){
    return parseFloat(data).toFixed(dec || 5);
}


module.exports = helperTransform;