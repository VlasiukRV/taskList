
workPlaceController = function($window, $http, $cookies, $rootScope, $scope, $location, dataStorage, resourceService, dateFilter){

    var cookies = $cookies;

    $scope.errorDescriptions = dataStorage.getErrorDescriptions();
    $scope.menuBar = getMenuBar(resourceService);
    $scope.principal = dataStorage.getPrincipal();

    $scope.getCurrentTime = function() {
        return dateFilter(new Date(), 'M/d/yy h:mm:ss a');
    };

    $scope.login = function(){
        $scope.showLogin = true;
        $location.url("login");
    };
    $scope.eventAfterLogin = function(){
        if($scope.principal.authenticated){
            $scope.principal.getSessionInformation(resourceService, cookies);
            updateCurrentUserForPrincipal(dataStorage, resourceService);
            $location.path("/task");
        }else{
            $location.path("/");
        }
    };
    $scope.logout = function(){
        if($scope.principal.authenticated) {
            $scope.principal.logout($http);
            $location.path("/");
        }
    };
};
