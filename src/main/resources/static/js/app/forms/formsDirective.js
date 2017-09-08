function directiveButton(){
    return{
        restrict: 'E',
        compile: function(element, attrs){
            element.addClass('btn');
            if(attrs.type==='submit'){
                element.addClass('btn-primary');
            }else{
                element.addClass('btn-default');
            }
            if(attrs.size){
                element.addClass('btn-' + attrs.size);
            }
        }
    }
}

function directiveDatePicker(){

    return{
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl){

            //model -> view
            ngModelCtrl.$formatters.push(function(date){
                    date = new Date(date);
                    if (angular.isDefined(date)&&
                        date !== null &&
                        !angular.isDate(date)){
                        throw new Error('ng-Model value must be a Date object');
                    }
                    return date;
                }
            );

            //view -> model
            ngModelCtrl.$parsers.push(function(viewValue){
                    return viewValue.getTime();
                }
            );
         }
    };
}

var refreshSelectList = function(scope){
    if(scope.property == undefined){
        return;
    }
    if(scope.property.inputType == "enum"){
        if(scope.property.entityListService()) {
            scope.selectList = scope.property.entityListService().list
        }
    }else if(scope.property.inputType == "select" || scope.property.inputType == "multiselect"){
        if(scope.property.entityListService()) {
            scope.selectList = scope.property.entityListService().list
        }
    }
};

function directiveEntityProperty(){
    return{
        restrict: 'E',
        require: '',
        templateUrl: '/templates/appRoom/tasklist/directive/entityEditDirective/entity-property.html ',
        scope:{
            entity: '=',
            property: '='
        },
        link: function (scope, element, attrs) {
            refreshSelectList(scope);
        },
        controller: ['$scope', function ($scope) {
            $scope.refreshSelectList = refreshSelectList($scope);
            $scope.propertyChanged = function(){
            }
        }]
    }
}

function directiveEntityEditForm(){
    return {
        restrict: 'E',
        require: '',
        templateUrl: '/templates/appRoom/tasklist/directive/entityEditDirective/entity-edit-form.html ',
        scope:{
            entityEditForm: "="
        },
        link: function(scope, element, attrs){

        },
        controller:['$scope', function($scope){
            $scope.closeForm = function(){
                $scope.entityEditForm.eventCloseForm();
            };
            $scope.updateForm = function(){
                $scope.entityEditForm.eventUpdateForm();
            };
            $scope.createEntity = function(){
                $scope.entityEditForm.eventCreateEntity($scope.entityEditForm.currentEntity);
            };
        }]
    }
}
function directiveEntityEditFormRow(){
    return {
        restrict: 'E',
        require: '',
        templateUrl: '/templates/appRoom/tasklist/directive/entityEditDirective/entity-edit-form-row.html ',
        scope:{
            entityfieldsrow: "=",
            entityeditform: "="
        },
        link: function(scope, element, attrs){
        }
    }
}

function directiveEntityEditFormCol($compile){
    return {
        restrict: 'E',
        require: '',
        templateUrl: '/templates/appRoom/tasklist/directive/entityEditDirective/entity-edit-form-col.html ',
        scope:{
            fieldplacing: "=",
            entityeditform: "="
        },
        link: function(scope, element, attrs){
            if(angular.isArray(scope.fieldplacing.editFieldId)){
                var e =$compile("<entity-edit-form-row entityfieldsrow='fieldplacing.editFieldId' entityeditform='entityeditform'> </entity-edit-form-row>")(scope);
                element.replaceWith(e);
            }
        }
    }
}

function directiveEntityListForm(){
    return{
        restrict: 'E',
        require: '',
        templateUrl: '/templates/appRoom/tasklist/directive/entityEditDirective/entity-list-form.html ',
        scope:{
            entityListForm: "="
        },
        link: function(scope, element, attrs){

        },
        controller:['$scope', function($scope){
            $scope.closeForm = function(){
                $scope.entityListForm.eventCloseForm();
            };
            $scope.updateForm = function(){
                $scope.entityListForm.eventUpdateForm();
                $scope.entityListForm.entities = $scope.entityListForm.appMetadataSet.getEntityList($scope.entityListForm.metadataName).list;
            };
            $scope.addNewEntity = function(){
                $scope.entityListForm.eventAddNewEntity();
            };
            $scope.deleteEntity = function(id){
                $scope.entityListForm.eventDeleteEntity(id);
            };
            $scope.editEntity = function(id){
                $scope.entityListForm.eventEditEntity(id);
            };
        }]
    }
}
