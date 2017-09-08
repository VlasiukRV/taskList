taskController = function($scope) {
    $scope.showEditForm = false;
    $scope.showListForm = true;

    $scope.openEditForm = function(){};
    $scope.closeEditForm = function(){};

    $scope.openListForm = function(){};
    $scope.closeListForm = function(){};
};

editTaskController = function($scope, dataStorage) {
    EditEntityController.apply(this, arguments);
    this.metadataName = "task";
    this.initController();
};

taskListController = function($scope, dataStorage) {
    ListEntityController.apply(this, arguments);
    this.metadataName = "task";
    this.initController();
};
