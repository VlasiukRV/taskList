;
(function (exp) {
    if (!exp.appController) {
        exp.appController = new Object(null);
    }
    var appController = exp.appController;

    appController.workPlaceController = function ($window, $http, $cookies, $rootScope, $scope, $location, dataStorage, resourceService, dateFilter) {
        var cookies = $cookies;

        var appMetadataSet = appService.getMetadataSet(resourceService);
        dataStorage.setAppMetadataSet(appMetadataSet);
        $scope.errorDescriptions = appMetadataSet.userInterface.errorDescriptions;
        $scope.commandBar = appMetadataSet.userInterface.commandBar;
        $scope.principal = appMetadataSet.userInterface.security.principal;
        var selfScope = $scope;

        $scope.getCurrentTime = function () {
            return dateFilter(new Date(), 'M/d/yy h:mm:ss a');
        };

        $scope.login = function () {
            selfScope.showLogin = true;
            $location.url("/login");
        };
        $scope.eventAfterLogin = function () {
            var appMetadataSet = dataStorage.getAppMetadaSet();
            appMetadataSet.loadAllEntities();

            var currentPrincipal = appMetadataSet.userInterface.security.principal;
            if (currentPrincipal.authenticated) {
                currentPrincipal.getSessionInformation(resourceService, cookies);
                currentPrincipal.updatePrincipalUser(appMetadataSet);
                selfScope.principal = currentPrincipal;
                selfScope.showLogin = false;
            } else {
                $location.url(dataStorage.getAppConfig().appUrl);
            }
        };
        $scope.logout = function () {
            var appMetadataSet = dataStorage.getAppMetadaSet();
            var currentPrincipal = appMetadataSet.userInterface.security.principal;

            if (currentPrincipal.authenticated) {
                currentPrincipal.logout($http);
                $location.url(dataStorage.getAppConfig().appUrl);
            }
        };
    };

})(window);