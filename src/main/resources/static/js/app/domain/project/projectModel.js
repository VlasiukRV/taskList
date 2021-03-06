;
(function (appInitialization) {

    appInitialization.initProjectModel = function () {

        var appMetadataSet = appInitialization.metadataSet;

        var Project = appUtils.Class(appInitialization.abstractAppModel.Entity);
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
            },

            entityFieldsPlacing: [
                [
                    {editFieldId: "id", fieldLength: 3},
                    {
                        editFieldId: [
                            [{editFieldId: "name", fieldLength: 12}]
                        ],
                        fieldLength: 5
                    }
                ],
                [
                    {editFieldId: "description", fieldLength: 12}
                ]
            ]
        };

        appInitialization.metadataSpecifications.entities.push(metadataEntitySpecification_Project);

        return appInitialization;
    };

})(appService.appInitialization);