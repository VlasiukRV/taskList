
workPlaceController = function($window, $http, $cookies, $rootScope, $scope, $location, dataStorage, resourceService, dateFilter){
    var cookies = $cookies;

    var appMetadataSet = getMetadataSet(resourceService);
    dataStorage.setAppMetadataSet(appMetadataSet);
    $scope.errorDescriptions    = appMetadataSet.interface.errorDescriptions;
    $scope.commandBar           = appMetadataSet.interface.commandBar;
    $scope.principal            = appMetadataSet.interface.security.principal;
    var selfScope = $scope;

    $scope.getCurrentTime = function() {
        return dateFilter(new Date(), 'M/d/yy h:mm:ss a');
    };

    $scope.login = function(){
        selfScope.showLogin = true;
        $location.url("/login");
    };
    $scope.eventAfterLogin = function(){
        var appMetadataSet = dataStorage.getAppMetadaSet();
        appMetadataSet.loadAllEntities();

        var currentPrincipal = appMetadataSet.interface.security.principal;
        if(currentPrincipal.authenticated){
            currentPrincipal.getSessionInformation(resourceService, cookies);
            currentPrincipal.updatePrincipalUser(appMetadataSet);
            selfScope.principal = currentPrincipal;
            selfScope.showLogin = false;
            $location.url("/task");
        }else{
            $location.url("/appTaskList");
        }
    };
    $scope.logout = function(){
        var appMetadataSet = dataStorage.getAppMetadaSet();
        var currentPrincipal = appMetadataSet.interface.security.principal;

        if(currentPrincipal.authenticated) {
            currentPrincipal.logout($http);
            $location.url("/appTaskList");
        }
    };

    $scope.proba = function(){
        var d = dataStorage;
        var m = appMetadataSet;
        $scope.errorDescriptions.show = true;
    };
};
