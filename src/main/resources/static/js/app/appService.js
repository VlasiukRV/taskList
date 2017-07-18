
////////////////////////////////////
// INTERFACE
////////////////////////////////////

function getMenuBar(resourceService){

    var menuTask = new MenuCommand();
    menuTask.text = "Task";
    menuTask.command = "task";
    var menuProject = new MenuCommand();
    menuProject.text = "Project";
    menuProject.command = "project";
    var menuUser = new MenuCommand();
    menuUser.text = "User";
    menuUser.command = "user";
    var menuRole = new MenuCommand();
    menuRole.text = "Role";
    menuRole.command = "role";

    var menuModel = new MenuCommand();
    menuModel.text = "Model";
    menuModel.dropdownMenu = true;
    menuModel.addElement(menuTask)
        .addElement(menuProject)
        .addElement(menuUser)
        .addElement(menuRole);

    var menuInitDataBase = new MenuCommand();
    menuInitDataBase.text = "initDataBase";
    menuInitDataBase.command = function(){ExecuteSystemCommand(resourceService, "jdbc/initDataBase")};
    var menuRunArchiveService = new MenuCommand();
    menuRunArchiveService.text = "runArchiveService";
    menuRunArchiveService.command = function(){ExecuteSystemCommand(resourceService, "taskScheduler/runArchiveService")};
    var menuStopArchiveService = new MenuCommand();
    menuStopArchiveService.text = "stopArchiveService";
    menuStopArchiveService.command = function(){ExecuteSystemCommand(resourceService, "taskScheduler/stopArchiveService")};
    var menuSendMail = new MenuCommand();
    menuSendMail.text = "sendMail";
    menuSendMail.command = function(){ExecuteSystemCommand(resourceService, "taskScheduler/sendMail")};
    var menuStopSendMail = new MenuCommand();
    menuStopSendMail.text = "stopSendMail";
    menuStopSendMail.command = function(){ExecuteSystemCommand(resourceService, "taskScheduler/stopSendMail")};
    var menuInterruptTaskExecutor = new MenuCommand();
    menuInterruptTaskExecutor.text = "interruptTaskExecutor";
    menuInterruptTaskExecutor.command = function(){ExecuteSystemCommand(resourceService, "taskScheduler/interruptTaskExecutor")};

    var menuSystem = new MenuCommand();
    menuSystem.text = "System";
    menuSystem.dropdownMenu = true;
    menuSystem.addElement(menuInitDataBase)
                .addElement(menuRunArchiveService)
                .addElement(menuStopArchiveService)
                .addElement(menuSendMail)
                .addElement(menuStopSendMail)
                .addElement(menuInterruptTaskExecutor);

    var menuCollection = [];
    menuCollection.push(menuModel);
    menuCollection.push(menuSystem);

    return {mainUrl: '#/task', menuCollection: menuCollection};
}

function objectProperties(resourceService, dataStorage){

    var user_formProperties;
    var user_listProperties;

    var role_formProperties;
    var role_listProperties;

    var task_formProperties;
    var task_listProperties;

    var project_formProperties;
    var project_listProperties;
    var task_filter_listProperties;

    fillPropertiesDescriptions();

    function fillPropertiesDescriptions() {

        var propertyId          = buildEntityProperty('id',             'text', 'id',                   false);
        var propertyDescription = buildEntityProperty('description',    'textarea');
        var propertyName        = buildEntityProperty('name',           'text');
        var propertyUserName    = buildEntityProperty('username',       'text');
        var propertyPassword    = buildEntityProperty('password',       'text');
        var propertyUserRole    = buildEntityProperty('role',           'text');
        var propertyRole        = buildEntityProperty('role',           'multiselect', 'role',          true, dataStorage.getRoleList());
        var propertyDate        = buildEntityProperty('date',           'date');
        var propertyTitle       = buildEntityProperty('title',          'text');
        var propertyAuthor      = buildEntityProperty('author',         'select','author',              true, dataStorage.getUserList());
        var propertyExecutor    = buildEntityProperty('executor',       'multiselect','executor',       true, dataStorage.getUserList());
        var propertyProject     = buildEntityProperty('project',        'select','project',             true, dataStorage.getProjectList());
        var propertyTaskState   = buildEntityProperty('state',          'enum','state',                 true, undefined);
        propertyTaskState.entityList = dataStorage.getEnumValues(resourceService, "TaskState");

        user_formProperties = [];
        user_formProperties.push(propertyId);
        user_formProperties.push(propertyUserName);
        user_formProperties.push(propertyPassword);
        user_formProperties.push(propertyRole);
        user_formProperties.push(propertyDescription);

        user_listProperties = [];
        user_listProperties.push(propertyId);
        user_listProperties.push(propertyUserName);
        user_listProperties.push(propertyRole);
        user_listProperties.push(propertyDescription);

        role_formProperties = [];
        role_formProperties.push(propertyId);
        role_formProperties.push(propertyUserRole);
        role_formProperties.push(propertyDescription);

        role_listProperties = [];
        role_listProperties.push(propertyId);
        role_listProperties.push(propertyUserRole);
        role_listProperties.push(propertyDescription);

        project_formProperties = [];
        project_formProperties.push(propertyId);
        project_formProperties.push(propertyName);
        project_formProperties.push(propertyDescription);

        project_listProperties = [];
        project_listProperties.push(propertyId);
        project_listProperties.push(propertyName);
        project_listProperties.push(propertyDescription);

        task_formProperties = [];
        task_formProperties.push(propertyId);
        task_formProperties.push(propertyProject);
        task_formProperties.push(propertyDate);
        task_formProperties.push(propertyTitle);
        task_formProperties.push(propertyAuthor);
        task_formProperties.push(propertyExecutor);
        task_formProperties.push(propertyDescription);
        task_formProperties.push(propertyTaskState);

        task_listProperties = [];
        task_listProperties.push(propertyId);
        task_listProperties.push(propertyProject);
        task_listProperties.push(propertyDate);
        task_listProperties.push(propertyTitle);
        task_listProperties.push(propertyAuthor);
        task_listProperties.push(propertyExecutor);
        task_listProperties.push(propertyDescription);
        task_listProperties.push(propertyTaskState);

        task_filter_listProperties = [];
        task_filter_listProperties.push(propertyProject);
    }

    return {
        getUserObjectProperties: function () {
            return new FormProperties(
                user_formProperties,
                user_listProperties
            );
        },
        getRoleObjectProperties: function () {
            return new FormProperties(
                role_formProperties,
                role_listProperties
            );
        },
        getProjectObjectProperties: function () {
            return new FormProperties(
                project_formProperties,
                project_listProperties
            );
        },
        getTaskObjectProperties: function () {
            return new FormProperties(
                task_formProperties,
                task_listProperties,
                task_filter_listProperties
            );
        }
    };
}

////////////////////////////////////
// SERVICEs
////////////////////////////////////

function getAppHttpUrl($location, urlSufix){
    var appAddress = "http://"+$location.$$host+":"+$location.$$port;

    return appAddress + urlSufix;
}

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

    var principal = {};

    var userList = {};
    var roleList = {};
    var projectList = {};
    var taskList = {};
    var errorDescriptions = {};

    var currentUser = {};
    var currentRole = {};
    var currentProject = {};
    var currentTask = {};
    var appEnums = [];

    return {

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
            if (!(userList instanceof UserList)) {
                userList = new UserList(this);
            }
            return userList;
        },
        setProjectList: function (_data) {
            projectList = _data;
        },
        setRoleList: function (_data){
            roleList = _data;
        },
        getRoleList: function (){
            if (!(roleList instanceof RoleList)){
                roleList = new RoleList(this);
            }
            return roleList
        },
        getProjectList: function () {
            if (!(projectList instanceof ProjectList)) {
                projectList = new ProjectList(this);
            }
            return projectList;
        },
        setTaskList: function (_data) {
            taskList = _data;
        },
        getTaskList: function () {
            if (!(taskList instanceof TaskList)) {
                taskList = new TaskList(this);
            }
            return taskList;
        },

        setCurrentUser: function (_data) {
            currentUser = _data;
        },
        getCurrentUser: function () {
            if (!(currentUser instanceof User)) {
                currentUser = this.getNewEntityByName('user');
            }
            return currentUser;
        },
        setCurrentRole: function (_data) {
            currentRole = _data;
        },
        getCurrentRole: function () {
            if (!(currentRole instanceof Role)) {
                currentRole = this.getNewEntityByName('role');
            }
            return currentRole;
        },
        setCurrentProject: function (_data) {
            currentProject = _data;
        },
        getCurrentProject: function () {
            if (!(currentProject instanceof Project)) {
                currentProject = this.getNewEntityByName('project');
            }
            return currentProject;
        },
        setCurrentTask: function (_data) {
            currentTask = _data;
        },
        getCurrentTask: function () {
            if (!(currentTask instanceof Task)) {
                currentTask = this.getNewEntityByName('task');
            }
            return currentTask;
        },

        getNewEntityByName: function (entityName) {
            switch (entityName) {
                case 'user':
                    return new User(this);
                    break;
                case 'role':
                    return new Role(this);
                    break;
                case 'project':
                    return new Project(this);
                    break;
                case 'task':
                    return new Task(this);
                    break;
                default:
                    return undefined;
            }
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

function Principal(){
    this.authenticated = false;
    this.name = 'NO_Authentication';
    this.sessionId = null;
    this.authorities = [];

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
            setAuthenticated(self, data.principal);
            callback && callback(self);
        })
    };
    this.getSessionInformation = function(resourceService, $cookies){
        var securityService = resourceService.getSecurityService();

        var currentPrincipal = this;
        var sessionID = "111111";
        securityService.getSessionInformation({sessionID: sessionID}, {}, function(response){
            if (response.result == 200) {
                var data = response.data;
                setAuthenticated(currentPrincipal, data);
            }
        })
    };

    var setNotAuthenticated = function(currentPrincipal){
        currentPrincipal.authenticated  = false;
        currentPrincipal.name           = 'NO_Authentication';
        currentPrincipal.sessionId      = null;
        currentPrincipal.authorities    = [];
    };
    var setAuthenticated = function(currentPrincipal, data){
        setNotAuthenticated(self);
        if(data != undefined){
            currentPrincipal.authenticated  = true;
            currentPrincipal.name           = data.userName;
            currentPrincipal.sessionId      = data.sessionId;
            currentPrincipal.authorities    = data.authorities;
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
                callback && callback({authenticated: false, principal: principal});
                }, function() {
                callback && callback({authenticated: false, principal: principal});
                }
            );
    };

}

////////////////////////////////////
// UTILS
////////////////////////////////////

fReplacerForEntityParser = function (key, value) {
    if (key == 'dataStorage' || key == 'representation') return undefined;
    if (key.indexOf("$$") >= 0) return undefined;
    if (key.indexOf("_") >= 0) return undefined;
    return value;
};


function ExecuteSystemCommand(resourceService, command){
    var systemService = resourceService.getSystemService();
    systemService.executeCommand({command: command}, {});
}
function ExecuteServiceCommand(resourceService, command){
    var operationService = resourceService.getOperationService();
    operationService.executeCommand({command: command}, {});
}

////////////////////////////////////
// BASE_MODEL
////////////////////////////////////

function AppEnum(enumName){
    this.enumName = enumName;
    this.list = {};

    this.update = function(resourceService){
        var source = this;
        resourceService.getEntityEditService()
            .getEntity({entityName: "enum", entityId: this.enumName}, {},
            function (data) {
                source.list = data.data;
            },
            function (httpResponse) {
                /*resourceService.collError(httpResponse)*/
            }
        );
    }
}

function BaseEntity(dataStorage) {
    this._entityName = '';
    this.dataStorage = dataStorage;

    this.id = "";
    this.description = "";

    this.isEmpty = function () {
        // ToDo ??????
        return this.id == 0;
    };

    this.createEntity = function (resourceService, fCallBack) {
        var entityJSON = JSON.stringify(this, fReplacerForEntityParser);
        resourceService.getEntityEditService()
            .createEntity({entityName: this._entityName}, entityJSON,
            baseCreateEntity.bind(this, fCallBack),
            function (httpResponse) {
                /*resourceService.collError(httpResponse)*/
            }
        )
    };

    var baseCreateEntity = function () {
        var fCallBack = arguments[0];
        var data = arguments[1];

        if (data.result = 200) {
            var originalEntity = data.data;
            fillValuesProperty(originalEntity, this);
            fCallBack(this);
        }
    };
}

function BaseEntityList(dataStorage) {
    this._entityName = '';
    this.dataStorage = dataStorage;
    this.list = [];

    this.addEntity = function (entity) {

        var entityAdded = false;
        for (var index = 0; index < this.list.length; ++index) {
            var item = this.list[index];
            if (item.id == entity.id) {
                this.list[index] = entity;
                entityAdded = true;
                return;
            }
        }
        if (!entityAdded) {
            this.list.push(entity);
        }
    };

    this.findEntityById = function (id) {
        for (var index = 0; index < this.list.length; ++index) {
            var item = this.list[index];
            if (item.id === id) {
                return item;
            }
        }
        return undefined;
    };

    this.update = function (resourceService, fCallBack) {
        this.list = [];
        resourceService.getEntityEditService()
            .getEntity({entityName: this._entityName}, {},
            update.bind(this, fCallBack),
                function (httpResponse) {
                    /*resourceService.collError(httpResponse)*/
                }
        );
    };

    this.addEntityByTemplate = function (resourceService, template, fCallBack) {
        var entity = null;
        if (template.isEmpty()) {
            entity = dataStorage.getNewEntityByName(this._entityName);
        } else {
            entity = this.findEntityById(template.id);
        }

        var entityList = this;
        fillValuesProperty(template, entity);
        entity.createEntity(resourceService, function (data) {
            entityList.addEntity(data);
            fCallBack();
        });
    };

    this.deleteEntity = function (resourceService, id, fCallBack) {
        resourceService.getEntityEditService()
            .deleteEntity({entityName: this._entityName, entityId: id}, {},
            deleteEntity.bind(this, id, fCallBack),
            function (httpResponse) {
                /*resourceService.collError(httpResponse)*/
            }
        )
    };

    var update = function () {
        var fCallBack = arguments[0];
        var data = arguments[1];

        if (data.result = 200) {
            var originalUserList = data.data;

            originalUserList.forEach(function (item, i, arr) {
                var entity = dataStorage.getNewEntityByName(this._entityName);
                fillValuesProperty(item, entity);
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
    }

}

