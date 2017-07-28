var appORMModule = Object.create(null);
(function () {
    appORMModule.resourceService = null;

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
                return this.id == 0;
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
                    list: []
                });
        };
        var update = function () {
            var fCallBack = arguments[0];
            var data = arguments[1];

            if (data.result = 200) {
                var originalUserList = data.data;

                originalUserList.forEach(function (item, i, arr) {
                    var entity = dataStorage.getNewEntityByName(this._entityName);
                    appUtils.fillValuesProperty(item, entity);
                    this.addEntity(entity);
                }, this)
            }

            fCallBack(this)
        };

        var deleteEntity = function () {
            var id = arguments[0];
            var fCallBack = arguments[1];
            var data = arguments[2];

            if (data.result = 200) {
                this.list.forEach(function (item, i, arr) {
                    if (item.id == id) {
                        this.list.splice(i, 1);
                        return true;
                    }
                }, this);
            }

            fCallBack(this);
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
                    entity = appMetadataSet.getEntityInstance(this.metadataName);
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
                this.list = [];
                appORMModule.resourceService.getEntityEditService()
                    .getEntity({entityName: this.metadataName}, {},
                    update.bind(this, fCallBack),
                    function (httpResponse) {
                        /*resourceService.collError(httpResponse)*/
                    }
                );
            },
            deleteEntity: function (id, fCallBack) {
                appORMModule.resourceService.getEntityEditService()
                    .deleteEntity({entityName: this._entityName, entityId: id}, {},
                    deleteEntity.bind(this, id, fCallBack),
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

                    for (var i = 0; i < _metadataEditFieldsSet.length; i++) {
                        var editField = _metadataEditFieldsSet[i];

                        if (editField.availability) {
                            this.metadataEditFieldsSet.push(editField);
                        }
                    }

                    for (var i = 0; i < this.metadataEditFieldsSet.length; i++) {
                        var editField = this.metadataEditFieldsSet[i];

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
                        var editField = _metadataEditFieldsSet[i];
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
                entityList: Object.create(null)
            });
        };
        MetadataSet.includeMthd({
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
            })
        };
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
                    entityFields[key] = source[key].value;
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

    var installMetadataObject = function (EntityClass, metadataSet, entitySpecification) {

        var metadataEntitySpecification = new MetadataEntitySpecification();
        metadataEntitySpecification.metadataName = entitySpecification.metadataName;
        metadataEntitySpecification.metadataRepresentation = entitySpecification.metadataRepresentation;
        metadataEntitySpecification.metadataDescription = entitySpecification.metadataDescription;
        metadataEntitySpecification.entityField = entitySpecification.entityField;
        metadataEntitySpecification.objectField = entitySpecification.objectField;
        metadataEntitySpecification.entityField = entitySpecification.entityField;
        metadataEntitySpecification.defineField = entitySpecification.defineField;

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
    };

    appORMModule.MetadataSet = MetadataSet;
    appORMModule.MetadataObject = MetadataObject;
    appORMModule.Entity = Entity;

    appORMModule.MetadataEditField = MetadataEditField;

    appORMModule.installMetadataObject = installMetadataObject;
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

})();

var appMetadataSet = new appORMModule.MetadataSet;
(function () {

    appORMModule.resourceService = resourceService;

    // enums

    // enteties

    var Task = appUtils.Class(appORMModule.Entity);
    var propertyTaskState_entityList = null;
    /* = dataStorage.getEnumValues(appORMModule.resourceService, "TaskState");*/
    var metadataEntitySpecification_Task = {
        fnGetEntityInstance: function () {
            return new Task()
        },
        metadataName: "task",
        metadataRepresentation: "Task",
        metadataDescription: "Task list",
        entityField: {
            objectField: {},
            entityField: {

                date: {
                    value: "",
                    fieldDescription: {
                        inputType: "date",
                        label: "date",
                        availability: true,
                        entityListService: null
                    }
                },
                title: {
                    value: "",
                    fieldDescription: {
                        inputType: "text",
                        label: "title",
                        availability: true,
                        entityListService: null
                    }
                },
                author: {
                    value: {},
                    fieldDescription: {
                        inputType: "select",
                        label: "author",
                        availability: true,
                        entityListService: function () {
                            return appMetadataSet.getEntityList("role");
                        }
                    }
                },
                executor: {
                    value: [],
                    fieldDescription: {
                        inputType: "multiselect",
                        label: "executor",
                        availability: true,
                        entityListService: function () {
                            return appMetadataSet.getEntityList("user");
                        }
                    }
                },
                project: {
                    value: {},
                    fieldDescription: {
                        inputType: "select",
                        label: "project",
                        availability: true,
                        entityListService: function () {
                            return appMetadataSet.getEntityList("project")
                        }
                    }
                },
                state: {
                    value: "TODO",
                    fieldDescription: {
                        inputType: "enum",
                        label: "state",
                        availability: true,
                        entityListService: propertyTaskState_entityList
                    }
                }

            },
            defineField: {

                representation: {
                    enumerable: true,
                    get: function () {
                        return "" + this.date + " /" + this.title + "/ (" + this.description + ") ";
                    }
                }

            }
        }
    };
    appORMModule.installMetadataObject(Task, appMetadataSet, metadataEntitySpecification_Task);

    var User = appUtils.Class(appORMModule.Entity);
    var metadataEntitySpecification_User = {
        fnGetEntityInstance: function () {
            return new User()
        },
        metadataName: "user",
        metadataRepresentation: "User",
        metadataDescription: "User list",
        entityField: {
            objectField: {},
            entityField: {

                username: {
                    value: "",
                    fieldDescription: {
                        inputType: "text",
                        label: "username",
                        availability: true,
                        entityListService: null
                    }
                },
                password: {
                    value: "",
                    fieldDescription: {
                        inputType: "text",
                        label: "password",
                        availability: true,
                        entityListService: null
                    }
                },
                mailAddress: {
                    value: "",
                    fieldDescription: {
                        inputType: "text",
                        label: "mailAddress",
                        availability: true,
                        entityListService: null
                    }
                },
                role: {
                    value: [],
                    fieldDescription: {
                        inputType: "multiselect",
                        label: "role",
                        availability: true,
                        entityListService: function () {
                            appMetadataSet.getEntityList("role");
                        }
                    }
                },
                enabled: {
                    value: [],
                    fieldDescription: {
                        inputType: "boolean",
                        label: "enabled",
                        availability: false,
                        entityListService: null
                    }
                }

            },
            defineField: {

                representation: {
                    enumerable: true,
                    get: function () {
                        return "" + this.username + " (" + this.description + ") ";
                    }
                }

            }
        }
    };
    appORMModule.installMetadataObject(User, appMetadataSet, metadataEntitySpecification_User);

    var Project = appUtils.Class(appORMModule.Entity);
    var metadataEntitySpecification_Project = {
        fnGetEntityInstance: function () {
            return new Project()
        },
        metadataName: "project",
        metadataRepresentation: "Project",
        metadataDescription: "Project list",
        entityField: {
            objectField: {},
            entityField: {

                // entity field
                name: {
                    value: "",
                    fieldDescription: {
                        inputType: "text",
                        label: "name",
                        availability: true,
                        entityListService: null
                    }
                }

            },
            defineField: {

                representation: {
                    enumerable: true,
                    get: function () {
                        return "" + this.name;
                    }
                }

            }
        }
    };
    appORMModule.installMetadataObject(Project, appMetadataSet, metadataEntitySpecification_Project);

    var Role = appUtils.Class(appORMModule.Entity);
    var metadataEntitySpecification_Role = {
        fnGetEntityInstance: function () {
            return new Role()
        },
        metadataName: "role",
        metadataRepresentation: "Role",
        metadataDescription: "Role list",
        entityField: {
            objectField: {},
            entityField: {

                // entity field
                role: {
                    value: "",
                    fieldDescription: {
                        inputType: "text",
                        label: "role",
                        availability: true,
                        entityListService: null
                    }
                }

            },
            defineField: {

                representation: {
                    enumerable: true,
                    get: function () {
                        return "" + this.role;
                    }
                }

            }
        }
    };
    appORMModule.installMetadataObject(Role, appMetadataSet, metadataEntitySpecification_Role);

    // Test

    var project1 = appMetadataSet.getEntityInstance("project");
    project1.name = "Family";

    appUtils.log(project1.representation);
    appUtils.log(project1.translateToEntityJSON());

})();
