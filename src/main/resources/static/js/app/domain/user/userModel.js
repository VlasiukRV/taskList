appInitialization.InitUserModel = function(){

    var appMetadataSet = appInitialization.metadataSet;

    var User = appUtils.Class(appModel.Entity);
    var metadataEntitySpecification_User = {
        entityClass: User,
        fnGetEntityInstance: function () {
            return new User()
        },
        metadataName: "user",
        metadataRepresentation: "User",
        metadataDescription: "User list",
        entityField: {
            objectField: {},
            entityField: {

                username: {
                    value: "",
                    fieldDescription: {
                        inputType: "text",
                        label: "username",
                        availability: true,
                        entityListService: null
                    }
                },
                password: {
                    value: "",
                    fieldDescription: {
                        inputType: "text",
                        label: "password",
                        availability: true,
                        entityListService: null
                    }
                },
                mailAddress: {
                    value: "",
                    fieldDescription: {
                        inputType: "text",
                        label: "mailAddress",
                        availability: true,
                        entityListService: null
                    }
                },
                enabled: {
                    value: false,
                    fieldDescription: {
                        inputType: "checkbox",
                        label: "enabled",
                        availability: false,
                        entityListService: null
                    }
                }

            },
            defineField: {

                representation: {
                    enumerable: true,
                    get: function () {
                        return "" + this.username + " (" + this.description + ") ";
                    }
                }

            }
        },

        entityFieldsPlacing: [
            [
                {editFieldId: "id", fieldLength: 3}
            ],
            [
                {
                    editFieldId: [
                        [{editFieldId: "username", fieldLength: 12}],
                        [{editFieldId: "password", fieldLength: 12}],
                        [{editFieldId: "mailAddress", fieldLength: 12}]
                    ],
                    fieldLength: 5
                }
            ],
            [
                {editFieldId: "description", fieldLength: 12}
            ]
        ]

    };

    var Role = appUtils.Class(appModel.Entity);
    var metadataEntitySpecification_Role = {
        entityClass: Role,
        fnGetEntityInstance: function () {
            return new Role()
        },
        metadataName: "role",
        metadataRepresentation: "Role",
        metadataDescription: "Role list",
        entityField: {
            objectField: {},
            entityField: {

                // entity field
                role: {
                    value: "",
                    fieldDescription: {
                        inputType: "text",
                        label: "role",
                        availability: true,
                        entityListService: null
                    }
                },
                users: {
                    value: [],
                    fieldDescription: {
                        inputType: "multiselect",
                        label: "users",
                        availability: true,
                        entityListService: function () {
                            return appMetadataSet.getEntityList("user");
                        }
                    }
                }


            },
            defineField: {

                representation: {
                    enumerable: true,
                    get: function () {
                        return "" + this.role;
                    }
                }

            }
        },
        entityFieldsPlacing: [
            [
                {editFieldId: "id", fieldLength: 3},
                {
                    editFieldId: [
                        [{editFieldId: "role", fieldLength: 12}]
                    ],
                    fieldLength: 5
                }
            ],
            [
                {editFieldId: "users", fieldLength: 5},
                {editFieldId: "description", fieldLength: 12}
            ]
        ]
    };
    metadataEntitySpecification_Role.entityField.entityField.users.value.representationList = function() {
        var str = "";
        var k=0;
        while (true) {
            if(k == this.length){
                break;
            }
            str = str+"; "+this[k].representation;
            k = k+1;

        }
        return str;
    };
    metadataEntitySpecification_Role.entityField.entityField.users.value.fillByTemplate = function(template) {
        this.length=0;
        var k=0;
        while (true) {
            if(k == template.length){
                break;
            }
            var entity = appMetadataSet.getEntityInstance("user");
            appUtils.fillValuesProperty(template[k], entity);
            this.push(entity);
            k = k+1;
        }
    };

    appInitialization.metadataSpecifications.entities.push(metadataEntitySpecification_Role);
    appInitialization.metadataSpecifications.entities.push(metadataEntitySpecification_User);

    return appInitialization;
};