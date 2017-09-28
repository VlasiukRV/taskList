;
(function (exp) {
    if(!exp.appDirective){
        exp.appDirective = new Object(null);
    }
    var appDirective = exp.appDirective;

    appDirective.directiveLoginPage = function () {

        return {
            restrict: 'E',
            require: '',
            replace: true,
            templateUrl: '/templates/appRoom/tasklist/directive/login-page.html',
            scope: {
                eventAfterLogin: "&"
            },
            controller: ['$http', '$rootScope', '$scope', 'dataStorage', function ($http, $rootScope, $scope, dataStorage) {
                $scope.credentials = {};
                $scope.login = function () {
                    var appMetadataSet = dataStorage.getAppMetadaSet();
                    if (appMetadataSet) {
                        var principal = appMetadataSet.userInterface.security.principal;
                        if (principal) {
                            principal.login($http, $scope.credentials, function (data) {
                                if (data.authenticated) {
                                    $scope.eventAfterLogin();
                                }
                            });
                        }
                    }
                };
            }]
        }
    };

    appDirective.directiveMessageLine = function () {
        return {
            restrict: 'E',
            require: '',
            templateUrl: '/templates/appRoom/tasklist/directive/message-line.html',
            scope: {
                errorDescriptions: "="
            },
            link: function (scope, element, attrs) {

            },
            controller: ['$scope', 'dataStorage', function ($scope, dataStorage) {
                $scope.updateErrorDescription = function () {
                    $scope.errorDescriptions = dataStorage.getErrorDescriptions();
                };
                $scope.deleteErrorDescription = function (index) {
                    $scope.errorDescriptions.delErrorDescription(index);
                    if ($scope.errorDescriptions.errorsCount() == 0) {
                        $scope.errorDescriptions.show = false;
                    }
                };
            }]
        }
    };

    appDirective.directiveMenuBar = function () {
        return {
            restrict: 'E',
            require: '',
            replace: true,
            templateUrl: '/templates/appRoom/tasklist/directive/menu-bar.html',
            scope: {
                menuBar: "="
            }
        }
    };

    appDirective.directiveMenuCollection = function () {
        return {
            restrict: 'E',
            require: '',
            replace: true,
            templateUrl: '/templates/appRoom/tasklist/directive/menu-collection.html',
            scope: {
                menuCollection: "=",
                command: "="
            }
        }
    };

    appDirective.directiveMenuItem = function ($compile) {
        return {
            restrict: 'E',
            require: '',
            replace: true,
            templateUrl: '/templates/appRoom/tasklist/directive/menu-item.html',
            scope: {
                command: "="
            },
            link: function (scope, element, attrs) {
                if (scope.command.dropdownMenu) {
                    var e = $compile("<menu-collection command = 'command' menu-collection='command.commandList'></menu-collection>")(scope);
                    element.replaceWith(e);
                }
            },
            controller: ['$scope', '$window', '$location', function ($scope, $window, $location) {
                $scope.commandHandler = function () {
                    if (typeof($scope.command.command) == 'string') {
                        $location.url($scope.command.command);
                    } else {
                        $scope.command.command();
                    }
                };
            }]
        }
    };

    appDirective.directiveUpdatableText = function ($interval) {
        return {
            restrict: 'E',
            scope: {
                fCallBack: "&"
            },
            link: function link(scope, element, attrs) {
                var timeoutId;

                var updateText = function updateText() {
                    element.text(scope.fCallBack());
                };

                scope.$watch(attrs.smCurrentTime, function () {
                    updateText();
                });

                element.on('$destroy', function () {
                    $interval.cancel(timeoutId);
                });

                // start the UI update process; save the timeoutId for canceling
                timeoutId = $interval(function () {
                    updateText(); // update DOM
                }, 1000);
            }

        };
    };

    appDirective.directiveCurrentTime = function ($interval, dateFilter) {
        return {
            link: function link(scope, element, attrs) {
                var format = 'M/d/yy h:mm:ss a';
                var timeoutId;

                var updateTimer = function () {
                    element.text(dateFilter(new Date(), format));
                };

                scope.$watch(attrs.smCurrentTime, function () {
                    updateTimer();
                });

                element.on('$destroy', function () {
                    $interval.cancel(timeoutId);
                });

                // start the UI update process; save the timeoutId for canceling
                timeoutId = $interval(function () {
                    updateTimer(); // update DOM
                }, 1000);
            }

        };
    }

})(window);