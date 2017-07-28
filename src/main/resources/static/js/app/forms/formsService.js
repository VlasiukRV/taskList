
buildEntityProperty = function(name, inputType, label, availability, entityList){
    var entityProperty = new EntityProperty();

    entityProperty.name = name;
    if(inputType != undefined) {
        entityProperty.inputType = inputType;
    }
    if(label != undefined) {
        entityProperty.label = label;
    }else{
        entityProperty.label = name;
    }
    if(availability != undefined) {
        entityProperty.availability = availability;
    }
    if(entityList != undefined) {
        entityProperty.entityList = entityList;
    }

    return entityProperty;
};

function EntityProperty(){
    this.name ="";
    this.inputType ="text";
    this.label ="<--label for property-->";
    this.availability = true;

    this.entityList = {};
}

function FormProperties(_formProperties, _listProperties, _filter_listProperties){
    return {
        formProperties: _formProperties,
        listProperties: _listProperties,
        filter_listProperties: _filter_listProperties
    }
}

function EntityEditForm(){
    this.editFormName = "<--label for form-->";
    this.formProperties = new FormProperties(new EntityProperty(), new EntityProperty());
    this.currentEntity = {};

    this.eventCloseForm = function(){};
    this.eventUpdateForm = function(){};
    this.eventCreateEntity = function(){};
}

function EntityListForm(){
    this.editFormName = "<--label for form-->";
    this.formProperties = new FormProperties(new EntityProperty(), new EntityProperty());
    this.entities = [];

    this.eventCloseForm = function(){};
    this.eventUpdateForm = function(){};
    this.eventAddNewEntity = function(){};
    this.eventDeleteEntity = function(id){};
    this.eventEditEntity = function(id){};
    this._show = function(entity){};
}
