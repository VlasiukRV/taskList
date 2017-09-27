app
        .config(['$locationProvider', function ($locationProvider) {
            $locationProvider.hashPrefix('');
        }])
        .config(['$httpProvider', function ($httpProvider) {
            $httpProvider.interceptors.push('myHttpResponseInterceptor');
        }])
        .config(['$routeProvider', function ($routeProvider) {
            setRoute($routeProvider);
        }])
        .config(['$provide', function ($provide) {
            $provide.decorator('$locale', ['$delegate', function ($delegate) {
                $delegate.NUMBER_FORMATS.PATTERNS[1].negPre = '-\u00A4';
                $delegate.NUMBER_FORMATS.PATTERNS[1].negSuf = '';
                return $delegate;
            }]);

        }])

        .factory('myHttpResponseInterceptor', ['$q', 'dataStorage', function ($q, dataStorage) {
            return appHttpResponseInterceptor($q, dataStorage);
        }])
        .factory('entityEditService', ['$resource', 'appEnvironment', function ($resource, appEnvironment) {
            return entityEditService($resource, appEnvironment);
        }])
        .factory('securityService', ['$resource', 'appEnvironment', function ($resource, appEnvironment) {
            return securityService($resource, appEnvironment);
        }])
        .factory('operationService', ['$resource', 'appEnvironment', function ($resource, appEnvironment) {
            return operationService($resource, appEnvironment);
        }])
        .factory('systemService', ['$resource', 'appEnvironment', function ($resource, appEnvironment) {
            return systemService($resource, appEnvironment);
        }])
        .factory('resourceService', function (entityEditService, systemService, securityService, operationService) {
            return resourceService(entityEditService, systemService, securityService, operationService)
        })
        .service('appEnvironment', ['$location', 'appConfig', function($location, appConfig){
            return appEnvironment($location, appConfig);
        }])
        .service('dataStorage', ['appConfig', function (appConfig) {
            return dataStorage(appConfig);
        }])

        .directive('smDatepicker', function () {
            return directiveDatePicker();
        })
        .directive('button', function () {
            return directiveButton();
        })
        .directive('entityProperty', function () {
            return directiveEntityProperty();
        })
        .directive('entityEditForm', function () {
            return directiveEntityEditForm();
        })
        .directive('entityEditFormCol', ['$compile', function ($compile) {
            return directiveEntityEditFormCol($compile);
        }])
        .directive('entityEditFormRow', function () {
            return directiveEntityEditFormRow();
        })
        .directive('entityListForm', function () {
            return directiveEntityListForm();
        })
        .directive('updatableText', ['$interval', function ($interval) {
            return directiveUpdatableText($interval);
        }])
        .directive('messageLine', [function () {
            return directiveMessageLine();
        }])
        .directive('menuBar', [function () {
            return directiveMenuBar();
        }])
        .directive('menuCollection', [function () {
            return directiveMenuCollection();
        }])
        .directive('menuItem', ['$compile', function ($compile) {
            return directiveMenuItem($compile);
        }])
        .directive('loginPage', [function () {
            return directiveLoginPage();
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
        workPlaceController
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
