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
            config.url = config.url.split('%2F').join('/')
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
                dataStorage.getErrorDescriptions().addErrorDescription(errorDescription);
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
                    var objectResponse=eval("("+response.data+")");
                }
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
                dataStorage.getErrorDescriptions().addErrorDescription(errorDescription);
                /*$location.path("/error");*/
            }
            return $q.reject(response);
        }
    };
};

function setRoute(routeProvider){
    routeProvider
        .when('/login', {
            templateUrl : 'login.html',
            controller: 'workPlaceController'
        })

        .when("/user", {
            templateUrl: "/usersList"
        })
        .when("/project", {
            templateUrl: "/projectsList"
        })
        .when("/task", {
            templateUrl: "/tasksList"
        })
        .when("/error", {
            templateUrl: "/errorPage"
        });

    return routeProvider;
};

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

function resourceService($window, _entityEditService, _systemService) {

    var entityEditService = _entityEditService;
    var systemService = _systemService;

    return {
        getEntityEditService: function () {
            return entityEditService;
        },
        getSystemService: function(){
            return _systemService;
        }
    };
}

function dataStorage() {

    var userList = {};
    var projectList = {};
    var taskList = {};
    var errorDescriptions = {};

    var currentUser = {};
    var currentProject = {};
    var currentTask = {};
    var appEnums = [];

    return {

        getEnumValues: function(resourceService, _entityId){
            if(appEnums[_entityId] == undefined) {
                var appEnum = new AppEnum(_entityId);
                appEnums[_entityId] = appEnum;
                appEnum.update(resourceService);
            }
            return appEnums[_entityId];
        },

        getErrorDescriptions: function(){
            if (!(errorDescriptions instanceof ErrorDescriptions)) {
                errorDescriptions = new ErrorDescriptions();
            }
            return errorDescriptions;
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

function objectProperties(resourceService, dataStorage){

    var user_formProperties;
    var user_listProperties;

    var task_formProperties;
    var task_listProperties;

    var project_formProperties;
    var project_listProperties;

    fillPropertiesDescriptions();

    function fillPropertiesDescriptions() {

        var propertyId          = buildEntityProperty('id',             'text', 'id',                   false);
        var propertyDescription = buildEntityProperty('description',    'textarea');
        var propertyName        = buildEntityProperty('name',           'text');
        var propertyPassword    = buildEntityProperty('password',       'text');
        var propertyDate        = buildEntityProperty('date',           'date');
        var propertyTitle       = buildEntityProperty('title',          'text');
        var propertyAuthor      = buildEntityProperty('author',         'select','author',              true, dataStorage.getUserList());
        var propertyExecutor    = buildEntityProperty('executor',       'multiselect','executor',       true, dataStorage.getUserList());
        var propertyProject     = buildEntityProperty('project',        'select','project',             true, dataStorage.getProjectList());
        var propertyTaskState   = buildEntityProperty('state',          'enum','state',                 true, undefined);
        propertyTaskState.entityList = dataStorage.getEnumValues(resourceService, "TaskState");

        user_formProperties = [];
        user_formProperties.push(propertyId);
        user_formProperties.push(propertyName);
        user_formProperties.push(propertyPassword);
        user_formProperties.push(propertyDescription);

        user_listProperties = [];
        user_listProperties.push(propertyId);
        user_listProperties.push(propertyName);
        user_listProperties.push(propertyDescription);

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

    }

    return {
        getUserObjectProperties: function () {
            return new FormProperties(
                user_formProperties,
                user_listProperties
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
                task_listProperties
            );
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

    this.addErrorDescription = function(_data){
        this.errorDescriptions.push(_data);
    };

    this.delErrorDescription = function(index){
        this.errorDescriptions.splice(index, 1);
    };
    this.getErrorDescriptions = function(){
        return this.errorDescriptions;
    }

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
        for (index = 0; index < this.list.length; ++index) {
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
        for (index = 0; index < this.list.length; ++index) {
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
        if (template.isEmpty()) {
            var entity = dataStorage.getNewEntityByName(this._entityName);
        } else {
            var entity = this.findEntityById(template.id);
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
