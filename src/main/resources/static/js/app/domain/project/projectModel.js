appInitialization.InitProjectModel = function() {

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
        },

/*
        entityFieldsPlacing: [
            {editFieldId: "description", fieldLength: 6}, {editFieldId: "id", fieldLength: 3}, {editFieldId: "name", fieldLength: 3}
        ]
*/

        entityFieldsPlacing: [
            {editFieldId: [
                {editFieldId: [{editFieldId: "id", fieldLength: 12}], fieldLength: 12},
                {editFieldId: [{editFieldId: "name", fieldLength: 12}], fieldLength: 12},
            ], fieldLength: 5},

            {editFieldId: "description", fieldLength: 7}
        ]

    };

    appInitialization.metadataSpecifications.entities.push(metadataEntitySpecification_Project);

    return appInitialization;
};