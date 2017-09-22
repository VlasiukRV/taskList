app
        .config(['$controllerProvider', function ($controllerProvider) {
            $controllerProvider.allowGlobals();
        }])
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

app.controller('workPlaceController', ['$window', '$http', '$cookies', '$rootScope', '$scope', '$location', 'dataStorage', 'resourceService', 'dateFilter',
    workPlaceController($window, $http, $cookies, $rootScope, $scope, $location, dataStorage, resourceService, dateFilter)]);

app.controller('projectController', ['$scope',
    projectController($scope)]);

app.controller('projectListController', ['$scope', 'dataStorage',
    projectListController($scope, dataStorage)]);

app.controller('editProjectController', ['$scope', 'dataStorage',
    editProjectController($scope, dataStorage)]);

app.controller('taskController', ['$scope',
    taskController($scope)]);

app.controller('taskListController', ['$scope', 'dataStorage',
    taskListController($scope, dataStorage)]);

app.controller('editTaskController', ['$scope', 'dataStorage',
    editTaskController($scope, dataStorage)]);

app.controller('userController', ['$scope',
    userController($scope)]);

app.controller('userListController', ['$scope', 'dataStorage',
    userListController($scope, dataStorage)]);

app.controller('editUserController', ['$scope', 'dataStorage',
    editUserController($scope, dataStorage)]);

app.controller('roleController', ['$scope',
    roleController($scope)]);

app.controller('roleListController', ['$scope', 'dataStorage',
    roleListController($scope, dataStorage)]);

app.controller('editRoleController', ['$scope', 'dataStorage',
    editRoleController($scope, dataStorage)]);
