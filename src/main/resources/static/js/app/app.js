var appAddress = "http://localhost:8080";
var app = angular.module('app', ['ui.bootstrap', 'ngResource', 'ngRoute', 'oi.select'])


        .config(['$httpProvider', function ($httpProvider) {
            $httpProvider.interceptors.push('myHttpResponseInterceptor');
        }])
        .factory('myHttpResponseInterceptor',['$q','$location', 'dataStorage',function($q, $location, dataStorage){
            return {
                'request': function(config) {
                    return config;
                },

                'response': function (response) {
                    var errorDescription = new ErrorDescription();
                        errorDescription.SetNoError();
                        if (response.status = 200) {
                            if (response.data instanceof Object) {
                                if ("message" in response.data && "result" in response.data) { //ToDo
                                    if (response.data.result != "success") {
                                        errorDescription.SetAppError(response.data.message);
                                    }
                                }
                            }
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
                        if (response.status = 200) {
                            if (response.data instanceof Object) {
                                if ("message" in response.data && "result" in response.data) { //ToDo
                                    if (response.data.result != "success") {
                                        errorDescription.SetAppError(response.data.message);
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
        }])

        .config(['$controllerProvider', function ($controllerProvider) {
            $controllerProvider.allowGlobals();
        }])
        .config(function ($routeProvider) {
            $routeProvider
                /*.when("/", {
                    templateUrl: "/"
                })*/

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
        })
        .factory('entityEditService', function ($resource) {
            return $resource(appAddress + '/entity/:entityName/:entityId', {
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
        })
        .factory('systemService', function ($resource) {
            return $resource(appAddress + '/system/:command', {
                    command: "@command"
                },
                {
                    getCurrentAuthentication: {
                        method: "GET"
                    }
                });
        })
        .service('resourceService', function ($window, entityEditService, systemService) {
            return resourceService($window, entityEditService, systemService)
        })
        .service('dataStorage', function () {
            return dataStorage();
        })
        .service('objectProperties', function (dataStorage) {
            return objectProperties(dataStorage);
        })

        .directive('smDatepicker', ['dateFilter', function (dateFilter) {
            return directiveDatePicker(dateFilter);
        }])
        .directive('button', function () {
            return directiveButton();
        })
        .directive('entityProperty', ['resourceService', function (resourceService) {
            return directiveEntityProperty(resourceService);
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
        .directive('messageLine', [function(){
            return directiveMessageLine();
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

        .config(['$provide', function ($provide) {
            $provide.decorator('$locale', ['$delegate', function ($delegate) {
                $delegate.NUMBER_FORMATS.PATTERNS[1].negPre = '-\u00A4';
                $delegate.NUMBER_FORMATS.PATTERNS[1].negSuf = '';
                return $delegate;
            }]);

        }])
    ;

// Controllers

app.controller('workPlaceController', ['$window', '$http', '$rootScope', '$scope', '$location', 'dataStorage', 'resourceService', 'dateFilter',
    workPlaceController($window, $http, $rootScope, $scope, $location, dataStorage, resourceService, dateFilter)]);

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
