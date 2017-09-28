app
    .config(['$locationProvider', function ($locationProvider) {
        $locationProvider.hashPrefix('');
    }])
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('myHttpResponseInterceptor');
    }])
    .config(['$routeProvider', function ($routeProvider) {
        appService.setRoute($routeProvider);
    }])
    .config(['$provide', function ($provide) {
        $provide.decorator('$locale', ['$delegate', function ($delegate) {
            $delegate.NUMBER_FORMATS.PATTERNS[1].negPre = '-\u00A4';
            $delegate.NUMBER_FORMATS.PATTERNS[1].negSuf = '';
            return $delegate;
        }]);

    }])

    .service('appEnvironment', ['$location', 'appConfig', function ($location, appConfig) {
        return appService.appEnvironment($location, appConfig);
    }])
    .service('dataStorage', ['appConfig', function (appConfig) {
        return appService.dataStorage(appConfig);
    }])

    .factory('myHttpResponseInterceptor', ['$q', 'dataStorage', function ($q, dataStorage) {
        return appService.appHttpResponseInterceptor($q, dataStorage);
    }])
    .factory('entityEditService', ['$resource', 'appEnvironment', function ($resource, appEnvironment) {
        return appService.entityEditService($resource, appEnvironment);
    }])
    .factory('securityService', ['$resource', 'appEnvironment', function ($resource, appEnvironment) {
        return appService.securityService($resource, appEnvironment);
    }])
    .factory('operationService', ['$resource', 'appEnvironment', function ($resource, appEnvironment) {
        return appService.operationService($resource, appEnvironment);
    }])
    .factory('systemService', ['$resource', 'appEnvironment', function ($resource, appEnvironment) {
        return appService.systemService($resource, appEnvironment);
    }])
    .factory('resourceService', function (entityEditService, systemService, securityService, operationService) {
        return appService.resourceService(entityEditService, systemService, securityService, operationService)
    })

    .directive('smDatepicker', function () {
        return appDirective.formsDirective.directiveDatePicker();
    })
    .directive('button', function () {
        return appDirective.formsDirective.directiveButton();
    })
    .directive('entityProperty', function () {
        return appDirective.formsDirective.directiveEntityProperty();
    })
    .directive('entityEditForm', function () {
        return appDirective.formsDirective.directiveEntityEditForm();
    })
    .directive('entityEditFormCol', ['$compile', function ($compile) {
        return appDirective.formsDirective.directiveEntityEditFormCol($compile);
    }])
    .directive('entityEditFormRow', function () {
        return appDirective.formsDirective.directiveEntityEditFormRow();
    })
    .directive('entityListForm', function () {
        return appDirective.formsDirective.directiveEntityListForm();
    })
    .directive('updatableText', ['$interval', function ($interval) {
        return appDirective.directiveUpdatableText($interval);
    }])
    .directive('messageLine', [function () {
        return appDirective.directiveMessageLine();
    }])
    .directive('menuBar', [function () {
        return appDirective.directiveMenuBar();
    }])
    .directive('menuCollection', [function () {
        return appDirective.directiveMenuCollection();
    }])
    .directive('menuItem', ['$compile', function ($compile) {
        return appDirective.directiveMenuItem($compile);
    }])
    .directive('loginPage', [function () {
        return appDirective.directiveLoginPage();
    }])

    .filter('myDate', ['dateFilter', function (dateFilter) {
        return function (input) {
            if (input == null) {
                return "";
            }
            var _date = dateFilter(new Date(input), 'dd.MM.yyyy');

            return _date.toUpperCase();
        };
    }])
;

// Controllers

app.controller('workPlaceController',
    [
        '$window', '$http', '$cookies', '$rootScope', '$scope', '$location', 'dataStorage', 'resourceService', 'dateFilter',
        appController.workPlaceController
    ]
);

app.controller('projectController',
    [
        '$scope',
        projectController
    ]
);

app.controller('projectListController',
    [
        '$scope', 'dataStorage',
        projectListController
    ]
);

app.controller('editProjectController',
    [
        '$scope', 'dataStorage',
        editProjectController
    ]
);

app.controller('taskController',
    [
        '$scope',
        taskController
    ]
);

app.controller('taskListController',
    [
        '$scope', 'dataStorage',
        taskListController
    ]
);

app.controller('editTaskController',
    [
        '$scope', 'dataStorage',
        editTaskController
    ]
);

app.controller('userController',
    [
        '$scope',
        userController
    ]
);

app.controller('userListController',
    [
        '$scope', 'dataStorage',
        userListController
    ]
);

app.controller('editUserController',
    [
        '$scope', 'dataStorage',
        editUserController
    ]
);

app.controller('roleController',
    [
        '$scope',
        roleController
    ]
);

app.controller('roleListController',
    [
        '$scope', 'dataStorage',
        roleListController
    ]
);

app.controller('editRoleController',
    [
        '$scope', 'dataStorage',
        editRoleController
    ]
);
