
////////////////////////////////////
// CONTROLLERs
////////////////////////////////////

userController = function($scope, dataStorage){
    $scope.showEditForm = false;
    $scope.showListForm = true;

    $scope.openEditForm = function(){};
    $scope.closeEditForm = function(){};

    $scope.openListForm = function(){};
    $scope.closeListForm = function(){};
};

editUserController = function($scope, dataStorage){

    EditEntityController.apply(this, arguments);
    this.metadataName = "user";
    this.initController();

};

userListController = function($scope, dataStorage){
    ListEntityController.apply(this, arguments);
    this.metadataName = "user";
    this.initController();
};

roleController = function($scope, dataStorage){
    $scope.showEditForm = false;
    $scope.showListForm = true;

    $scope.openEditForm = function(){};
    $scope.closeEditForm = function(){};

    $scope.openListForm = function(){};
    $scope.closeListForm = function(){};
};

editRoleController = function($scope, dataStorage){

    EditEntityController.apply(this, arguments);
    this.metadataName = "role";
    this.initController();

};

roleListController = function($scope, dataStorage){
    ListEntityController.apply(this, arguments);
    this.metadataName = "role";
    this.initController();
};
