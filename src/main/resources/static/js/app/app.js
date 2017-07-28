var app = angular.module('app', ['ui.bootstrap', 'ngResource', 'ngRoute', 'ngCookies', 'oi.select'])

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

        .factory('myHttpResponseInterceptor', ['$q', '$location', 'dataStorage', function ($q, $location, dataStorage) {
            return appHttpResponseInterceptor($q, $location, dataStorage);
        }])
        .factory('entityEditService', function ($location, $resource) {
            return entityEditService($location, $resource);
        })
        .factory('securityService', function ($location, $resource) {
            return securityService($location, $resource);
        })
        .factory('operationService', function ($location, $resource) {
            return operationService($location, $resource);
        })
        .factory('systemService', function ($location, $resource) {
            return systemService($location, $resource);
        })
        .factory('resourceService', function (entityEditService, systemService, securityService, operationService) {
            return resourceService(entityEditService, systemService, securityService, operationService)
        })
        .service('dataStorage', function () {
            return dataStorage();
        })
        .service('objectProperties', function (resourceService, dataStorage) {
            return objectProperties(resourceService, dataStorage);
        })

        .directive('smDatepicker', ['dateFilter', function (dateFilter) {
            return directiveDatePicker(dateFilter);
        }])
        .directive('button', function () {
            return directiveButton();
        })
        .directive('entityProperty', ['resourceService', 'dataStorage', function (resourceService, dataStorage) {
            return directiveEntityProperty(resourceService, dataStorage);
        }])
        .directive('entityEditForm', ['resourceService', function (resourceService) {
            return directiveEntityEditForm(resourceService);
        }])
        .directive('entityListForm', ['resourceService', function (resourceService) {
            return directiveEntityListForm(resourceService);
        }])
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

app.controller('taskController', ['$scope', 'dataStorage', 'resourceService', 'objectProperties',
    taskController($scope, dataStorage, resourceService, objectProperties)]);

app.controller('taskListController', ['$scope', 'dataStorage', 'resourceService', 'objectProperties',
    taskListController($scope, dataStorage, resourceService, objectProperties)]);

app.controller('editTaskController', ['$scope', 'dataStorage', 'resourceService', 'objectProperties',
    editTaskController($scope, dataStorage, resourceService, objectProperties)]);

app.controller('userController', ['$scope', 'dataStorage', 'resourceService', 'objectProperties',
    userController($scope, dataStorage, resourceService, objectProperties)]);

app.controller('userListController', ['$scope', 'dataStorage', 'resourceService', 'objectProperties',
    userListController($scope, dataStorage, resourceService, objectProperties)]);

app.controller('editUserController', ['$scope', 'dataStorage', 'resourceService', 'objectProperties',
    editUserController($scope, dataStorage, resourceService, objectProperties)]);

app.controller('roleController', ['$scope', 'dataStorage', 'resourceService', 'objectProperties',
    roleController($scope, dataStorage, resourceService, objectProperties)]);

app.controller('roleListController', ['$scope', 'dataStorage', 'resourceService', 'objectProperties',
    roleListController($scope, dataStorage, resourceService, objectProperties)]);

app.controller('editRoleController', ['$scope', 'dataStorage', 'resourceService', 'objectProperties',
    editRoleController($scope, dataStorage, resourceService, objectProperties)]);
