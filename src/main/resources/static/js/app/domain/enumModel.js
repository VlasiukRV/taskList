appInitialization.initEnumsModel = function(){
    var EnumTaskState = new appModel.Enum;
    var metadataEnumSpecification_TaskState = {
        enumClass: EnumTaskState,
        metadataName: "taskState"
    };

    appInitialization.metadataSpecifications.enums.push(metadataEnumSpecification_TaskState);

    return appInitialization;
};