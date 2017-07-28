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
        entityListForm.filter_listProperties = objectProperties.getTaskObjectProperties().filter_listProperties;

        entityListForm.eventCloseForm = closeListForm;
        entityListForm.eventUpdateForm = updateForm;
        entityListForm.eventAddNewEntity = addNewEntity;
        entityListForm.eventEditEntity = editEntity;
        entityListForm.eventDeleteEntity = deleteEntity;
        entityListForm._show = _show;
        $scope.entityListForm = entityListForm;
        var filter_listProperties = entityListForm.filter_listProperties;
        $scope.filter_list = {};
        for (var index = 0; index < filter_listProperties.length; ++index) {
            $scope.filter_list[filter_listProperties[index].name] = {};
        }

        var entityList = dataStorage.getTaskList();
        entityList.update(resourceService, function(data){
            updateViewEntityList(data);
        });

    }

    function addNewEntity(){
        var newTask = new Task(dataStorage);
        var currentPrincipal = dataStorage.getPrincipal();
        if(currentPrincipal.currentUser){
            newTask.author = currentPrincipal.currentUser;
        }
        openEditForm(newTask)
    }

    function editEntity(id){
        var entity = dataStorage.getTaskList().findEntityById(id);
        if(entity != undefined){
            var editEntity = new Task(dataStorage);
            appUtils.fillValuesProperty(entity, editEntity);
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

    function _show(entity){
        var showEntity = true;
/*
        var filter_list = $scope.filter_list;
        for (var key in filter_list) {
            if($scope.filter_list[key] != undefined){
                if(entity[key] != filter_list[key]){
                    showEntity = false;
                    break;
                }
            }
        }
*/
        return false;
    };

};