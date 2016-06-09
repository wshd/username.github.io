angular.module('app')
    .directive('bagManager', function() {
        return {
            restrict: 'E',
            scope: { bags: '=', placeholder: '@'},
            template:
            '<div class="bags">' +
            '<div ng-repeat="(idx, bag) in bags track by $index" class="bag label label-info" ng-click="remove(idx)">{{bag}}<span class="glyphicon glyphicon-remove"></span></div>' +
            '</div>' +
            '<input type="text" placeholder="{{placeholder}}" ng-model="new_value" class="form-control bag-input" ></input> ',
            link: function ( $scope, $element ) {
                // FIXME: this is lazy and error-prone
                var input = angular.element( $element.children()[1] );

                // This adds the new tag to the tags array
                $scope.add = function() {
                    $scope.bags.push( $scope.new_value );
                    $scope.new_value = "";
                };

                // This is the ng-click handler to remove an item
                $scope.remove = function ( idx ) {
                    $scope.bags.splice( idx, 1 );
                };

                // Capture all keypresses
                input.bind( 'keypress', function ( event ) {
                    // But we only care when Enter was pressed
                    if ( $scope.new_value != "" && ( event.keyCode == 13 || event.keyCode == 43 ) ) {
                        event.preventDefault();
                        $scope.$apply( $scope.add );
                    }
                    else if (event.keyCode < 48 || event.keyCode > 57){
                        event.preventDefault(); // numbers input only
                    }
                });
            }
        };
    });
