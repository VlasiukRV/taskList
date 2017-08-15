
var appInterface = Object.create(null);

(function (appInterface){

    var Interface = appUtils.Class();
    (function () {
        Interface.prototype.$_buildObject = function () {
            this.includeFd({

                commandBar: {
                    mainUrl: '#',
                    commandBar: new MenuCommand()
                }

            });
        };
        Interface.includeMthd({
            commandBarSetMainUrl: function (mainUrl){
                this.commandBar.mainUrl = mainUrl;
                return this;
            },
            commandBarAddCommand: function(command){
                this.commandBar.commandList.push(command);
                return this;
            }
        })
    }());

    var MenuCommand = appUtils.Class();
    (function(){
        MenuCommand.prototype.$_buildObject = function(){
            this.includeFd({
                commandName: "",

                dropdownMenu: false,
                text: "",
                command: null,
                commandList: []
            })
        };
        MenuCommand.includeMthd({
            addCommand: function(command){
                this.commandList.push(command);
                return this;
            },
            getSubMenu: function(commandName){
                for(var i=0; this.commandList.length; i++){
                    var currentCommand = this.commandList[i];
                    if (currentCommand.commandName === commandName){
                        return currentCommand;
                    }
                    if(currentCommand.commandList.length > 0){
                        return currentCommand.getSubMenu(commandName);
                    }
                }
                return undefined;
            }
        });

    }());

    appInterface.Interface = Interface;
    appInterface.getNewEntityCommand = function(commandName, text){
        var command = new MenuCommand();
        command.dropdownMenu = false;
        command.commandName = commandName;
        command.text = text;
        command.command = commandName;

        return command;
    };
    appInterface.getNewDropdownCommand = function(commandName, text){
        var command = new MenuCommand();
        command.dropdownMenu = true;
        command.commandName = commandName;
        command.text = text;
        return command;
    };
    appInterface.getNewCommand = function(commandName, text, functionCommand){
        var command = new MenuCommand();
        command.dropdownMenu = false;
        command.commandName = commandName;
        command.text = text;
        command.command = functionCommand;

        return command;
    };

}(appInterface));

var appORMModule = Object.create(null);
(function (appORMModule, appInterface) {
    appORMModule.resourceService = undefined;

    var MetadataEvents = appUtils.Class();
    (function (){
        MetadataEvents.prototype.$_buildObject = function () {
            this.includeFd({
                events: $({})
            });
        };
        MetadataEvents.includeMthd({
            subscribe: function(){
                this.events.bind.apply(this.events, arguments);
            },
            unSubscribe: function(){
                this.events.unbind.apply(this.events, arguments);
            },
            publish: function(){
                this.events.trigger.apply(this.events, arguments);
            }
        });
    })();
    var metadataEventsImpl = new MetadataEvents();

    var Entity = appUtils.Class();
    (function () {
        Entity.prototype.includeEntityFd = function (fd, entityFd, defineFd) {
            var strEntityFd = "";
            this.includeFd({entityFd: ""});
            if (fd) {
                this.includeFd(fd);
            }
            if (entityFd) {
                this.includeFd(entityFd);
                for (var key in entityFd) {
                    strEntityFd = "" + strEntityFd + ", " + key;
                }
                if (strEntityFd.length > 0) strEntityFd = strEntityFd.slice(2);
                this.includeFd({entityFd: strEntityFd});
            }
            if (defineFd) {
                for (var key in defineFd) {
                    this.includeDefineFd(key, defineFd[key])
                }
            }
        };

        Entity.prototype.$_buildObject = function () {
            this.includeEntityFd(
                {
                    // object field
                    metadataName: ""
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
                                return "entity [" + this.metadataName + "] id: " + this.id + "";
                            }
                        }
                    }
                }
            );

        };

        Entity.includeMthd({
            isEmpty: function () {
                // ToDo write what attribute of empty entity
                return this.id == 0 || this.id == null;
            },

            translateToEntityJSON: function () {
                var replacer = this.entityFd.split(", ");
                return JSON.stringify(this, replacer);
            },

            createEntity: function (fCallBack) {
                if (!this.metadataName) {

                }
                var entityJSON = this.translateToEntityJSON();
                appORMModule.resourceService.getEntityEditService().createEntity(
                    {entityName: this.metadataName}, entityJSON,
                    baseCreateEntity.bind(this, fCallBack),
                    function (httpResponse) {
                        /*resourceService.collError(httpResponse)*/
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
    })();

    var EntityList = appUtils.Class();
    (function () {
        EntityList.prototype.$_buildObject = function () {
            this.includeFd(
                {
                    metadataName: "",
                    list: [],
                    metadataObject: null
                });
        };
        var updateEnt = function (fCallBack, data) {
/*
            var fCallBack = arguments[0];
            var data = arguments[1];
*/

            if (data.result = 200) {
                var originalUserList = data.data;

                originalUserList.forEach(function (item, i, arr) {
                    var entity = this.metadataObject.getEntityInstance();
                    appUtils.fillValuesProperty(item, entity);
                    this.addEntity(entity);
                }, this);
            }

            if(fCallBack) {
                fCallBack(this);
            }
        };

        var deleteEnt = function () {
            var id = arguments[0];
            var fCallBack = arguments[1];
            var data = arguments[2];

            if (data.result = 200) {
                this.list.forEach(function (item, i) {
                    if (item.id == id) {
                        this.list.splice(i, 1);
                        return true;
                    }
                }, this);
            }

            if(fCallBack) {
                fCallBack(this);
            }
        };

        EntityList.includeMthd({
            addEntity: function (entity) {
                var entityAdded = false;
                for (var index = 0; index < this.list.length; ++index) {
                    var item = this.list[index];
                    if (item.id === entity.id) {
                        this.list[index] = entity;
                        entityAdded = true;
                        return;
                    }
                }
                if (!entityAdded) {
                    this.list.push(entity);
                }
            },
            findEntityById: function (id) {
                for (var index = 0; index < this.list.length; ++index) {
                    var item = this.list[index];
                    if (item.id === id) {
                        return item;
                    }
                }
                return undefined;
            },
            addEntityByTemplate: function (template, fCallBack) {
                var entity = null;
                if (template.isEmpty()) {
                    entity = this.metadataObject.getEntityInstance(this.metadataName);
                } else {
                    entity = this.findEntityById(template.id);
                }

                var entityList = this;
                appUtils.fillValuesProperty(template, entity);
                entity.createEntity(function (data) {
                    entityList.addEntity(data);
                    fCallBack();
                });
            },
            update: function (fCallBack) {
                var self = this;
                self.list = [];
                appORMModule.resourceService.getEntityEditService()
                    .getEntity({entityName: this.metadataName}, {},
                    function (data){
                        updateEnt.call(self, fCallBack, data)
                    },
                        function (httpResponse) {
                            /*resourceService.collError(httpResponse)*/
                        }
                );
            },
            deleteEntity: function (id, fCallBack) {
                appORMModule.resourceService.getEntityEditService()
                    .deleteEntity({entityName: this.metadataName, entityId: id}, {},
                    deleteEnt.bind(this, id, fCallBack),
                    function (httpResponse) {
                        /*resourceService.collError(httpResponse)*/
                    }
                )
            }

        })
    })();

    var Enum = appUtils.Class();
    (function () {
        Enum.prototype.$_buildObject = function () {
            this.includeFd(
                {
                    metadataName: "",
                    list: {}
                });
        };

        Enum.includeMthd({
            update: function () {
                var source = this;
                appORMModule.resourceService.getEntityEditService()
                    .getEntity({entityName: "enum", entityId: this.metadataName}, {},
                    function (data) {
                        source.list = data.data;
                    },
                    function (httpResponse) {
                        /*resourceService.collError(httpResponse)*/
                    }
                );
            }
        });

    })();

    var MetadataEditField = appUtils.Class();
    (function () {
        MetadataEditField.prototype.$_buildObject = function () {
            this.includeFd({
                name: "",
                inputType: "text",
                label: "<--label for property-->",

                entityListService: {},

                availability: true,

                visibility: true,
                availabilityInEditForm: true,
                visibilityInEditForm: true,
                availabilityInListForm: true,
                visibilityInListForm: true
            })
        };
        MetadataEditField.includeMthd({
            buildEditField: function (fieldDescription, name) {
                if (name) {
                    this.name = name;
                } else {
                    if (fieldDescription.name) {
                        this.name = fieldDescription.name;
                    }
                }
                if (fieldDescription.inputType) {
                    this.inputType = fieldDescription.inputType;
                }
                if (fieldDescription.label) {
                    this.label = fieldDescription.label;
                } else {
                    this.label = this.name;
                }
                if (fieldDescription.availability) {
                    this.availability = fieldDescription.availability;
                }
                if (fieldDescription.entityListService) {
                    this.entityListService = fieldDescription.entityListService;
                }
            }
        })
    })();

    var MetadataObject = appUtils.Class();
    (function () {
        MetadataObject.prototype.$_buildObject = function () {
            this.includeFd({
                metadataName: "",

                representation: "",
                description: "",
                image: null,

                metadataEditFieldsSet: [],
                fmEditForm: {
                    metadataEditFieldsSet: []
                },
                fmListForm: {
                    metadataEditFieldsSet: [],
                    metadataFilterFieldsSet: []
                }
            })
        };
        MetadataObject.includeMthd({
            getEntityInstance: function () {
                return null;
            },
            installMetadata: function (metadataName, fnGetEntityInstance, representation, description, image) {
                this.metadataName = metadataName;
                this.getEntityInstance = fnGetEntityInstance;

                if (representation) {
                    this.representation = representation;
                }
                if (description) {
                    this.description = description;
                }
                if (image) {
                    this.image = image;
                }

            },
            bookEntityForms: function (_metadataEditFieldsSet, _metadataFilterFieldsSet) {

                if (_metadataEditFieldsSet) {
                    var editField = undefined;

                    for (var i = 0; i < _metadataEditFieldsSet.length; i++) {
                        editField = _metadataEditFieldsSet[i];

                        if (editField.availability) {
                            this.metadataEditFieldsSet.push(editField);
                        }
                    }

                    for (var i = 0; i < this.metadataEditFieldsSet.length; i++) {
                        editField = this.metadataEditFieldsSet[i];

                        if (editField.availabilityInEditForm) {
                            this.fmEditForm.metadataEditFieldsSet.push(editField);
                        }
                        if (editField.availabilityInListForm) {
                            this.fmListForm.metadataEditFieldsSet.push(editField);
                        }
                    }
                }
                if (_metadataFilterFieldsSet) {
                    for (var i = 0; i < _metadataEditFieldsSet.length; i++) {
                        editField = _metadataEditFieldsSet[i];
                        /*if (appUtils.find(this.fmListForm.metadataEditFieldsSet, editField) > 0) {*/
                        this.fmListForm.metadataFilterFieldsSet.push(editField);
                        /*}*/
                    }
                }
            }
        })
    })();

    var MetadataSet = appUtils.Class();
    (function () {
        MetadataSet.prototype.$_buildObject = function () {
            this.includeFd({
                // entities
                entityList: Object.create(null),
                metadataEvents: metadataEventsImpl,

                // interface
                interface: new appInterface.Interface()
            });
        };
        MetadataSet.includeMthd({
            installMetadataObjectEnum: function(metadataEnumSpecification){
            var EnumClass = metadataEnumSpecification.enumClass;
            var metadataSet = this;

            metadataSet.bookEntityList(EnumClass);
            // event
            metadataSet.metadataEvents.subscribe("ev:entityList:" +metadataEnumSpecification.metadataName+ ":update",
                function(event, fCallBack){
                    EnumClass.update(fCallBack)
                }
            );

            return metadataSet;
            },
            installMetadataObjectEntity:function (entitySpecification) {
                var metadataSet = this;
                var EntityClass = entitySpecification.entityClass;

                var metadataEntitySpecification = new MetadataEntitySpecification();
                metadataEntitySpecification.metadataName = entitySpecification.metadataName;
                metadataEntitySpecification.metadataRepresentation = entitySpecification.metadataRepresentation;
                metadataEntitySpecification.metadataDescription = entitySpecification.metadataDescription;

                appUtils.fillAllValuesProperty(entitySpecification.entityField.entityField, metadataEntitySpecification.entityField.entityField);
                appUtils.fillAllValuesProperty(entitySpecification.entityField.objectField, metadataEntitySpecification.entityField.objectField);
                metadataEntitySpecification.entityField.defineField = entitySpecification.entityField.defineField;


                metadataEntitySpecification.entityField.entityField.id = {
                    value: "",
                    fieldDescription: {
                        inputType: "text",
                        label: "id",
                        availability: true,
                        entityListService: null
                    }
                };
                metadataEntitySpecification.entityField.entityField.description = {
                    value: "",
                    fieldDescription: {
                        inputType: "textarea",
                        label: "description",
                        availability: true,
                        entityListService: null
                    }
                };

                (function () {
                    // field
                    EntityClass.prototype.$_buildObject = function () {
                        this.includeEntityFd(
                            metadataEntitySpecification.getObjectFields(),
                            metadataEntitySpecification.getEntityFields(),
                            metadataEntitySpecification.entityField.defineField
                        );
                    };
                })();

                var entityList = new EntityList();
                entityList.metadataName = metadataEntitySpecification.metadataName;

                var metadataObject = new appORMModule.MetadataObject();

                metadataObject.installMetadata(metadataEntitySpecification.metadataName,
                    entitySpecification.fnGetEntityInstance,
                    metadataEntitySpecification.metadataRepresentation,
                    metadataEntitySpecification.metadataDescription
                );

                var metadataEditFieldsSet = metadataEntitySpecification.getEntityFieldsDescription();
                metadataObject.bookEntityForms(metadataEditFieldsSet);

                metadataSet.bookMetadataObject(metadataObject);
                metadataSet.bookEntityList(entityList);

                // event
                metadataEventsImpl.subscribe("ev:entityList:" +metadataEntitySpecification.metadataName+ ":update",
                    function(event, fCallBack){
                        entityList.update(fCallBack)
                    }
                );
                metadataEventsImpl.subscribe("ev:entityList:" +metadataEntitySpecification.metadataName+ ":deleteEntity",
                    function(event, id, fCallBack){
                        entityList.deleteEntity(id, fCallBack);
                    }
                );

                // EditMenu
                var entitySubMenu = metadataSet.interface.commandBar.commandBar.getSubMenu('modelDD');
                if(entitySubMenu != undefined){
                    entitySubMenu.addCommand(appInterface.getNewEntityCommand(entitySpecification.metadataName, entitySpecification.metadataRepresentation))
                }

                return metadataSet;
            },
            getInterface: function (){
                this.interface;
            },
            getMetadataSpecification: function (metadataName) {
                var metadataSpecification = this.entityList[metadataName];
                if (metadataSpecification) {
                    return metadataSpecification
                } else {
                    metadataSpecification = {metadataName: metadataName, metadataObject: null, entityList: null};
                    this.entityList[metadataName] = metadataSpecification;
                    return metadataSpecification;
                }
            },
            bookMetadataObject: function (metadataObject) {
                var metadataSpecification = this.getMetadataSpecification(metadataObject.metadataName);
                metadataSpecification.metadataObject = metadataObject;
            },
            bookEntityList: function (entityList) {
                var metadataSpecification = this.getMetadataSpecification(entityList.metadataName);
                metadataSpecification.entityList = entityList;
                metadataSpecification.entityList.metadataObject = metadataSpecification.metadataObject;
            },
            getMetadataObject: function (metadataName) {
                if (this.entityList[metadataName]) {
                    return this.entityList[metadataName].metadataObject;
                } else {
                    return undefined;
                }
            },
            getEntityList: function (metadataName) {
                if (this.entityList[metadataName]) {
                    return this.entityList[metadataName].entityList;
                } else {
                    return undefined;
                }
            },
            getEntityInstance: function (metadataName) {
                var metadataSpecification = this.entityList[metadataName];
                if (metadataSpecification) {
                    if (metadataSpecification.metadataObject) {
                        return metadataSpecification.metadataObject.getEntityInstance();
                    }
                }
                return null;
            }
        })
    })();

    var MetadataEntitySpecification = appUtils.Class();
    (function () {
        MetadataEntitySpecification.prototype.$_buildObject = function () {
            this.includeFd({
                metadataName: "",
                metadataRepresentation: "",
                metadataDescription: "",
                entityField: {
                    objectField: {},
                    entityField: {},
                    defineField: {}
                }
            })};
        MetadataEntitySpecification.includeMthd({
            getObjectFields: function () {
                var objectFields = this.entityField.objectField;
                objectFields.metadataName = this.metadataName;
                return objectFields;
            },
            getEntityFields: function () {
                var source = this.entityField.entityField;
                var entityFields = {};
                for (var key in source) {
                    if (angular.isArray(source[key].value)){
                        entityFields[key] = [];
                        // ToDo
                        if(source[key].value.fillByTemplate){
                            entityFields[key].fillByTemplate = source[key].value.fillByTemplate;
                        }
                        if(source[key].value.representationList){
                            entityFields[key].representationList = source[key].value.representationList;
                            /*entityFields[key].representationList = source[key].representationList;*/
                        }
                    }else if (typeof source[key].value === 'object') {
                        entityFields[key] = {};
                    }
                    else {
                        entityFields[key] = source[key].value;
                    }
                }
                return entityFields;
            },
            getEntityFieldsDescription: function () {
                var source = this.entityField.entityField;
                var entityFieldsDescription = [];
                for (var key in source) {
                    var metadataEditField = new MetadataEditField();
                    metadataEditField.buildEditField(source[key].fieldDescription, key);
                    entityFieldsDescription.push(metadataEditField);
                }
                return entityFieldsDescription;
            }
        });
    })();

    appORMModule.MetadataSet = MetadataSet;
    appORMModule.MetadataObject = MetadataObject;
    appORMModule.Entity = Entity;
    appORMModule.Enum = Enum;

    appORMModule.MetadataEditField = MetadataEditField;

})(appORMModule, appInterface);

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

})();
