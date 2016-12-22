var helperValidate = {};









helperValidate.range = function(data, min, max){
    if(data >= min && data <= max){
        return true;
    } 
    return false;
}

helperValidate.isMongoId = function(id){
    try {
        db.ObjectId(id);
        return true;
    } catch(err){
        return false;
    }
}

helperValidate.isEmail = function(email){
    return /^([a-zA-Z0-9_]|\.)+@[a-zA-Z]*\.[a-z]*$/.test(email);
}

helperValidate.isAlpha = function(data){
    return /^[a-zA-Z ]+$/.test(data);
}

helperValidate.isNumeric = function(data){
    return /[0-9]+/.test(data);
}

helperValidate.isAlphaNumeric = function(data){
    return /[a-zA-Z0-9]+/.test(data);
}

helperValidate.isDate = function(dateStr){
    try {
        new Date(dateStr);
        return true;
    } catch (err) {
        return false;
    }
}

module.exports = helperValidate;