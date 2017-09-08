function getAppHttpUrl($location, urlSuffix) {
    var appAddress = "http://" + $location.$$host + ":" + $location.$$port;

    return appAddress + "/appTaskList" + urlSuffix;
}

////////////////////////////////////
// app SERVICEs
////////////////////////////////////

function dataStorage() {

    var appMetadataSet = null;

    var currentUser = null;
    var currentRole = null;
    var currentProject = null;
    var currentTask = null;

    return {
        getAppMetadaSet: function () {
            return appMetadataSet;
        },
        setAppMetadataSet: function (metadataSet) {
            appMetadataSet = metadataSet;
        },

        setCurrentUser: function (_data) {
            currentUser = _data;
        },
        getCurrentUser: function () {
            if (currentUser == null) {
                currentUser = this.getNewEntityByName('user');
            }
            return currentUser;
        },
        setCurrentRole: function (_data) {
            currentRole = _data;
        },
        getCurrentRole: function () {
            if (currentRole == null) {
                currentRole = this.getNewEntityByName('role');
            }
            return currentRole;
        },
        setCurrentProject: function (_data) {
            currentProject = _data;
        },
        getCurrentProject: function () {
            if (currentProject == null) {
                currentProject = this.getNewEntityByName('project');
            }
            return currentProject;
        },
        setCurrentTask: function (_data) {
            currentTask = _data;
        },
        getCurrentTask: function () {
            if (currentTask == null) {
                currentTask = this.getNewEntityByName('task');
            }
            return currentTask;
        },

        setCurrentEntityByName: function (entityName, _date) {
            switch (entityName) {
                case 'user':
                    currentUser = _date;
                    break;
                case 'role':
                    currentRole = _date;
                    break;
                case 'project':
                    currentProject = _date;
                    break;
                case 'task':
                    currentTask = _date;
                    break;
                default:
                    return undefined;
            }
        },
        getCurrentEntityByName: function (entityName) {
            switch (entityName) {
                case 'user':
                    return this.getCurrentUser();
                    break;
                case 'role':
                    return this.getCurrentRole();
                    break;
                case 'project':
                    return this.getCurrentProject();
                    break;
                case 'task':
                    return this.getCurrentTask();
                    break;
                default:
                    return undefined;
            }
        },
        getNewEntityByName: function (entityName) {
            this.getNewEntityByName(entityName)
        }
    };
}

function getMetadataSet(resourceService) {

    appModel.resourceService = resourceService;

    appInitialization
        .setMetadataSet()

        .InitEnumsModel()
        .InitProjectModel()
        .InitUserModel()
        .InitTaskModel()

        .initMetadataSet();

    return appInitialization.getMetadataSet();
}

// Abstract model of application interface
var appInterface = Object.create(null);
(function (appInterface) {

    var Principal = appUtils.Class();
    (function () {
        Principal.prototype.$_buildObject = function () {
            this.includeFd({
                authenticated: false,
                name: 'NO_Authentication',
                sessionId: null,
                authorities: [],
                currentUserId: 0,
                currentUser: {}
            })
        };
        var setNotAuthenticated = function (currentPrincipal) {
            currentPrincipal.authenticated = false;
            currentPrincipal.name = 'NO_Authentication';
            currentPrincipal.sessionId = null;
            currentPrincipal.authorities = [];
            currentPrincipal.currentUserId = 0;
            currentPrincipal.currentUser = {};
        };
        var authenticate = function ($http, credentials, callback) {

            var principal = undefined;
            var headers = credentials ? {
                authorization: "Basic "
                + btoa(credentials.username + ":"
                + credentials.password)
            } : {};

            $http.get('/appTaskList/service/authenticate', {
                headers: headers
            })
                .then(function (response) {
                    if (response.data.status == 200) {
                        var principal = response.data.data;
                    }
                    callback && callback({authenticated: true, principal: principal});
                }, function () {
                    callback && callback({authenticated: false, principal: principal});
                }
            );
        };
        Principal.includeMthd({
            logout: function ($http) {
                var self = this;
                $http.post('/appTaskList/logout', {}).finally(function () {
                    self.authenticated = false;
                    setNotAuthenticated(self);
                });
            },
            login: function ($http, credentials, callback) {
                var self = this;
                authenticate($http, credentials, function (data) {
                    if (data.authenticated) {
                        console.log("Login succeeded");
                        credentials.error = false;
                    } else {
                        console.log("Login failed");
                        credentials.error = true;
                    }
                    self.setAuthenticated(data.principal);
                    callback && callback(self);
                })
            },
            getSessionInformation: function (resourceService, $cookies) {
                var securityService = resourceService.getSecurityService();

                var currentPrincipal = this;
                securityService.getSessionInformation({}, {}, function (response) {
                    if (response.status == 200) {
                        var data = response.data;
                        currentPrincipal.setAuthenticated(data);
                    }
                })
            },
            updatePrincipalUser: function (appMetadataSet) {
                var self = this;
                appMetadataSet.metadataEvents.publish("ev:entityList:" + "user" + ":update", function () {
                    var entityList = appMetadataSet.getEntityList("user");
                    if (entityList) {
                        self.currentUser = entityList.findEntityById(self.currentUserId);
                    }
                });
            },
            setAuthenticated: function (data) {
                setNotAuthenticated(self);
                if (data != undefined) {
                    this.authenticated = true;
                    this.name = data.userName;
                    this.sessionId = data.sessionId;
                    this.authorities = data.authorities;
                    this.currentUserId = data.currentUserId;
                }
            }
        });
    })();

    var ErrorDescription = appUtils.Class();
    (function () {
        ErrorDescription.prototype.$_buildObject = function () {
            this.includeFd({
                error: false,
                status: 0,
                statusText: "",
                type: 'success'
            })
        };
        ErrorDescription.includeMthd({
            SetHTTPError: function (statusText, status) {
                this.error = true;
                this.status = status;
                this.statusText = "HTTP error: " + statusText;
            },
            SetNoError: function () {
                this.error = false;
                this.status = 200;
                this.statusText = "";
            },
            SetAppError: function (statusText) {
                this.error = true;
                this.status = 0;
                this.statusText = "App error: " + statusText;
            }
        });
    })();

    var ErrorDescriptions = appUtils.Class();
    (function () {
        ErrorDescriptions.prototype.$_buildObject = function () {
            this.includeFd({
                errorDescriptions: [],
                show: false
            });
        };
        ErrorDescriptions.includeMthd({
            handleResponse: function (response) {
                var errorDescription = new ErrorDescription();
                errorDescription.SetNoError();
                if ((response.status == 200) ||
                    (response.status == 404) ||
                    (response.status == 403)
                ) {
                    var objectResponse = response.data;
                    if (objectResponse instanceof Object) {
                        if ("message" in objectResponse && "status" in objectResponse) { //ToDo
                            if (response.data.status != 200) {
                                errorDescription.SetAppError(objectResponse.message);
                            }
                        }
                    } else if (response.status != 200) {
                        objectResponse = eval("(" + response.data + ")");
                        errorDescription.SetAppError(objectResponse.message);
                    }
                } else {
                    errorDescription.SetHTTPError(response.statusText, response.status);
                }
                if (errorDescription.error) {
                    this.addErrorDescription(errorDescription);
                    this.show = true;
                }
            },
            addErrorDescription: function (_data) {
                this.errorDescriptions.push(_data);
            },
            delErrorDescription: function (index) {
                this.errorDescriptions.splice(index, 1);
            },
            getErrorDescriptions: function () {
                return this.errorDescriptions;
            },
            errorsCount: function () {
                return this.errorDescriptions.length;
            }
        });
    })();

    var EditForm = appUtils.Class();
    (function () {
        EditForm.prototype.$_buildObject = function () {
            this.includeFd({
                editFormName: "<--label for form-->",
                formProperties: {},
                formPropertiesPlacing: {},

                eventCloseForm: function () {
                },
                eventUpdateForm: function () {
                }
            });
        };
    })();

    var EntityEditForm = appUtils.Class(EditForm);
    (function () {
        EntityEditForm.prototype.$_buildObject = function () {
            this.includeFd({
                currentEntity: {},

                eventCreateEntity: function () {
                }
            });
        };
    })();

    var EntityListForm = appUtils.Class(EditForm);
    (function () {
        EntityListForm.prototype.$_buildObject = function () {
            this.includeFd({
                entities: [],

                eventAddNewEntity: function () {
                },
                eventDeleteEntity: function (id) {
                },
                eventEditEntity: function (id) {
                }
            });
        };
    })();

    var MenuCommand = appUtils.Class();
    (function () {
        MenuCommand.prototype.$_buildObject = function () {
            this.includeFd({
                commandName: "",

                dropdownMenu: false,
                text: "",
                command: null,
                commandList: []
            })
        };
        MenuCommand.includeMthd({
            addCommand: function (command) {
                this.commandList.push(command);
                return this;
            },
            getSubMenu: function (commandName) {
                for (var i = 0; i < this.commandList.length; i++) {
                    var currentCommand = this.commandList[i];
                    if (currentCommand.commandName === commandName) {
                        return currentCommand;
                    }
                    if (currentCommand.commandList.length > 0) {
                        return currentCommand.getSubMenu(commandName);
                    }
                }
                return undefined;
            }
        });

    }());

    var UserInterface = appUtils.Class();
    (function () {
        UserInterface.prototype.$_buildObject = function () {
            this.includeFd({
                security: {
                    principal: new Principal()
                },
                errorDescriptions: new ErrorDescriptions(),
                commandBar: {
                    mainUrl: '#',
                    commandBar: new MenuCommand()
                },
                appMetadataSet: null
            });
        };
        UserInterface.includeMthd({
            commandBarSetMainUrl: function (mainUrl) {
                this.commandBar.mainUrl = mainUrl;
                return this;
            },
            commandBarAddCommand: function (command) {
                this.commandBar.commandList.push(command);
                return this;
            },
            editFormGetEntityEditForm: function () {
                return new EntityEditForm();
            },
            editFormGetEntityListForm: function () {
                return new EntityListForm();
            }
        })
    }());

    appInterface.UserInterface = UserInterface;
    appInterface.getNewEntityCommand = function (commandName, text) {
        var command = new MenuCommand();
        command.dropdownMenu = false;
        command.commandName = commandName;
        command.text = text;
        command.command = commandName;

        return command;
    };
    appInterface.getNewDropdownCommand = function (commandName, text) {
        var command = new MenuCommand();
        command.dropdownMenu = true;
        command.commandName = commandName;
        command.text = text;
        return command;
    };
    appInterface.getNewCommand = function (commandName, text, functionCommand) {
        var command = new MenuCommand();
        command.dropdownMenu = false;
        command.commandName = commandName;
        command.text = text;
        command.command = functionCommand;

        return command;
    };

}(appInterface));

// Abstract model of application
var appModel = Object.create(null);
(function (appModel, appInterface) {

    var MetadataEvents = appUtils.Class();
    (function () {
        MetadataEvents.prototype.$_buildObject = function () {
            this.includeFd({
                events: $({})
            });
        };
        MetadataEvents.includeMthd({
            subscribe: function () {
                this.events.bind.apply(this.events, arguments);
            },
            unSubscribe: function () {
                this.events.unbind.apply(this.events, arguments);
            },
            publish: function () {
                this.events.trigger.apply(this.events, arguments);
            }
        });
    })();
    var metadataEventsImpl = new MetadataEvents();

    // Abstract model of entity
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
                appModel.resourceService.getEntityEditService().createEntity(
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
                if (originalEntity) {
                    appUtils.fillValuesProperty(originalEntity, this);
                    fCallBack(this);
                }
            }
        };
    })();

    // Abstract model of entity list
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
                if (originalUserList) {
                    originalUserList.forEach(function (item, i, arr) {
                        var entity = this.metadataObject.getEntityInstance();
                        appUtils.fillValuesProperty(item, entity);
                        this.addEntity(entity);
                    }, this);
                }
                console.log("Update " + this.metadataObject.metadataName);
            }

            if (fCallBack) {
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

            if (fCallBack) {
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
                appModel.resourceService.getEntityEditService()
                    .getEntity({entityName: this.metadataName}, {},
                    function (data) {
                        updateEnt.call(self, fCallBack, data)
                    },
                    function (httpResponse) {
                        /*resourceService.collError(httpResponse)*/
                    }
                );
            },
            deleteEntity: function (id, fCallBack) {
                appModel.resourceService.getEntityEditService()
                    .deleteEntity({entityName: this.metadataName, entityId: id}, {},
                    deleteEnt.bind(this, id, fCallBack),
                    function (httpResponse) {
                        /*resourceService.collError(httpResponse)*/
                    }
                )
            }

        })
    })();

    // Abstract model of enums
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
                appModel.resourceService.getEntityEditService()
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

    // Abstract model of entity field
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
                    metadataEditFieldsSet: {},
                    metadataEditFieldsPlacing: []
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
            bookEntityForms: function (_metadataEditFieldsSet, _metadataFilterFieldsSet, _editFieldsPlacing) {
                var i;
                if(_editFieldsPlacing){
                    this.fmEditForm.metadataEditFieldsPlacing = _editFieldsPlacing;
                }
                if (_metadataEditFieldsSet) {
                    var editField = undefined;

                    for (i = 0; i < _metadataEditFieldsSet.length; i++) {
                        editField = _metadataEditFieldsSet[i];

                        if (editField.availability) {
                            this.metadataEditFieldsSet.push(editField);
                        }
                    }

                    for (i = 0; i < this.metadataEditFieldsSet.length; i++) {
                        editField = this.metadataEditFieldsSet[i];

                        if (editField.availabilityInEditForm) {
                            this.fmEditForm.metadataEditFieldsSet[editField.name] = editField;
                        }
                        if (editField.availabilityInListForm) {
                            this.fmListForm.metadataEditFieldsSet.push(editField);
                        }
                    }
                }
                if (_metadataFilterFieldsSet) {
                    for (i = 0; i < _metadataEditFieldsSet.length; i++) {
                        editField = _metadataEditFieldsSet[i];
                        /*if (appUtils.find(this.fmListForm.metadataEditFieldsSet, editField) > 0) {*/
                        this.fmListForm.metadataFilterFieldsSet.push(editField);
                        /*}*/
                    }
                }
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
                },
                entityFieldsPlacing:[]
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
                    if (angular.isArray(source[key].value)) {
                        entityFields[key] = [];
                        // ToDo
                        if (source[key].value.fillByTemplate) {
                            entityFields[key].fillByTemplate = source[key].value.fillByTemplate;
                        }
                        if (source[key].value.representationList) {
                            entityFields[key].representationList = source[key].value.representationList;
                            /*entityFields[key].representationList = source[key].representationList;*/
                        }
                    } else if (typeof source[key].value === 'object') {
                        if (source[key].fieldDescription && source[key].fieldDescription.getInstance) {
                            entityFields[key] = source[key].fieldDescription.getInstance();
                        } else {
                            entityFields[key] = {};
                        }
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
            },
            getEntityFieldsPlacing: function () {
                return this.entityFieldsPlacing;
            }
        });
    })();

    var MetadataSet = appUtils.Class();
    (function () {
        MetadataSet.prototype.$_buildObject = function () {
            this.includeFd({
                // entities
                entityList: Object.create(null),
                metadataEvents: metadataEventsImpl,

                // user interface
                userInterface: new appInterface.UserInterface()
            });
        };
        MetadataSet.includeMthd({
            installMetadataObjectEnum: function (metadataEnumSpecification) {
                var EnumClass = metadataEnumSpecification.enumClass;
                EnumClass.metadataName = metadataEnumSpecification.metadataName;
                var metadataSet = this;

                metadataSet.bookEntityList(EnumClass);
                // event
                metadataSet.metadataEvents.subscribe("ev:entityList:" + metadataEnumSpecification.metadataName + ":update",
                    function (event, fCallBack) {
                        EnumClass.update(fCallBack)
                    }
                );

                return metadataSet;
            },
            installMetadataObjectEntity: function (entitySpecification) {
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
                metadataEntitySpecification.entityFieldsPlacing = entitySpecification.entityFieldsPlacing;

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

                var metadataObject = new MetadataObject();

                metadataObject.installMetadata(metadataEntitySpecification.metadataName,
                    entitySpecification.fnGetEntityInstance,
                    metadataEntitySpecification.metadataRepresentation,
                    metadataEntitySpecification.metadataDescription
                );

                var metadataEditFieldsSet = metadataEntitySpecification.getEntityFieldsDescription();
                var editFieldsPlacing = metadataEntitySpecification.getEntityFieldsPlacing();
                metadataObject.bookEntityForms(metadataEditFieldsSet, undefined, editFieldsPlacing);

                metadataSet.bookMetadataObject(metadataObject);
                metadataSet.bookEntityList(entityList);

                // event
                metadataEventsImpl.subscribe("ev:entityList:" + metadataEntitySpecification.metadataName + ":update",
                    function (event, fCallBack) {
                        entityList.update(fCallBack)
                    }
                );
                metadataEventsImpl.subscribe("ev:entityList:" + metadataEntitySpecification.metadataName + ":deleteEntity",
                    function (event, id, fCallBack) {
                        entityList.deleteEntity(id, fCallBack);
                    }
                );

                // EditMenu
                var entitySubMenu = metadataSet.userInterface.commandBar.commandBar.getSubMenu('modelDD');
                if (entitySubMenu != undefined) {
                    entitySubMenu.addCommand(appInterface.getNewEntityCommand(entitySpecification.metadataName, entitySpecification.metadataRepresentation))
                }

                return metadataSet;
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
            },
            getInterface: function () {
                return this.userInterface;
            },

            loadAllEntities: function () {
                window.status = "Load objects...";
                var entityName;
                for (entityName in this.entityList) {
                    this.metadataEvents.publish("ev:entityList:" + entityName + ":update")
                }
            }
        })
    })();

    appModel.resourceService = undefined;
    appModel.Entity = Entity;
    appModel.Enum = Enum;
    appModel.MetadataSet = MetadataSet;

})(appModel, appInterface);

var appInitialization = Object.create(null);
(function () {
    appInitialization.metadataSet = undefined;
    appInitialization.metadataSpecifications = {
        enums: [],
        entities: []
    };

    appInitialization.setMetadataSet = function (metadataSet) {
        if (metadataSet === undefined) {
            appInitialization.metadataSet = new appModel.MetadataSet();
        } else {
            appInitialization.metadataSet = metadataSet;
        }

        return appInitialization;
    };
    appInitialization.getMetadataSet = function () {
        return appInitialization.metadataSet;
    };
    appInitialization.initMetadataSet = function () {
        var appMetadataSet = appInitialization.metadataSet;

        // EditBar
        var menuModel = appInterface.getNewDropdownCommand("modelDD", "Model");
        var menuSystem = appInterface.getNewDropdownCommand("systemDD", "System")
            .addCommand(appInterface.getNewCommand("initDataBase", "initDataBase", function () {
                ExecuteSystemCommand(resourceService, "jdbc/initDataBase")
            }))
            .addCommand(appInterface.getNewCommand("runArchiveService", "runArchiveService", function () {
                ExecuteSystemCommand(resourceService, "taskScheduler/runArchiveService")
            }))
            .addCommand(appInterface.getNewCommand("stopArchiveService", "stopArchiveService", function () {
                ExecuteSystemCommand(resourceService, "taskScheduler/stopArchiveService")
            }))
            .addCommand(appInterface.getNewCommand("sendMail", "sendMail", function () {
                ExecuteSystemCommand(resourceService, "taskScheduler/sendMail")
            }))
            .addCommand(appInterface.getNewCommand("interruptTaskExecutor", "interruptTaskExecutor", function () {
                ExecuteSystemCommand(resourceService, "taskScheduler/interruptTaskExecutor")
            }));

        var userInterface = new appInterface.UserInterface();
        userInterface.appMetadataSet = appMetadataSet;
        userInterface
            .commandBarSetMainUrl("#/task")
            .commandBar.commandBar
            .addCommand(menuModel)
            .addCommand(menuSystem);

        appMetadataSet.userInterface = userInterface;
        var i;
        for (i = 0; i < appInitialization.metadataSpecifications.enums.length; i++) {
            appMetadataSet.installMetadataObjectEnum(appInitialization.metadataSpecifications.enums[i]);
        }
        for (i = 0; i < appInitialization.metadataSpecifications.entities.length; i++) {
            appMetadataSet.installMetadataObjectEntity(appInitialization.metadataSpecifications.entities[i]);
        }
        return appInitialization;
    }

})(appInitialization);

////////////////////////////////////
// angular SERVICEs
////////////////////////////////////

function setRoute(routeProvider) {
    routeProvider
        .when('/login', {
            templateUrl: '/login'
        })
        .when("/user", {
            templateUrl: "/appTaskList/security/usersList"
        })
        .when("/role", {
            templateUrl: "/appTaskList/security/roleList"
        })
        .when("/project", {
            templateUrl: '/appTaskList/projectsList'
        })
        .when("/task", {
            templateUrl: "/appTaskList/tasksList"
        })
        .when("/currentPrincipalInformation", {
            templateUrl: "/appTaskList/currentPrincipalInformation"
        })
    ;
    return routeProvider;
}

function appHttpResponseInterceptor($q, dataStorage) {
    return {
        'request': function (config) {
            /*config.url = config.url.split('%2F').join('/');*/
            return config;
        },

        'response': function (response) {
            var appMetadataSet = dataStorage.getAppMetadaSet();
            if (appMetadataSet) {
                var errorDescriptions = appMetadataSet.userInterface.errorDescriptions;
                if (errorDescriptions) {
                    errorDescriptions.handleResponse(response);
                }
            }
            return response;
        },

        'responseError': function (response) {
            var appMetadataSet = dataStorage.getAppMetadaSet();
            if (appMetadataSet) {
                var errorDescriptions = appMetadataSet.userInterface.errorDescriptions;
                if (errorDescriptions) {
                    errorDescriptions.handleResponse(response);
                }
            }
            return $q.reject(response);
        }
    };
}

function entityEditService($location, resource) {
    return resource(
        getAppHttpUrl($location, '/entity/:entityName/:entityId'),
        {
            entityName: "@entityName",
            entityId: "@entityId"
        },
        {
            getEntity: {
                method: "GET"
            },
            createEntity: {
                method: "POST"
            },
            deleteEntity: {
                method: "DELETE"
            }
        }
    );
}

function securityService($location, resource) {
    return resource(
        getAppHttpUrl($location, '/system/security/:command'),
        {
            sessionID: "@sessionID"
        },
        {
            getAllPrincipals: {
                method: "GET",
                params: {
                    command: "getAllPrincipals"
                }
            },
            getSessionInformation: {
                method: "GET",
                params: {
                    command: "getSessionInformation"
                }
            }
        }
    );
}

function operationService($location, resource) {
    return resource(
        getAppHttpUrl($location, '/service/:command'),
        {
            command: "@command"
        },
        {
            executeCommand: {
                method: "GET"
            }
        }
    );
}

function systemService($location, resource) {
    return resource(
        getAppHttpUrl($location, '/system/:command'),
        {
            command: "@command"
        },
        {
            executeCommand: {
                method: "GET"
            }
            }
    );
}

function resourceService(_entityEditService, _systemService, _securityService, _operationService) {

    var entityEditService = _entityEditService;
    var systemService = _systemService;
    var securityService = _securityService;
    var operationService = _operationService;

    return {
        getEntityEditService: function () {
            return entityEditService;
        },
        getSystemService: function () {
            return systemService;
        },
        getSecurityService: function () {
            return securityService;
        },
        getOperationService: function () {
            return operationService;
        }
    };
}

////////////////////////////////////
// UTILS
////////////////////////////////////

function ExecuteSystemCommand(resourceService, command) {
    var systemService = resourceService.getSystemService();
    systemService.executeCommand({command: command}, {});
}
function ExecuteServiceCommand(resourceService, command) {
    var operationService = resourceService.getOperationService();
    operationService.executeCommand({command: command}, {});
}
