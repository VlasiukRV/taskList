
workPlaceController = function($window, $http, $rootScope, $scope, $location, dataStorage, resourceService, dateFilter){

    var self = $scope;

    var authenticate = function(credentials, callback) {

        var headers = credentials ? {
            authorization : "Basic "
            + btoa(credentials.username + ":"
            + credentials.password)
        } : {};

        $http.get('/system/principal', {
            headers : headers
        }).then(function(response) {
            $rootScope.authenticated = !!response.data.name;
            callback && callback($rootScope.authenticated);
        }, function() {
            $rootScope.authenticated = false;
            callback && callback(false);
        });

    };

    $scope.credentials = {};
    $scope.login = function() {
        authenticate(self.credentials, function(authenticated) {
            if (authenticated) {
                console.log("Login succeeded");
                $location.path("/");
                self.error = false;
                $rootScope.authenticated = true;
            } else {
                console.log("Login failed");
                $location.path("/login");
                self.error = true;
                $rootScope.authenticated = false;
            }
            self.getCurrentAuthentication();
        })
    };

    $scope.logout = function() {
        $http.post('logout', {}).finally(function() {
            $rootScope.authenticated = false;
            self.getCurrentAuthentication();
            $location.path("/");
        });
    };

    $scope.getCurrentTime = function() {
        return dateFilter(new Date(), 'M/d/yy h:mm:ss a');
    };

    $scope.getCurrentAuthentication = function() {
        if($rootScope.authenticated){
            var systemService = resourceService.getSystemService();
            systemService.executeCommand({command: 'getCurrentAuthentication'}, {},
                setCurrentAuthentication.bind(self));
        }else{
            setCurrentAuthentication();
        }

    };

    var setCurrentAuthentication = function(data) {
        $rootScope.userName = data ? data.data.userName : 'NO_Authentication';
    };

    authenticate();
    $scope.getCurrentAuthentication();
    $scope.errorDescriptions = dataStorage.getErrorDescriptions();

    $scope.initDataBase = function() {
        var systemService = resourceService.getSystemService();
        systemService.executeCommand({command: "jdbc/initDataBase"}, {});
    };
    $scope.runArchiveService = function(){
        var systemService = resourceService.getSystemService();
        systemService.executeCommand({command: "task/runArchiveService"}, {});
    };
    $scope.stopArchiveService = function(){
        var systemService = resourceService.getSystemService();
        systemService.executeCommand({command: "task/stopArchiveService"}, {});
    }
    $scope.interruptTaskExecutor = function(){
        var systemService = resourceService.getSystemService();
        systemService.executeCommand({command: "task/interruptTaskExecutor"}, {});
    }

};
