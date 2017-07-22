/*
////////////////////////////////////
// UTILS
////////////////////////////////////
 */
var appUtils = Object.create(null);
(function () {
    appUtils.Class = function (parent) {
        var klass = function () {
            this.$_buildObject.apply(this, arguments);
        };
        // object builder
        klass.prototype.$_buildObject = function () {
        };
        // ref to parent klass
        klass.prototype.$_parentKlass = klass;
        // object field
        klass.prototype.$_fd = Object.create(null);
        // object method
        klass.prototype.$_mthd = Object.create(null);

        //************************************
        // Сокращенная форма записи для доступа к прототипу:

        // prototype есть только в функции
        // При создании объекта через new, в его прототип __proto__ записывается ссылка из prototype
        klass.fn = klass.prototype;
        /*klass._super = klass.__proto__;*/
        //************************************
        var installSettersGettersForKey = function (key) {
            klass.fn["get" + appUtils.ucFirst(key)] = function () {
                /*Замыкание — это особенный вид объекта, который сочетает две вещи:
                 функцию и окружение, в котором функция была создана.
                 Окружение состоит из любой локальной переменной, которая была
                 в области действия функции во время создания замыкания.*/
                return this.$_fd[key]
            };
            klass.fn["set" + appUtils.ucFirst(key)] = function (value) {
                this.$_fd[key] = value
            };
        };
        var installSettersGetters = function () {
            var fdObj = klass.prototype.$_fd;
            for (var key in fdObj) {
                installSettersGettersForKey(key);
            }
        };

        // Изменение прототипа для klass
        if (parent) {
            var subclass = function () {
            };
            subclass.prototype = parent.prototype;
            klass.prototype = new subclass;
            klass.prototype.$_parentKlass = parent;
            // extends parent field
            klass.prototype.$_fd = parent.prototype.$_fd;
            installSettersGetters();
            // extends parent method
            klass.prototype.$_mthd = parent.prototype.$_mthd;
            // call parent builder ToDo error in prototype builder because coll after object generate
            // parent.prototype.$_buildObject.apply(this, arguments);
        }

        //Добавление свойств класса
        klass.extend = function (obj) {
            var extended = obj.extended;
            for (var key in obj) {
                klass[key] = obj[key];
            }
            if (extended) extended(klass);
        };

        //Добавление методов экземпляра
        klass.includeMthd = function (obj) {
            var included = obj.included;
            for (var key in obj) {
                klass.fn.$_mthd[key] = obj[key];
            }
            if (included) included(klass);
        };
        //Добавление полей экземпляра
        klass.includeFd = function (obj) {
            var included = obj.included;
            for (var key in obj) {
                klass.fn.$_fd[key] = obj[key];

                installSettersGettersForKey(key);
            }
            if (included) included(klass);
        };
        klass.includeDefineFd = function (key, desc) {
            var description = {
                enumerable: true,
                get: function () {
                    return "" + this.$_fd.name;
                }
            };
            if (desc.enumerable) {
                description.enumerable = desc.enumerable;
            }
            if (desc.get) {
                description.get = desc.get;
            }

            Object.defineProperty(klass.fn.$_fd, key, description);
            installSettersGettersForKey(key)
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

var appORMModule = Object.create(null);
(function () {
    var Entity = new appUtils.Class();
    (function () {
        Entity.extend({
            includeEntityFd: function (fd, entityFd, defineFd) {
                var strEntityFd = "";
                this.includeFd({entityFd: ""});
                if (fd) {
                    this.includeFd(fd);
                }
                if (entityFd) {
                    this.includeFd(entityFd);
                    for (key in entityFd) {
                        strEntityFd = "" + strEntityFd + ", " + key;
                    }
                    if (strEntityFd.length > 0) strEntityFd.slice(2);
                    this.includeFd({entityFd: strEntityFd});
                }
                if (defineFd) {
                    for (key in defineFd) {
                        this.includeDefineFd(key, defineFd[key])
                    }
                }
            }
        });

        Entity.includeEntityFd(
            {
                // object field
                entityName: null
            }, {
                // entity field
                id: null,
                description: ""
            }, {
                // define field
                representation: {
                    enumerable: true,
                    get: function () {
                        if (this.name) {
                            return "" + this.name;
                        } else {
                            return "entity [" + this.entityName + "] id: " + this.id + "";
                        }
                    }
                }
            }
        );

        Entity.includeMthd({
            isEmpty: function () {
                // ToDo write what attribute of empty entity
                return this.$_fd.id == 0;
            },

            translateToEntityJSON: function () {
                var replacer = this.$_fd.entityFd.split(", ");
                return JSON.stringify(this.$_fd, replacer);
            }
        })
    })();

    var MetadataEditField = new appUtils.Class();
    (function () {
        MetadataEditField.includeFd({
            name: "",
            inputType: "text",
            label: "<--label for property-->",

            entityList: {},

            availability: true,
            visibility: true,
            availabilityInEditForm: true,
            visibilityInEditForm: true,
            availabilityInListForm: true,
            visibilityInListForm: true
        });
        MetadataEditField.includeMthd({
            buildEditField: function (name, inputType, label, availability, entityList) {
                this.$_fd.name = name;
                if (inputType != undefined) {
                    this.$_fd.inputType = inputType;
                }
                if (label != undefined) {
                    this.$_fd.label = label;
                } else {
                    this.$_fd.label = name;
                }
                if (availability != undefined) {
                    this.$_fd.availability = availability;
                }
                if (entityList != undefined) {
                    this.$_fd.entityList = entityList;
                }
            }
        })
    })();

    var MetadataObject = new appUtils.Class();
    (function () {
        MetadataObject.includeFd({
            entity: null,
            metadataName: "",

            representation: "",
            description: "",
            image: null,

            metadataEditFieldsSet: [],
            fmEditForm: {
                metadataEditFieldsSet:[]
            },
            fmListForm: {
                metadataEditFieldsSet:[],
                metadataFilterFieldsSet:[]
            }
        });

        MetadataObject.includeMthd({
            getNewInstance: function () {
                return null;
            },
            bookEntity: function (entity, fnGetNewInstance, representation, description, image) {
                this.$_fd.entity = entity;
                this.$_fd.metadataName = entity.prototype.$_fd.entityName;
                this.$_mthd.getNewInstance = fnGetNewInstance;

                if (representation) {
                    this.$_fd.representation = representation;
                }
                if (description) {
                    this.$_fd.description = description;
                }
                if (image) {
                    this.$_fd.image = image;
                }

            },

            bookEntityForms: function (_metadataEditFieldsSet, _metadataFilterFieldsSet) {
                var fmEditForm = this.getFmEditForm();
                var fmListForm = this.getFmListForm();
                var metadataEditFieldsSet = this.getMetadataEditFieldsSet();
                metadataEditFieldsSet = [];
                fmEditForm.metadataEditFieldsSet = [];
                fmListForm.metadataEditFieldsSet = [];
                fmListForm.metadataFilterFieldsSet = [];

                if (_metadataEditFieldsSet) {

                    for (var i = 0; i < _metadataEditFieldsSet.length; i++) {
                        var editField = _metadataEditFieldsSet[i];

                        if (editField.getAvailability()) {
                            metadataEditFieldsSet.push(editField);
                        }
                    }

                    for (var i = 0; i < metadataEditFieldsSet.length; i++) {
                        var editField = metadataEditFieldsSet[i];

                        if (editField.getAvailabilityInEditForm()){
                            fmEditForm.metadataEditFieldsSet.push(editField);
                        }
                        if (editField.getAvailabilityInListForm()){
                            fmListForm.metadataEditFieldsSet.push(editField);
                        }
                    }
                }
                if (_metadataFilterFieldsSet) {
                    for (var i = 0; i < _metadataEditFieldsSet.length; i++) {
                        var editField = _metadataEditFieldsSet[i];
                        if(appUtils.find(metadataEditFieldsSet, editField) > 0) {
                            fmListForm.metadataFilterFieldsSet.push(editField);
                        }
                    }
                }
            }
        })
    })();

    var MetadataSet = new appUtils.Class();
    (function () {
        MetadataSet.includeMthd({
            bookMetadataObject: function (metadataObject) {
                var metadataName = metadataObject.$_fd.metadataName;
                this.$_fd[metadataName] = metadataObject;
            },
            getMetadataObject: function (metadataName) {
                if (this.$_fd[metadataName]) {
                    return this.$_fd[metadataName];
                } else {
                    return undefined;
                }
            }
        })
    })();

    var EntityList = new appUtils.Class();
    (function () {
        EntityList.includeFd({
            list: []
        });

        EntityList.includeMthd({

            addEntity: function (entity) {

                var entityAdded = false;
                for (var index = 0; index < this.$_fd.list.length; ++index) {
                    var item = this.$_fd.list[index];
                    if (item.id === entity.id) {
                        this.$_fd.list[index] = entity;
                        entityAdded = true;
                        return;
                    }
                }
                if (!entityAdded) {
                    this.$_fd.list.push(entity);
                }
            },

            findEntityById: function (id) {
                for (var index = 0; index < this.$_fd.list.length; ++index) {
                    var item = this.$_fd.list[index];
                    if (item.id === id) {
                        return item;
                    }
                }
                return undefined;
            }
        })
    })();

    appORMModule.MetadataSet = MetadataSet;
    appORMModule.MetadataObject = MetadataObject;
    appORMModule.Entity = Entity;

    appORMModule.MetadataEditField = MetadataEditField;
})();

var appMetadataSet = new appORMModule.MetadataSet();
(function () {
    var Project = new appUtils.Class(appORMModule.Entity);
    (function () {
        // field
        Project.prototype.$_parentKlass.includeEntityFd(
            {
                // object field
                entityName: "project"
            }, {
                // entity field
                name: ""
        }
        );
    })();

    var metadataObjectProject = new appORMModule.MetadataObject();
    metadataObjectProject.$_mthd.bookEntity.call(metadataObjectProject, Project,
        function () {
            return new Project()
        },
        "Project",
        "List of projects");

    var Task = new appUtils.Class(appORMModule.Entity);
    (function () {
        // field
        Task.prototype.$_parentKlass.includeEntityFd(
            {
                // object field
                entityName: "task"
            }, {
                // entity field
                date: "",
                title: "",
                author: {},
                executor: [],
                project: {},
                state: "TODO"
            }, {
                // define field
                representation: {
                    enumerable: true,
                    get: function () {
                        return "" + this.date + " /" + this.title + "/ (" + this.description + ") ";
                    }
                }
            }
        );
    })();
    var metadataObjectTask = new appORMModule.MetadataObject();
    metadataObjectTask.$_mthd.bookEntity.call(metadataObjectTask, Task,
        function () {
            return new Task()
        },
        "Task",
        "Task list");

    var User = new appUtils.Class(appORMModule.Entity);
    (function () {
        // field
        User.prototype.$_parentKlass.includeEntityFd(
            {
                // object field
                entityName: "user"
            }, {
                // entity field
                username: "",
                password: "",
                mailAddress: "",
                role: [],
                enabled: true
            }, {
                // define field
                representation: {
                    enumerable: true,
                    get: function () {
                        return "" + this.username + " (" + this.description + ") ";
                    }
                }
            }
        );
    })();
    var metadataObjectUser = new appORMModule.MetadataObject();
    metadataObjectUser.$_mthd.bookEntity.call(metadataObjectUser, User,
        function () {
            return new User()
        },
        "User",
        "List of user");

    appMetadataSet.$_mthd.bookMetadataObject.call(appMetadataSet, metadataObjectProject);
    appMetadataSet.$_mthd.bookMetadataObject.call(appMetadataSet, metadataObjectTask);
    appMetadataSet.$_mthd.bookMetadataObject.call(appMetadataSet, metadataObjectUser);

    /*
     (function(){
     Persistent.include({

     createEntity: function (fCallBack) {
     var entityJSON = JSON.stringify(this, fReplacerForEntityParser);
     resourceService.getEntityEditService()
     .createEntity({entityName: this._entityName}, entityJSON,
     baseCreateEntity.bind(this, fCallBack),
     function (httpResponse) {
     */
    /*resourceService.collError(httpResponse)*/
    /*

     }
     )
     }
     });
     var baseCreateEntity = function () {
     var fCallBack = arguments[0];
     var data = arguments[1];

     if (data.result = 200) {
     var originalEntity = data.data;
     appUtils.fillValuesProperty(originalEntity, this);
     fCallBack(this);
     }
     };

     })(resourceService, dataStorage);
     */
})();

/*
 ////////////////////////////////////
 // Function for test and lorn class and prototype
 ////////////////////////////////////
 */

(function () {

    var o = {};
    var f = function () {
    };
    var map = Object.create(null);

    var Animal = new appUtils.Class();
    Animal.fn.$_buildObject = function () {
        appUtils.log("$_ Receive new instance for 'Animal' class")
    };
    Animal.extend({
        believe: function () {
            appUtils.log('верить');
        }
    });
    Animal.includeMthd({
        breath: function () {
            appUtils.log('дышать');
        }
    });

    var Cat = new appUtils.Class(Animal);
    Cat.fn.$_buildObject = function () {
        appUtils.log("$_ Receive new instance for 'Cat' class")
    };

    var tommy = new Cat();
    tommy.$_mthd.breath();
    tommy.$_parentKlass.believe();

    var metadataProject = appMetadataSet.$_mthd.getMetadataObject.call(appMetadataSet, "project");
    var project1 = metadataProject.$_mthd.getNewInstance.call(metadataProject);
    project1.setName("Family");

    appUtils.log(project1.getRepresentation());
    appUtils.log(project1.$_mthd.translateToEntityJSON.call(project1));

})();
