////////////////////////////////////
// DIRECTIVEs
////////////////////////////////////

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

function directiveDatePicker(dateFilter){

    var format = 'dd.MM.yyyy';

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
                    /*date = dateFilter(date, format);*/
                    return date;
                }
            );

            //view -> model
            ngModelCtrl.$parsers.push(function(viewValue){
                    viewValue = new Date(viewValue);
                    return viewValue;
                }
            );
         }
    };
}

function directiveEntityProperty(resourceService){
    return{
        restrict: 'E',
        require: '',
        templateUrl: '/js/app/Forms/directive/entity-property.html ',
        scope:{
            entity: "= entity",
            property: '= property'
        },
        link: function (scope, element, attrs) {

        },
        controller: ['$scope', function ($scope) {
            $scope.refreshSelectList = function () {
                $scope.property.entityList.update(resourceService, function (data) {
                    $scope.selectList = data.list;
                })
            };
            $scope.propertyChanged = function(){

            }
        }]
    }
}

function directiveEntityEditForm(resourceService){
    return{
        restrict: 'E',
        require: '',
        templateUrl: '/js/app/Forms/directive/entity-edit-form.html ',
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

function directiveEntityListForm(resourceService){
    return{
        restrict: 'E',
        require: '',
        templateUrl: '/js/app/Forms/directive/entity-list-form.html ',
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
            };
            $scope.addNewEntity = function(){
                $scope.entityListForm.eventAddNewEntity();
            };
            $scope.deleteEntity = function(id){
                $scope.entityListForm.eventDeleteEntity(id);
            };
            $scope.editEntity = function(id){
                $scope.entityListForm.eventEditEntity(id);
            }
        }]
    }
}

function directiveMessageLine(){
    return{
        restrict: 'E',
        require: '',
        templateUrl: '/js/app/Forms/directive/message-line.html ',
        scope:{
            errorDescriptions: "="
        },
        link: function(scope, element, attrs){

        },
        controller:['$scope', 'dataStorage', function($scope, dataStorage){
            $scope.currentPage = 0;
            $scope.updateErrorDescription = function() {
               $scope.errorDescriptions = dataStorage.getErrorDescriptions();
            };
            $scope.deleteErrorDescription = function(index){
                $scope.errorDescriptions.delErrorDescription(index)
            };
        }]
    }
}