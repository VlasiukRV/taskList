////////////////////////////////////
// CONTROLLERs
////////////////////////////////////

projectController = function($scope, dataStorage, resourceService, objectProperties){
    $scope.showEditForm = false;
    $scope.showListForm = true;

    $scope.openEditForm = function(){};
    $scope.closeEditForm = function(){};

    $scope.openListForm = function(){};
    $scope.closeListForm = function(){};
};

editProjectController = function($scope, dataStorage, resourceService, objectProperties){

    initController();

    function initController(){
        $scope.$parent.openEditForm = openEditForm;
        $scope.$parent.closeEditForm = closeEditForm;
        updateForm();
    }

    function updateForm(){
        var entityEditForm = new EntityEditForm();
        entityEditForm.editFormName = "New project:";
        entityEditForm.formProperties = objectProperties.getProjectObjectProperties().formProperties;
        entityEditForm.currentEntity = dataStorage.getCurrentProject();

        entityEditForm.eventCloseForm = closeEditForm;
        entityEditForm.eventUpdateForm = updateForm;
        entityEditForm.eventCreateEntity = createEntity;

        $scope.entityEditForm = entityEditForm;
    }

    function createEntity(template){
        var entityList = dataStorage.getProjectList();
        entityList.addEntityByTemplate(resourceService, template, function(){
            dataStorage.setProjectList(entityList);
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

projectListController = function($scope, dataStorage, resourceService, objectProperties){

    initController();

    function initController(){
        $scope.$parent.openListForm = openListForm;
        $scope.$parent.closeListForm = closeListForm;
        updateForm();
    }

    function updateForm(){
        var entityListForm = new EntityListForm();

        entityListForm.editFormName = "Projects list:";
        entityListForm.formProperties = objectProperties.getProjectObjectProperties().listProperties;

        entityListForm.eventCloseForm = closeListForm;
        entityListForm.eventUpdateForm = updateForm;
        entityListForm.eventAddNewEntity = addNewEntity;
        entityListForm.eventEditEntity = editEntity;
        entityListForm.eventDeleteEntity = deleteEntity;
        $scope.entityListForm = entityListForm;

        var entityList = dataStorage.getProjectList();
        entityList.update(resourceService, function(data){
            updateViewEntityList(data);
        });

    }

    function addNewEntity(){
        openEditForm(new Project(dataStorage))
    }

    function editEntity(id){
        var entity = dataStorage.getProjectList().findEntityById(id);
        if(entity != undefined){
            var editEntity = new Project(dataStorage);
            fillValuesProperty(entity, editEntity);
            openEditForm(editEntity);
        }
    }

    function deleteEntity(id){
        var entityList = dataStorage.getProjectList();
        entityList.deleteEntity(resourceService, id, function(data){
            updateViewEntityList(data);
        });
    }

    function updateViewEntityList(entityList){
        $scope.entityListForm.entities = entityList.list;
    }

    function openEditForm(currentEntity){
        dataStorage.setCurrentProject(currentEntity);
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