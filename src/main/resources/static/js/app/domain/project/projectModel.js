appInitialization.InitProjectModel = function(){

    var appMetadataSet = appInitialization.metadataSet;

    var Project = appUtils.Class(appModel.Entity);
    var metadataEntitySpecification_Project = {
        entityClass: Project,
        fnGetEntityInstance: function () {
            return new Project()
        },
        metadataName: "project",
        metadataRepresentation: "Project",
        metadataDescription: "Project list",
        entityField: {
            objectField: {},
            entityField: {

                // entity field
                name: {
                    value: "",
                    fieldDescription: {
                        inputType: "text",
                        label: "name",
                        availability: true,
                        entityListService: null
                    }
                }

            },
            defineField: {

                representation: {
                    enumerable: true,
                    get: function () {
                        return "" + this.name;
                    }
                }

            }
        }
    };

    appInitialization.metadataSpecifications.entities.push(metadataEntitySpecification_Project);

    return appInitialization;
};