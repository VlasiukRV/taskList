projectController = function($scope) {
    $scope.showEditForm = false;
    $scope.showListForm = true;

    $scope.openEditForm = function(){};
    $scope.closeEditForm = function(){};

    $scope.openListForm = function(){};
    $scope.closeListForm = function(){};
};

editProjectController = function($scope, dataStorage) {
    appService.formsService.EditEntityController.apply(this, arguments);
    this.metadataName = "project";
    this.initController();
};

projectListController = function($scope, dataStorage) {
    appService.formsService.ListEntityController.apply(this, arguments);
    this.metadataName = "project";
    this.initController();
};
