;
(function (appInitialization) {

    appInitialization.initEnumsModel = function () {
        var EnumTaskState = new appInitialization.abstractAppModel.Enum;
        var metadataEnumSpecification_TaskState = {
            enumClass: EnumTaskState,
            metadataName: "taskState"
        };

        appInitialization.metadataSpecifications.enums.push(metadataEnumSpecification_TaskState);

        return appInitialization;
    };

})(appService.appInitialization);