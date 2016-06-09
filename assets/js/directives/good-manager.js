angular.module('app')
    .directive('goodManager', function() {
        return {
            restrict: 'E',
            scope: { goods: '=', typeph: '@', priceph: '@'},
            template:
            '<div class="goods">' +
            '<div ng-repeat="(idx, good) in goods track by $index" class="good label label-default" ng-click="remove(idx)">' +
            '<span class="glyphicon glyphicon-remove"></span>' +
            '<div class="good-type">{{good.type}}</div><div class="good-price">{{good.price}}</div>' +
            '</div>' +
            '</div>' +
            '<div class="input-group" style="clear: both;">' +
            '<input type="text" class="form-control" ng-model="new_value.type" placeholder="{{typeph}}" />' +
            '<span class="input-group-btn" style="width:0px;"></span>' +
            '<input type="text" class="form-control" ng-model="new_value.price" placeholder="{{priceph}}" style="border-left: 0" />' +
            '<span class="input-group-btn"><button class="btn btn-info" ng-click="add()"><span class="glyphicon glyphicon-plus"></span></button></span>' +
            '</div>',
            link: function ( $scope, $element ) {
                $scope.new_value = {};
                var inputs = angular.element( $element[0].querySelectorAll('input') );

                // This adds the new tag to the tags array
                $scope.add = function() {
                    if ($scope.new_value.hasOwnProperty('type') && $scope.new_value.hasOwnProperty('price')) {
                        $scope.goods.push($scope.new_value);
                        $scope.new_value = {};
                    }
                    event.preventDefault();
                };

                // This is the ng-click handler to remove an item
                $scope.remove = function ( idx ) {
                    $scope.goods.splice( idx, 1 );
                };

                // Capture all keypresses
                inputs.bind( 'keypress', function ( event ) {
                    // But we only care when Enter was pressed
                    if ( $scope.new_value.type != "" &&  $scope.new_value.price != "" && ( event.keyCode == 13 || event.keyCode == 43 ) ) {
                        event.preventDefault();
                        $scope.$apply( $scope.add );
                    }
                });
            }
        };
    });
