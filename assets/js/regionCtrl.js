app.controller('RegionCtrl', ['$scope', '$modal', 'Storage', 'Notify',
    function ($scope, $modal, Storage, Notify) {
        var INSTANCE = 'region';

        $scope.isLoading = true;
        $scope.$on('api:ready', function () {
            reload();
        });

        var reload = function () {
            Storage.getSP('regions_with_totals').then(function (data) {
                    $scope.regions = data;
                    $scope.isLoading = false;
                },
                function (msg) {
                    console.log('Regions loading failed. ' + msg);
                    showError('list', null);
                    $scope.isLoading = false;
                });
        };
        reload();

        var showError = function (action, name) {
            var messages = {
                list: "Помилка при завантаженні регіонів!",
                add: "Помилка при додаванні!",
                edit: "Помилка при збереженні!",
                delete: "Помилка при видаленні!"
            };
            Notify.error(INSTANCE, action, name, messages[action])
        };

        var showSuccess = function (action, name) {
            var messages = {
                add: "Регіон було успішно додано!",
                edit: "Регіон було успішно збережено!",
                delete: "Регіон було успішно видалено!"
            };
            Notify.success(INSTANCE, action, name, messages[action])
        };

        $scope.isUnchanged = function () {
            return angular.equals($scope.prevRegion, $scope.regionToEdit)
        };

        $scope.add = function () {
            var ACTION = 'add';
            $scope.regionToEdit = {isNew: true};
            $scope.prevRegion = angular.copy($scope.regionToEdit);
            var modalInstance = $modal.open({
                templateUrl: 'assets/tpl/region/edit.html',
                scope: $scope
            });

            modalInstance.result.then(function (item) {
                Storage.insert(INSTANCE, item).then(
                    function (data) {
                        showSuccess(ACTION, item.name);
                        reload();
                    }, function (msg) {
                        showError(ACTION, item.name);
                        console.log('Region ' + ACTION + ' failed. ' + msg);
                    }
                );
            });
        };

        $scope.edit = function (region) {
            var ACTION = 'edit';
            $scope.regionToEdit = angular.copy(region);
            $scope.regionToEdit.isNew = false;
            $scope.prevRegion = angular.copy($scope.regionToEdit);
            var modalInstance = $modal.open({
                templateUrl: 'assets/tpl/region/edit.html',
                scope: $scope
            });

            modalInstance.result.then(function (item) {
                Storage.update(INSTANCE, item).then(
                    function (data) {
                        showSuccess(ACTION, item.name);
                        reload();
                    }, function (msg) {
                        showError(ACTION, item.name);
                        console.log('Region ' + ACTION + ' failed. ' + msg);
                    }
                );
            });
        };

        $scope.delete = function (region) {
            var ACTION = 'delete';
            $scope.regionToDelete = region;
            var modalInstance = $modal.open({
                templateUrl: 'assets/tpl/region/delete.confirm.html',
                scope: $scope
            });

            modalInstance.result.then(function (item) {
                Storage.delete(INSTANCE, item.id).then(
                    function (data) {
                        showSuccess(ACTION, item.name);
                        reload();
                    }, function (msg) {
                        showError(ACTION, item.name);
                        console.log('Region ' + ACTION + ' failed. ' + msg);
                    }
                );
            });
        };
    }]);
