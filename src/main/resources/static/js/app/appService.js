
function getMetadataSet(resourceService) {

    appORMModule.resourceService = resourceService;
    var appMetadataSet = new appORMModule.MetadataSet();

    // EditBar
    var menuModel = appInterface.getNewDropdownCommand("modelDD", "Model");
    var menuSystem = appInterface.getNewDropdownCommand("systemDD", "System")
        .addCommand(appInterface.getNewCommand("initDataBase",          "initDataBase",         function(){ExecuteSystemCommand(resourceService, "jdbc/initDataBase")}))
        .addCommand(appInterface.getNewCommand("runArchiveService",     "runArchiveService",    function(){ExecuteSystemCommand(resourceService, "taskScheduler/runArchiveService")}))
        .addCommand(appInterface.getNewCommand("stopArchiveService",    "stopArchiveService",   function(){ExecuteSystemCommand(resourceService, "taskScheduler/stopArchiveService")}))
        .addCommand(appInterface.getNewCommand("sendMail",              "sendMail",             function(){ExecuteSystemCommand(resourceService, "taskScheduler/sendMail")}))
        .addCommand(appInterface.getNewCommand("interruptTaskExecutor", "interruptTaskExecutor",function(){ExecuteSystemCommand(resourceService, "taskScheduler/interruptTaskExecutor")}));
    
    var interface = new appInterface.Interface();
    appMetadataSet.interface = interface;
    interface
        .commandBarSetMainUrl("#/task")
        .commandBar.commandBar
        .addCommand(menuModel)
        .addCommand(menuSystem);

    // enums

    var EnumTaskState = new appORMModule.Enum;
    var metadataEnumSpecification_TaskState = {
        enumClass: EnumTaskState,
        metadataName: "taskState"
    };

    // entities

    var Task = appUtils.Class(appORMModule.Entity);
    var metadataEntitySpecification_Task = {
        entityClass: Task,
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
                            return appMetadataSet.getEntityList("user");
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
                        entityListService: function(){
                            return appMetadataSet.getEntityList("taskState")
                        }
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
    metadataEntitySpecification_Task.entityField.entityField.executor.value.representationList = function() {
        var str = "";
        var k=0;
        while (true) {
            if(k == this.length){
                break;
            }
            str = str+"; "+this[k].representation;
            k = k+1;

        }
        return str;
    };
    metadataEntitySpecification_Task.entityField.entityField.executor.value.fillByTemplate = function(template) {
        this.length=0;
        var k=0;
        while (true) {
            if(k == template.length){
                break;
            }
            var entity = appMetadataSet.getEntityInstance("user");
            appUtils.fillValuesProperty(template[k], entity);
            this.push(entity);
            k = k+1;
        }
    };

    var User = appUtils.Class(appORMModule.Entity);
    var metadataEntitySpecification_User = {
        entityClass: User,
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
                            return appMetadataSet.getEntityList("role");
                        }
                    }
                },
                enabled: {
                    value: false,
                    fieldDescription: {
                        inputType: "checkbox",
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
    metadataEntitySpecification_User.entityField.entityField.role.value.representationList = function() {
        var str = "";
        var k=0;
        while (true) {
            if(k == this.length){
                break;
            }
            str = str+"; "+this[k].representation;
            k = k+1;

        }
        return str;
    };
    metadataEntitySpecification_User.entityField.entityField.role.value.fillByTemplate = function(template) {
        this.length=0;
        var k=0;
        while (true) {
            if(k == template.length){
                break;
            }
            var entity = appMetadataSet.getEntityInstance("role");
            appUtils.fillValuesProperty(template[k], entity);
            this.push(entity);
            k = k+1;
        }
    };

    var Project = appUtils.Class(appORMModule.Entity);
    var metadataEntitySpecification_Project = {
        entityClass: Project,
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

    var Role = appUtils.Class(appORMModule.Entity);
    var metadataEntitySpecification_Role = {
        entityClass: Role,
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

    appMetadataSet
        .installMetadataObjectEntity(metadataEntitySpecification_Task)
        .installMetadataObjectEntity(metadataEntitySpecification_User)
        .installMetadataObjectEntity(metadataEntitySpecification_Project)
        .installMetadataObjectEntity(metadataEntitySpecification_Role)

        .installMetadataObjectEnum(metadataEnumSpecification_TaskState);

    return appMetadataSet;
}

function ListEntityController($scope, dataStorage){
    this.appMetadataSet = dataStorage.getAppMetadaSet();

    this.initController = function(){
        $scope.$parent.openListForm = this.openListForm;
        $scope.$parent.closeListForm = this.closeListForm;

        var metadataSpecification = this.appMetadataSet.getEntityList(this.metadataName);
        var entityListForm = new EntityListForm();

        entityListForm.metadataName = this.metadataName;
        entityListForm.appMetadataSet = this.appMetadataSet;
        entityListForm.metadataSpecification = metadataSpecification;
        entityListForm.editFormName = metadataSpecification.metadataObject.description;
        entityListForm.formProperties = metadataSpecification.metadataObject.fmListForm.metadataEditFieldsSet;
        entityListForm.entities = metadataSpecification.list;

        entityListForm.eventCloseForm = this.closeListForm;
        entityListForm.eventUpdateForm = this.updateForm;
        entityListForm.eventAddNewEntity = this.addNewEntity;
        entityListForm.eventEditEntity = this.editEntity;
        entityListForm.eventDeleteEntity = this.deleteEntity;

        entityListForm.openEditForm = this.openEditForm;
        entityListForm.updateViewEntityList = this.updateViewEntityList;
        entityListForm.closeListForm = this.closeListForm;

        $scope.entityListForm = entityListForm;

        this.updateForm();
    };

    this.addNewEntity = function(){
        this.openEditForm(this.appMetadataSet.getEntityList(this.metadataName).metadataObject.getEntityInstance())
    };

    this.editEntity = function(id){
        var entity = this.appMetadataSet.getEntityList(this.metadataName).findEntityById(id);
        if(entity != undefined){
            var editEntity = this.appMetadataSet.getEntityList(this.metadataName).metadataObject.getEntityInstance();
            appUtils.fillValuesProperty(entity, editEntity);
            this.openEditForm(editEntity);
        }
    };

    this.deleteEntity = function(id){
        this.appMetadataSet.getEntityList(this.metadataName).deleteEntity(id, function(data){
            this.updateViewEntityList();
        });
    };

    this.updateViewEntityList = function(){
        this.appMetadataSet.metadataEvents.publish("ev:entityList:" +this.metadataName+ ":update");
    };

    this.openEditForm = function(currentEntity){
        dataStorage.setCurrentEntityByName(this.metadataName, currentEntity);
        this.closeListForm();
    };

    this.closeListForm = function(){
        $scope.$parent.showListForm = false;
        $scope.$parent.openEditForm();
    };

    this.openListForm = function(){
        $scope.$parent.showListForm = true;
    };

    this.updateForm = function(){
        this.updateViewEntityList();
    };

}

function EditEntityController($scope, dataStorage){
    this.appMetadataSet = dataStorage.getAppMetadaSet();
    this.currentEntity = dataStorage.getCurrentEntityByName(this.metadataName);

    this.initController = function(){
        $scope.$parent.openEditForm = this.openEditForm;
        $scope.$parent.closeEditForm = this.closeEditForm;

        var metadataSpecification = this.appMetadataSet.getEntityList(this.metadataName);

        var entityEditForm = new EntityEditForm();
        entityEditForm.metadataName = this.metadataName;
        entityEditForm.appMetadataSet = this.appMetadataSet;
        entityEditForm.metadataSpecification = metadataSpecification;
        entityEditForm.editFormName = "New " +this.metadataName+ ":";
        entityEditForm.formProperties = metadataSpecification.metadataObject.fmEditForm.metadataEditFieldsSet;

        entityEditForm.eventCloseForm = this.closeEditForm;
        entityEditForm.eventUpdateForm = this.updateForm;
        entityEditForm.eventCreateEntity = this.createEntity;

        entityEditForm.openEditForm = this.openEditForm;
        entityEditForm.closeEditForm = this.closeEditForm;
        entityEditForm.updateForm = this.updateForm;
        entityEditForm.createEntity = this.createEntity;

        $scope.entityEditForm = entityEditForm;
    };

    this.updateForm = function(){
        this.currentEntity = dataStorage.getCurrentEntityByName(this.metadataName);
    };

    this.createEntity = function(template){
        var entityList = this.appMetadataSet.getEntityList(this.metadataName);
        var self = this;
        entityList.addEntityByTemplate(template, function(){
            self.appMetadataSet.metadataEvents.publish("ev:entityList:" +self.metadataName+ ":update", function(){
                self.closeEditForm();
            });
        });
    };

    this.openEditForm = function(){
        $scope.$parent.showEditForm = true;
    };

    this.closeEditForm = function(){
        $scope.$parent.showEditForm = false;
        $scope.$parent.openListForm();
    };

}

////////////////////////////////////
// INTERFACE
////////////////////////////////////

function getMenuBar(resourceService){

    var menuModel = appInterface.getNewDropdownCommand("modelDD", "Model")
        .addCommand(appInterface.getNewEntityCommand("task", "Task"))
        .addCommand(appInterface.getNewEntityCommand("project", "Project"))
        .addCommand(appInterface.getNewEntityCommand("user",    "User"))
        .addCommand(appInterface.getNewEntityCommand("role",    "Role"));

    var menuSystem = appInterface.getNewDropdownCommand("systemDD", "System")
        .addCommand(appInterface.getNewCommand("initDataBase",          "initDataBase",         function(){ExecuteSystemCommand(resourceService, "jdbc/initDataBase")}))
        .addCommand(appInterface.getNewCommand("runArchiveService",     "runArchiveService",    function(){ExecuteSystemCommand(resourceService, "taskScheduler/runArchiveService")}))
        .addCommand(appInterface.getNewCommand("stopArchiveService",    "stopArchiveService",   function(){ExecuteSystemCommand(resourceService, "taskScheduler/stopArchiveService")}))
        .addCommand(appInterface.getNewCommand("sendMail",              "sendMail",             function(){ExecuteSystemCommand(resourceService, "taskScheduler/sendMail")}))
        .addCommand(appInterface.getNewCommand("interruptTaskExecutor", "interruptTaskExecutor",function(){ExecuteSystemCommand(resourceService, "taskScheduler/interruptTaskExecutor")}));

    var appInt = new appInterface.Interface();

    appInt.commandBarSetMainUrl("#/task")
        .commandBar.commandBar
        .addCommand(menuModel)
        .addCommand(menuSystem);

    return appInt.commandBar;

}

////////////////////////////////////
// SERVICEs
////////////////////////////////////

function appHttpResponseInterceptor($q, $location, dataStorage){
    return {
        'request': function(config) {
            config.url = config.url.split('%2F').join('/');
            return config;
        },

        'response': function (response) {
            var errorDescription = new ErrorDescription();
            errorDescription.SetNoError();
            if (response.status = 200){
                var objectResponse = response.data;
                /*if (!(response.data instanceof Object)){
                 var objectResponse=eval("("+response.data+")");
                 }*/
                if (objectResponse instanceof Object){
                    if ("message" in objectResponse && "status" in objectResponse) { //ToDo
                        if (response.data.status != 200) {
                            errorDescription.SetAppError(objectResponse.message);
                        }
                    }
                }
            } else {
                errorDescription.SetHTTPError(response.statusText, response.status);
            }
            if (errorDescription.error) {
                var errorDescriptions = dataStorage.getErrorDescriptions();
                errorDescriptions.addErrorDescription(errorDescription);
                errorDescriptions.show = true;
                /*$location.path("/error");*/
            }
            return response;
        },

        'responseError': function(response) {
            var errorDescription = new ErrorDescription();
            errorDescription.SetNoError();
            if (response.status = 200){
                var objectResponse = response.data;
                if (!(response.data instanceof Object)){
                    objectResponse=eval("("+response.data+")");
                }
                if (objectResponse instanceof Object){
                    if ("message" in objectResponse && "status" in objectResponse) { //ToDo
                        if (response.data.status != 200){
                            errorDescription.SetAppError(objectResponse.message);
                        }
                    }
                }
            } else {
                errorDescription.SetHTTPError(response.statusText, response.status);
            }
            if (errorDescription.error) {
                var errorDescriptions = dataStorage.getErrorDescriptions();
                errorDescriptions.addErrorDescription(errorDescription);
                errorDescriptions.show = true;
                /*$location.path("/error");*/
            }
            return $q.reject(response);
        }
    };
}

function getAppHttpUrl($location, urlSufix){
    var appAddress = "http://"+$location.$$host+":"+$location.$$port;

    return appAddress + urlSufix;
}

function setRoute(routeProvider){
    routeProvider
        .when('/login', {
            templateUrl : '/login',
            controller: 'workPlaceController'
        })
        .when("/user", {
            templateUrl: "/security/usersList"
        })
        .when("/role", {
            templateUrl: "/security/roleList"
        })
        .when("/project", {
            templateUrl: "/projectsList"
        })
        .when("/task", {
            templateUrl: "/tasksList"
        })
        .when("/currentPrincipalInformation", {
            templateUrl: "/currentPrincipalInformation",
            controller: 'workPlaceController'
        });
    return routeProvider;
}

function entityEditService($location, resource){
    return resource(getAppHttpUrl($location, '/entity/:entityName/:entityId'), {
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
        });
}

function securityService($location, resource){
    return resource(getAppHttpUrl($location, '/system/security/:command'), {
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
        });
}

function operationService($location, resource){
    return resource(getAppHttpUrl($location, '/service/:command'), {
            command: "@command"
        },
        {
            executeCommand: {
                method: "GET"
            }
        });
}

function systemService($location, resource){
    return resource(getAppHttpUrl($location, '/system/:command'), {
            command: "@command"
        },
        {
            executeCommand: {
                method: "GET"
            }
        });
}

function resourceService(_entityEditService, _systemService, _securityService, _operationService) {

    var entityEditService   = _entityEditService;
    var systemService       = _systemService;
    var securityService    = _securityService;
    var operationService    = _operationService;

    return {
        getEntityEditService: function () {
            return entityEditService;
        },
        getSystemService: function(){
            return systemService;
        },
        getSecurityService: function(){
            return securityService;
        },
        getOperationService: function(){
            return operationService;
        }
    };
}

function dataStorage() {

    var appMetadataSet = null;
    var principal = {};

    var userList = {};
    var roleList = {};
    var projectList = {};
    var taskList = {};
    var errorDescriptions = {};

    var currentUser = null;
    var currentRole = null;
    var currentProject = null
    var currentTask = null;
    var appEnums = [];

    return {

        getAppMetadaSet: function(){
            return appMetadataSet;
        },
        setAppMetadataSet: function(metadataSet){
            appMetadataSet = metadataSet;
        },
        getPrincipal: function(){
            if(!(principal instanceof Principal)){
                principal = new Principal();
            }
            return principal;
        },

        getErrorDescriptions: function(){
            if (!(errorDescriptions instanceof ErrorDescriptions)) {
                errorDescriptions = new ErrorDescriptions();
            }
            return errorDescriptions;
        },

        getEnumValues: function(resourceService, _entityId){
            if(appEnums[_entityId] == undefined) {
                var appEnum = new AppEnum(_entityId);
                appEnums[_entityId] = appEnum;
                appEnum.update(resourceService);
            }
            return appEnums[_entityId];
        },

        setUserList: function (_data) {
            userList = _data;
        },
        getUserList: function () {
            return appMetadataSet.getEntityList("user");
        },
        setProjectList: function (_data) {
            projectList = _data;
        },
        getProjectList: function () {
            return appMetadataSet.getEntityList("project");
        },
        setRoleList: function (_data){
            roleList = _data;
        },
        getRoleList: function (){
            return appMetadataSet.getEntityList("role");
        },
        setTaskList: function (_data) {
            taskList = _data;
        },
        getTaskList: function () {
            return appMetadataSet.getEntityList("task");
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

function ErrorDescription(){
    this.error = false;
    this.status = 0;
    this.statusText = "";
    this.type = 'success';

    this.SetNoError = function(){
        this.error = false;
        this.status = 200;
        this.statusText = "";
    };
    this.SetHTTPError = function(statusText, status){
        this.error = true;
        this.status = status;
        this.statusText = "HTTP error: "+statusText;
    };
    this.SetAppError = function(statusText){
        this.error = true;
        this.status = 0;
        this.statusText = "App error: "+statusText;
    }

}

function ErrorDescriptions(){
    this.errorDescriptions = [];
    this.show = false;

    this.addErrorDescription = function(_data){
        this.errorDescriptions.push(_data);
    };

    this.delErrorDescription = function(index){
        this.errorDescriptions.splice(index, 1);
    };
    this.getErrorDescriptions = function(){
        return this.errorDescriptions;
    };
    this.errorsCount = function(){
        return this.errorDescriptions.length;
    }
}

function MenuCommand(){
    this.dropdownMenu = false;

    this.text = "";
    this.command = "#";

    this.list = [];

    this.addElement = function(menuElement){
        this.list.push(menuElement);

        return this;
    };

}

function updateCurrentUserForPrincipal(dataStorage, resourceService){
    var currentPrincipal = dataStorage.getPrincipal();
    var userList = dataStorage.getUserList();
    userList.update(function(){
        currentPrincipal.currentUser = dataStorage.getUserList().findEntityById(currentPrincipal.currentUserId);
    });
}

function Principal(){
    this.authenticated = false;
    this.name = 'NO_Authentication';
    this.sessionId = null;
    this.authorities = [];
    this.currentUserId = 0;
    this.currentUser = {};

    this.logout = function($http) {
        var self = this;
        $http.post('\logout', {}).finally(function() {
            self.authenticated = false;
            setNotAuthenticated(self);
        });
    };
    this.login = function($http, credentials, callback) {
        var self = this;
        authenticate($http, credentials, function(data) {
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
    };
    this.getSessionInformation = function(resourceService, $cookies){
        var securityService = resourceService.getSecurityService();

        var currentPrincipal = this;
        securityService.getSessionInformation({}, {}, function(response){
            if (response.status == 200) {
                var data = response.data;
                currentPrincipal.setAuthenticated(data);
            }
        })
    };

    var setNotAuthenticated = function(currentPrincipal){
        currentPrincipal.authenticated  = false;
        currentPrincipal.name           = 'NO_Authentication';
        currentPrincipal.sessionId      = null;
        currentPrincipal.authorities    = [];
        currentPrincipal.currentUserId  = 0;
        currentPrincipal.currentUser    = {};
    };
    this.setAuthenticated = function(data){
        setNotAuthenticated(self);
        if(data != undefined){
            this.authenticated  = true;
            this.name           = data.userName;
            this.sessionId      = data.sessionId;
            this.authorities    = data.authorities;
            this.currentUserId  = data.currentUserId;
        }
    };
    var authenticate = function($http, credentials, callback) {

        var principal  = undefined;
        var headers = credentials ? {
            authorization : "Basic "
            + btoa(credentials.username + ":"
            + credentials.password)
        } : {};

        $http.get('/service/authenticate', {
                    headers : headers
                })
            .then(function(response){
                if (response.data.status == 200){
                    var principal = response.data.data;
                }
                callback && callback({authenticated: true, principal: principal});
                }, function() {
                callback && callback({authenticated: false, principal: principal});
                }
            );
    };

}

////////////////////////////////////
// UTILS
////////////////////////////////////

function ExecuteSystemCommand(resourceService, command){
    var systemService = resourceService.getSystemService();
    systemService.executeCommand({command: command}, {});
}
function ExecuteServiceCommand(resourceService, command){
    var operationService = resourceService.getOperationService();
    operationService.executeCommand({command: command}, {});
}
