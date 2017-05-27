////////////////////////////////////
// CONTROLLERs
////////////////////////////////////

taskController = function($scope, dataStorage, resourceService, objectProperties){
    $scope.showEditForm = false;
    $scope.showListForm = true;

    $scope.openEditForm = function(){};
    $scope.closeEditForm = function(){};

    $scope.openListForm = function(){};
    $scope.closeListForm = function(){};
};

editTaskController = function($scope, dataStorage, resourceService, objectProperties){

    initController();

    function initController(){
        $scope.$parent.openEditForm = openEditForm;
        $scope.$parent.closeEditForm = closeEditForm;
        updateForm();
    }

    function updateForm(){
        var entityEditForm = new EntityEditForm();
        entityEditForm.editFormName = "New task:";
        entityEditForm.formProperties = objectProperties.getTaskObjectProperties().formProperties;
        entityEditForm.currentEntity = dataStorage.getCurrentTask();

        entityEditForm.eventCloseForm = closeEditForm;
        entityEditForm.eventUpdateForm = updateForm;
        entityEditForm.eventCreateEntity = createEntity;

        $scope.entityEditForm = entityEditForm;
    }

    function createEntity(template){
        var entityList = dataStorage.getTaskList();
        entityList.addEntityByTemplate(resourceService, template, function(){
            dataStorage.setTaskList(entityList);
            closeEditForm();
        });
    }

    function openEditForm(){
        $scope.$parent.showEditForm = true;
        updateForm();
    }
    function closeEditForm(){
        $scope.$parent.showEditForm = false;
        $scope.$parent.openListForm();
    }
};

taskListController = function($scope, dataStorage, resourceService, objectProperties){

    initController();

    function initController(){
        $scope.$parent.openListForm = openListForm;
        $scope.$parent.closeListForm = closeListForm;
        updateForm();
    }

    function updateForm(){
        var entityListForm = new EntityListForm();

        entityListForm.editFormName = "Tasks list:";
        entityListForm.formProperties = objectProperties.getTaskObjectProperties().listProperties;

        entityListForm.eventCloseForm = closeListForm;
        entityListForm.eventUpdateForm = updateForm;
        entityListForm.eventAddNewEntity = addNewEntity;
        entityListForm.eventEditEntity = editEntity;
        entityListForm.eventDeleteEntity = deleteEntity;
        $scope.entityListForm = entityListForm;

        var entityList = dataStorage.getTaskList();
        entityList.update(resourceService, function(data){
            updateViewEntityList(data);
        });

    }

    function addNewEntity(){
        openEditForm(new Task(dataStorage))
    }

    function editEntity(id){
        var entity = dataStorage.getTaskList().findEntityById(id);
        if(entity != undefined){
            var editEntity = new Task(dataStorage);
            fillValuesProperty(entity, editEntity);
            openEditForm(editEntity);
        }
    }

    function deleteEntity(id){
        var entityList = dataStorage.getTaskList();
        entityList.deleteEntity(resourceService, id, function(data){
            updateViewEntityList(data);
        });
    }

    function updateViewEntityList(entityList){
        $scope.entityListForm.entities = entityList.list;
    }

    function openEditForm(currentEntity){
        dataStorage.setCurrentTask(currentEntity);
        closeListForm();
    }

    function closeListForm(){
        $scope.$parent.showListForm = false;
        $scope.$parent.openEditForm();
    }
    function openListForm(){
        $scope.$parent.showListForm = true;
    }

};