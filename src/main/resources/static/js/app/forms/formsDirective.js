;
(function(exp) {
    if(!exp.appDirective){
        exp.appDirective = new Object(null);
    }
    var formsDirective = new Object(null);
    exp.appDirective.formsDirective = formsDirective;

    formsDirective.directiveButton = function () {
        return {
            restrict: 'E',
            compile: function (element, attrs) {
                element.addClass('btn');
                if (attrs.type === 'submit') {
                    element.addClass('btn-primary');
                } else {
                    element.addClass('btn-default');
                }
                if (attrs.size) {
                    element.addClass('btn-' + attrs.size);
                }
            }
        }
    };

    formsDirective.directiveDatePicker = function () {

        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ngModelCtrl) {

                //model -> view
                ngModelCtrl.$formatters.push(function (date) {
                        date = new Date(date);
                        if (angular.isDefined(date) &&
                            date !== null && !angular.isDate(date)) {
                            throw new Error('ng-Model value must be a Date object');
                        }
                        return date;
                    }
                );

                //view -> model
                ngModelCtrl.$parsers.push(function (viewValue) {
                        return viewValue.getTime();
                    }
                );
            }
        };
    };

    function refreshSelectList (scope) {
        if (scope.property == undefined) {
            return;
        }
        if (scope.property.inputType == "enum") {
            if (scope.property.entityListService()) {
                scope.selectList = scope.property.entityListService().list
            }
        } else if (scope.property.inputType == "select" || scope.property.inputType == "multiselect") {
            if (scope.property.entityListService()) {
                scope.selectList = scope.property.entityListService().list
            }
        }
    }

    formsDirective.directiveEntityProperty = function () {
        return {
            restrict: 'E',
            require: '',
            templateUrl: '/templates/appRoom/tasklist/directive/entityEditDirective/entity-property.html ',
            scope: {
                entity: '=',
                property: '='
            },
            link: function (scope, element, attrs) {
                refreshSelectList(scope);
            },
            controller: ['$scope', function ($scope) {
                $scope.refreshSelectList = refreshSelectList($scope);
                $scope.propertyChanged = function () {
                }
            }]
        }
    };

    formsDirective.directiveEntityEditForm = function () {
        return {
            restrict: 'E',
            require: '',
            templateUrl: '/templates/appRoom/tasklist/directive/entityEditDirective/entity-edit-form.html ',
            scope: {
                entityEditForm: "="
            },
            link: function (scope, element, attrs) {

            },
            controller: ['$scope', function ($scope) {
                $scope.closeForm = function () {
                    $scope.entityEditForm.eventCloseForm();
                };
                $scope.updateForm = function () {
                    $scope.entityEditForm.eventUpdateForm();
                };
                $scope.createEntity = function () {
                    $scope.entityEditForm.eventCreateEntity($scope.entityEditForm.currentEntity);
                };
            }]
        }
    };

    formsDirective.directiveEntityEditFormRow = function () {
        return {
            restrict: 'E',
            require: '',
            templateUrl: '/templates/appRoom/tasklist/directive/entityEditDirective/entity-edit-form-row.html ',
            scope: {
                entityfieldsrow: "=",
                entityeditform: "="
            },
            link: function (scope, element, attrs) {
            }
        }
    };

    formsDirective.directiveEntityEditFormCol = function ($compile) {
        return {
            restrict: 'E',
            require: '',
            templateUrl: '/templates/appRoom/tasklist/directive/entityEditDirective/entity-edit-form-col.html ',
            scope: {
                fieldplacing: "=",
                entityeditform: "="
            },
            link: function (scope, element, attrs) {
                if (angular.isArray(scope.fieldplacing.editFieldId)) {
                    var e = $compile("" +
                        "<div ng-repeat='entityfieldsrow in fieldplacing.editFieldId track by $index'>" +
                        "<entity-edit-form-row entityfieldsrow='entityfieldsrow' entityeditform='entityeditform'> " +
                        "</entity-edit-form-row>" +
                        "</div>"
                    )(scope);
                    element.replaceWith(e);
                }
            }
        }
    };

    formsDirective.directiveEntityListForm = function () {
        return {
            restrict: 'E',
            require: '',
            templateUrl: '/templates/appRoom/tasklist/directive/entityEditDirective/entity-list-form.html ',
            scope: {
                entityListForm: "="
            },
            link: function (scope, element, attrs) {

            },
            controller: ['$scope', function ($scope) {
                $scope.closeForm = function () {
                    $scope.entityListForm.eventCloseForm();
                };
                $scope.updateForm = function () {
                    $scope.entityListForm.eventUpdateForm();
                    $scope.entityListForm.entities = $scope.entityListForm.appMetadataSet.getEntityList($scope.entityListForm.metadataName).list;
                };
                $scope.findEntity = function (searchEx) {
                    $scope.entityListForm.eventFindEntity(searchEx);
                    $scope.entityListForm.entities = $scope.entityListForm.appMetadataSet.getEntityList($scope.entityListForm.metadataName).list;
                };
                $scope.addNewEntity = function () {
                    $scope.entityListForm.eventAddNewEntity();
                };
                $scope.deleteEntity = function (id) {
                    $scope.entityListForm.eventDeleteEntity(id);
                };
                $scope.editEntity = function (id) {
                    $scope.entityListForm.eventEditEntity(id);
                };
            }]
        }
    }

})(window);