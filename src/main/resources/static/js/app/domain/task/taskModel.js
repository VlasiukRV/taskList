appInitialization.InitTaskModel = function(){

    var appMetadataSet = appInitialization.metadataSet;

    var Task = appUtils.Class(appModel.Entity);
    var metadataEntitySpecification_Task = {
        entityClass: Task,
        fnGetEntityInstance: function () {
            return new Task()
        },
        metadataName: "task",
        metadataRepresentation: "Task",
        metadataDescription: "Task list",
        entityField: {
            objectField: {},
            entityField: {

                date: {
                    value: "",
                    fieldDescription: {
                        inputType: "date",
                        label: "date",
                        availability: true,
                        entityListService: null
                    }
                },
                title: {
                    value: "",
                    fieldDescription: {
                        inputType: "text",
                        label: "title",
                        availability: true,
                        entityListService: null
                    }
                },
                author: {
                    value: {},
                    fieldDescription: {
                        inputType: "select",
                        label: "author",
                        availability: true,
                        entityListService: function () {
                            return appMetadataSet.getEntityList("user");
                        }
                    }
                },
                executor: {
                    value: [],
                    fieldDescription: {
                        inputType: "multiselect",
                        label: "executor",
                        availability: true,
                        entityListService: function () {
                            return appMetadataSet.getEntityList("user");
                        }
                    }
                },
                project: {
                    value: {},
                    fieldDescription: {
                        inputType: "select",
                        label: "project",
                        availability: true,
                        entityListService: function () {
                            return appMetadataSet.getEntityList("project")
                        }
                    }
                },
                state: {
                    value: "TODO",
                    fieldDescription: {
                        inputType: "enum",
                        label: "state",
                        availability: true,
                        entityListService: function(){
                            return appMetadataSet.getEntityList("taskState")
                        }
                    }
                }

            },
            defineField: {

                representation: {
                    enumerable: true,
                    get: function () {
                        return "" + this.date + " /" + this.title + "/ (" + this.description + ") ";
                    }
                }

            }
        }
    };
    metadataEntitySpecification_Task.entityField.entityField.executor.value.representationList = function() {
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
    metadataEntitySpecification_Task.entityField.entityField.executor.value.fillByTemplate = function(template) {
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

    appInitialization.metadataSpecifications.entities.push(metadataEntitySpecification_Task);

    return appInitialization;
};