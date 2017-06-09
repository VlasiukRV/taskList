
workPlaceController = function($window, $http, $rootScope, $scope, $location, dataStorage, resourceService, dateFilter){

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
