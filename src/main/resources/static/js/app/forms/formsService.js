
function ListEntityController($scope, dataStorage){
    this.appMetadataSet = dataStorage.getAppMetadaSet();

    this.initController = function(){
        $scope.$parent.openListForm = this.openListForm;
        $scope.$parent.closeListForm = this.closeListForm;

        var metadataSpecification = this.appMetadataSet.getEntityList(this.metadataName);
        var entityListForm = this.appMetadataSet.interface.editFormGetEntityListForm();

        entityListForm.metadataName = this.metadataName;
        entityListForm.appMetadataSet = this.appMetadataSet;
        entityListForm.metadataSpecification = metadataSpecification;
        entityListForm.editFormName = metadataSpecification.metadataObject.description;
        entityListForm.formProperties = metadataSpecification.metadataObject.fmListForm.metadataEditFieldsSet;
        entityListForm.entities = metadataSpecification.list;

        entityListForm.eventCloseForm = this.closeListForm;
        entityListForm.eventUpdateForm = this.updateForm;
        entityListForm.eventAddNewEntity = this.addNewEntity;
        entityListForm.eventEditEntity = this.editEntity;
        entityListForm.eventDeleteEntity = this.deleteEntity;

        entityListForm.openEditForm = this.openEditForm;
        entityListForm.updateViewEntityList = this.updateViewEntityList;
        entityListForm.closeListForm = this.closeListForm;

        $scope.entityListForm = entityListForm;

        this.updateForm();
    };

    this.addNewEntity = function(){
        this.openEditForm(this.appMetadataSet.getEntityList(this.metadataName).metadataObject.getEntityInstance())
    };

    this.editEntity = function(id){
        var entity = this.appMetadataSet.getEntityList(this.metadataName).findEntityById(id);
        if(entity != undefined){
            var editEntity = this.appMetadataSet.getEntityList(this.metadataName).metadataObject.getEntityInstance();
            appUtils.fillValuesProperty(entity, editEntity);
            this.openEditForm(editEntity);
        }
    };

    this.deleteEntity = function(id){
        this.appMetadataSet.getEntityList(this.metadataName).deleteEntity(id, function(data){
            this.updateViewEntityList();
        });
    };

    this.updateViewEntityList = function(){
        this.appMetadataSet.metadataEvents.publish("ev:entityList:" +this.metadataName+ ":update");
    };

    this.openEditForm = function(currentEntity){
        dataStorage.setCurrentEntityByName(this.metadataName, currentEntity);
        this.closeListForm();
    };

    this.closeListForm = function(){
        $scope.$parent.showListForm = false;
        $scope.$parent.openEditForm();
    };

    this.openListForm = function(){
        $scope.$parent.showListForm = true;
    };

    this.updateForm = function(){
        this.updateViewEntityList();
    };

}

function EditEntityController($scope, dataStorage){
    this.appMetadataSet = dataStorage.getAppMetadaSet();
    this.currentEntity = dataStorage.getCurrentEntityByName(this.metadataName);

    this.initController = function(){
        $scope.$parent.openEditForm = this.openEditForm;
        $scope.$parent.closeEditForm = this.closeEditForm;

        var metadataSpecification = this.appMetadataSet.getEntityList(this.metadataName);

        var entityEditForm = this.appMetadataSet.interface.editFormGetEntityEditForm();
        entityEditForm.metadataName = this.metadataName;
        entityEditForm.appMetadataSet = this.appMetadataSet;
        entityEditForm.metadataSpecification = metadataSpecification;
        entityEditForm.editFormName = "New " +this.metadataName+ ":";
        entityEditForm.formProperties = metadataSpecification.metadataObject.fmEditForm.metadataEditFieldsSet;

        entityEditForm.eventCloseForm = this.closeEditForm;
        entityEditForm.eventUpdateForm = this.updateForm;
        entityEditForm.eventCreateEntity = this.createEntity;

        entityEditForm.openEditForm = this.openEditForm;
        entityEditForm.closeEditForm = this.closeEditForm;
        entityEditForm.updateForm = this.updateForm;
        entityEditForm.createEntity = this.createEntity;

        $scope.entityEditForm = entityEditForm;
    };

    this.updateForm = function(){
        this.currentEntity = dataStorage.getCurrentEntityByName(this.metadataName);
    };

    this.createEntity = function(template){
        var entityList = this.appMetadataSet.getEntityList(this.metadataName);
        var self = this;
        entityList.addEntityByTemplate(template, function(){
            self.appMetadataSet.metadataEvents.publish("ev:entityList:" +self.metadataName+ ":update", function(){
                self.closeEditForm();
            });
        });
    };

    this.openEditForm = function(){
        $scope.$parent.showEditForm = true;
        this.updateForm();
    };

    this.closeEditForm = function(){
        $scope.$parent.showEditForm = false;
        $scope.$parent.openListForm();
    };

}
