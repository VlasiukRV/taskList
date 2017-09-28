
userController = function($scope) {
    $scope.showEditForm = false;
    $scope.showListForm = true;

    $scope.openEditForm = function(){};
    $scope.closeEditForm = function(){};

    $scope.openListForm = function(){};
    $scope.closeListForm = function(){};
};

editUserController = function($scope, dataStorage) {

    appService.formsService.EditEntityController.apply(this, arguments);
    this.metadataName = "user";
    this.initController();

};

userListController = function($scope, dataStorage) {
    appService.formsService.ListEntityController.apply(this, arguments);
    this.metadataName = "user";
    this.initController();
};

roleController = function($scope){
    $scope.showEditForm = false;
    $scope.showListForm = true;

    $scope.openEditForm = function(){};
    $scope.closeEditForm = function(){};

    $scope.openListForm = function(){};
    $scope.closeListForm = function(){};
};

editRoleController = function($scope, dataStorage){
    appService.formsService.EditEntityController.apply(this, arguments);
    this.metadataName = "role";
    this.initController();
};

roleListController = function($scope, dataStorage) {
    appService.formsService.ListEntityController.apply(this, arguments);
    this.metadataName = "role";
    this.initController();
};