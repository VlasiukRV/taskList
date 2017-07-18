
////////////////////////////////////
// UTILS
////////////////////////////////////

/*

var ORMModule = {

    createEntity: function (resourceService, fCallBack) {
        var entityJSON = JSON.stringify(this, fReplacerForEntityParser);
        resourceService.getEntityEditService()
            .createEntity({entityName: this._entityName}, entityJSON,
            baseCreateEntity.bind(this, fCallBack),
            function (httpResponse) {
                */
/*resourceService.collError(httpResponse)*//*

            }
        )
    }
};
*/

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

var Class = function(parent){
    var klass = function(){
        this.init.apply(this, arguments);
    };

    // Изменение прототипа для klass
    if (parent){
        var subclass = function() {};
        subclass.prototype = parent.prototype;
        klass.prototype = new subclass()
    }

    klass.prototype.init = function(){};

    // Сокращенная форма записи для доступа к прототипу
    klass.fn = klass.prototype;
    klass.fn.parent = klass;
    klass._super = klass.__proto__;

    //Добавление свойств класса
    klass.extend = function(obj){
        var extended = obj.extended;
        for(var i in obj){
            klass[i] = obj[i];
        }
        if (extended) extended(klass);
    };

    //Добавление свойств экземпляра
    klass.include = function(obj){
        var included = obj.included;
        for(var i in obj){
            klass.fn[i] = obj[i];
        }
        if (included) included(klass);
    };

    return klass;
};

var Animal = new Class;
Animal.include({
    breath: function(){
        console.log('дыхание');
    }
});
var Cat = new Class(Animal);

var tommy = new Cat;
tommy.breath();