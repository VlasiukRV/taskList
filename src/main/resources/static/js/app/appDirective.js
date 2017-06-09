
function directiveLoginPage(){
    return{
        restrict: 'E',
        require: '',
        replace: true,
        templateUrl: '/templates/directive/login-page.html',
        scope:{
            eventAfterLogin: "&"
        },
        controller:['$http', '$rootScope', '$scope', 'dataStorage', function($http, $rootScope, $scope, dataStorage){
            var self = $scope;
            $scope.credentials = {};
            $scope.login = function(){
                var principal = dataStorage.getPrincipal();
                principal.login($http, $scope.credentials, function(data){
                    if(data.authenticated){
                        $scope.eventAfterLogin();
                    }
                });
            };
       }]
    }
}

function directiveMessageLine(){
    return{
        restrict: 'E',
        require: '',
        templateUrl: '/templates/directive/message-line.html',
        scope:{
            errorDescriptions: "="
        },
        link: function(scope, element, attrs){

        },
        controller:['$scope', 'dataStorage', function($scope, dataStorage){
            $scope.updateErrorDescription = function() {
                $scope.errorDescriptions = dataStorage.getErrorDescriptions();
            };
            $scope.deleteErrorDescription = function(index){
                $scope.errorDescriptions.delErrorDescription(index)
            };
        }]
    }
}

function directiveMenuBar(){
    return{
        restrict: 'E',
        require: '',
        replace: true,
        templateUrl: '/templates/directive/menu-bar.html',
        scope:{
            menuBar: "="
        }
    }
}

function directiveMenuCollection(){
    return{
        restrict: 'E',
        require: '',
        replace: true,
        templateUrl: '/templates/directive/menu-collection.html',
        scope:{
            menuCollection: "=",
            command: "="
        }
    }
}

function directiveMenuItem($compile){
    return{
        restrict: 'E',
        require: '',
        replace: true,
        templateUrl: '/templates/directive/menu-item.html',
        scope:{
            command: "="
        },
        link: function(scope, element, attrs){
            if (scope.command.dropdownMenu) {
                var e =$compile("<menu-collection command = 'command' menu-collection='command.list'></menu-collection>")(scope);
                element.replaceWith(e);
            }
        },
        controller:['$scope', '$window', '$location', function($scope, $window, $location){
            $scope.commandHandler = function(){
                if (typeof($scope.command.command) == 'string'){
                    $location.url($scope.command.command);
                }else{
                    $scope.command.command();
                }
            };
        }]
    }
}
function directiveUpdatableText($interval){
    return {
        restrict: 'E',
        scope:{
            fCallBack: "&"
        },
        link: function link(scope, element, attrs) {
            var format = 'M/d/yy h:mm:ss a';
            var timeoutId;

            var updateText = function updateText(){
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
}

function directiveCurrentTime($interval, dateFilter) {
    return {
        link: function link(scope, element, attrs) {

            var timeoutId;

            var updateTimer = function() {
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