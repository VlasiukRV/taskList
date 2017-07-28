/*
 ////////////////////////////////////
 // UTILS
 ////////////////////////////////////
 */
var appUtils = Object.create(null);
(function () {
    appUtils.Class = function (Parent) {

        // prototype есть только в функции
        // При создании объекта через new, в его прототип __proto__ записывается ссылка из prototype

        var klass = function () {
            if (Parent) {
                // call object builder of parent
                Parent.prototype.$_buildObject.call(this, {});
            }
            // call object builder
            this.$_buildObject();
        };
        // object builder
        klass.prototype.$_buildObject = function () {
        };

        if (Parent) {
            // Inherit
            klass.prototype = Object.create(Parent.prototype);

            // save parent
            klass.prototype.$_parentClass = Parent;
        }

        // Add methods, fields for Klass
        klass.extend = function (obj) {
            var extended = obj.extended;
            for (var key in obj) {
                klass[key] = obj[key];

                installSettersGettersForKey(key);
            }
            if (extended) extended(klass);
        };

        // Add methods for object
        klass.includeMthd = function (obj) {
            var included = obj.included;
            for (var key in obj) {
                klass.prototype[key] = obj[key];
                /*
                 // Вызов метода родителя у метода потомка
                 klass.prototype.run = function () {
                 // Вызов метода родителя внутри своего
                 Parent.prototype.run.apply(this);
                 // реализация метода
                 };
                 */
            }
            if (included) included(klass);
        };
        // Add fields for object
        klass.prototype.includeFd = function (obj) {
            var included = obj.included;
            for (var key in obj) {
                this[key] = obj[key];
            }
            if (included) included(klass);
        };
        // Add define fields for object
        klass.prototype.includeDefineFd = function (key, desc) {
            var description = {
                configurable: true,
                enumerable: true,
                get: function () {
                    return "";
                }
            };
            if (desc.enumerable) {
                description.enumerable = desc.enumerable;
            }
            if (desc.get) {
                description.get = desc.get;
            }

            Object.defineProperty(this, key, description);
        };

        return klass;
    };

    appUtils.makeDate = function (millisecond) {
        return new Date(millisecond);
    };

    appUtils.getClass = function (obj) {
        return {}.toString.call(obj).slice(8, -1);
    };

    appUtils.fillValuesProperty = function (source, receiver) {
        for (var key in source) {
            var sourceProperty = source[key];
            if (!(key in receiver)) {
                continue;
            }
            if (key.indexOf("$$") >= 0) {
                continue;
            }
            if (typeof sourceProperty == 'function') {
                continue;
            }

            if (angular.isArray(sourceProperty)) {
                receiver[key].fillByTemplate(sourceProperty);
            } else if (typeof sourceProperty === 'object') {
                appUtils.fillValuesProperty(sourceProperty, receiver[key]);
            } else {
                receiver[key] = sourceProperty;
            }
        }
        return receiver;
    };

    appUtils.clearProperties = function (o) {
        for (var key in o) {
            var property = o[key];
            if (typeof property === 'number') {
                property = 0;
            } else if (typeof property === 'string') {
                property = "";
            } else if (typeof property === 'boolean') {
                property = false;
            } else if (this.getClass(property) === 'Date') {
                property = new Date();
            } else if (typeof property === 'object') {
                this.clearProperties(property);
            }
        }
    };

    if ([].indexOf) {
        appUtils.find = function (array, value) {
            return array.indexOf(value);
        };
    } else {
        appUtils.find = function (array, value) {
            for (var i = 0; i < array.length; i++) {
                if (array[i] === value) return i;
            }
            return -1;
        };
    }

    appUtils.ucFirst = function (str) {
        if (!str) return str;
        return str[0].toUpperCase() + str.slice(1);
    };

    appUtils.log = function () {
        if (typeof console == "undefined") return;

        var args = jQuery.makeArray(arguments);
        args.unshift("(App:)");
        console.log.apply(console, args);
    }
})();
