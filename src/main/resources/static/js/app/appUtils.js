
////////////////////////////////////
// UTILS
////////////////////////////////////

makeDate = function (milisecond) {
    return new Date(milisecond);
};

getClass = function (obj) {
    return {}.toString.call(obj).slice(8, -1);
};

fillValuesProperty = function fillValuesProperty(source, receiver) {
    for (var key in source) {
        if (!(key in receiver)) {
            continue;
        }
        if (key.indexOf("$$") >= 0){
            continue;
        }
        if (typeof source[key] == 'function'){
            continue;
        }

        if(angular.isArray(source[key])){
            receiver[key].fillByTemplate(source[key]);
        }else if (typeof source[key] === 'object') {
            fillValuesProperty(source[key], receiver[key]);
        }else{
            receiver[key] = source[key];
        }
    }
    return receiver;
};

clearProperties = function (o) {
    for (var key in o) {
        if (typeof o[key] === 'number') {
            o[key] = 0;
        } else if (typeof o[key] === 'string') {
            o[key] = "";
        } else if (typeof o[key] === 'boolean') {
            o[key] = false;
        } else if (this.getClass(o[key]) === 'Date') {
            o[key] = new Date();
        } else if (typeof o[key] === 'object') {
            this.clearProperties(o[key]);
        }
    }
};
