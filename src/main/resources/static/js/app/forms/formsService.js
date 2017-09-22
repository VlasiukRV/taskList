
function ListEntityController($scope, dataStorage){
    this.appMetadataSet = dataStorage.getAppMetadaSet();
    this.numPerpage = 10;

    this.initController = function(){
        $scope.flagShowSearch = false;
        $scope.$parent.openListForm = this.openListForm;
        $scope.$parent.closeListForm = this.closeListForm;

        var metadataSpecification = this.appMetadataSet.getEntityList(this.metadataName);
        var entityListForm = this.appMetadataSet.userInterface.editFormGetEntityListForm();

        entityListForm.metadataName = this.metadataName;
        entityListForm.appMetadataSet = this.appMetadataSet;
        entityListForm.metadataSpecification = metadataSpecification;
        entityListForm.editFormName = metadataSpecification.metadataObject.description;
        entityListForm.formProperties = metadataSpecification.metadataObject.fmListForm.metadataEditFieldsSet;
        entityListForm.entities = metadataSpecification.list;

        entityListForm.numPerPage = this.numPerpage;
        entityListForm.currentPage = 1;
        entityListForm.totalItems = metadataSpecification.list.length;
        entityListForm.entitiesFiltered =  [];
        entityListForm.entitiesEmpty = [];

        entityListForm.eventCloseForm = this.closeListForm;
        entityListForm.eventUpdateForm = this.updateForm;
        entityListForm.eventAddNewEntity = this.addNewEntity;
        entityListForm.eventEditEntity = this.editEntity;
        entityListForm.eventDeleteEntity = this.deleteEntity;
        entityListForm.eventFindEntity = this.findEntity;

        entityListForm.openEditForm = this.openEditForm;
        entityListForm.updateViewEntityList = this.updateViewEntityList;
        entityListForm.closeListForm = this.closeListForm;
        entityListForm.eventPageChanged = this.pageChanged;

        $scope.entityListForm = entityListForm;
        $scope.$parent.entityListForm = entityListForm;

        entityListForm.eventUpdateForm();
    };

    this.pageChanged = function() {
        var begin = ((this.currentPage - 1) * this.numPerPage)
            , end = begin + this.numPerPage;
        this.entitiesFiltered = this.entities.slice(begin, end);
        this.entitiesEmpty = new Array(this.numPerPage - this.entitiesFiltered.length);
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
        var self = this;
        this.appMetadataSet.getEntityList(this.metadataName).deleteEntity(id, function(data){
            self.updateViewEntityList();
        });
    };

    this.findEntity = function(searchEx){
        var self = this;
        this.appMetadataSet.getEntityList(this.metadataName).findEntity(searchEx, function(data){
            self.totalItems = self.entities.length;
            self.eventPageChanged();
        });
    };

    this.updateViewEntityList = function(){
        var self = this;
        this.appMetadataSet.metadataEvents.publish("ev:entityList:" +this.metadataName+ ":update", function(){
            self.totalItems = self.entities.length;
            self.eventPageChanged();
        });
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
        this.entityListForm.updateViewEntityList();
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

        var entityEditForm = this.appMetadataSet.userInterface.editFormGetEntityEditForm();
        entityEditForm.metadataName = this.metadataName;
        entityEditForm.appMetadataSet = this.appMetadataSet;
        entityEditForm.metadataSpecification = metadataSpecification;
        entityEditForm.editFormName = "New " +this.metadataName+ ":";
        entityEditForm.formProperties = metadataSpecification.metadataObject.fmEditForm.metadataEditFieldsSet;
        entityEditForm.entityFieldsPlacing = metadataSpecification.metadataObject.fmEditForm.metadataEditFieldsPlacing;

        entityEditForm.eventCloseForm = this.closeEditForm;
        entityEditForm.eventUpdateForm = this.updateForm;
        entityEditForm.eventCreateEntity = this.createEntity;

        entityEditForm.openEditForm = this.openEditForm;
        entityEditForm.closeEditForm = this.closeEditForm;
        entityEditForm.updateForm = this.updateForm;
        entityEditForm.createEntity = this.createEntity;

        $scope.entityEditForm = entityEditForm;
        $scope.$parent.entityEditForm = entityEditForm;
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
        this.entityEditForm.updateForm();
    };

    this.closeEditForm = function(){
        $scope.$parent.showEditForm = false;
        $scope.$parent.openListForm();
    };

}
