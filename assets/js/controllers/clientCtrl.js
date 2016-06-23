app.controller('ListClientCtrl', [ '$scope', '$http', '$modal', 'Storage', 'Notify',
    function ($scope, $http, $modal, Storage, Notify) {
        var INSTANCE = 'client';

        $scope.isLoading = true;
        $scope.$on('api:ready', function () {
            reload();
        });

        var applyData = function (data) {
            $scope.clients = data;
        };

        var reload = function () {
            Storage.getSP('clients_with_totals').then(function (data) {
                    applyData(data);
                    $scope.isLoading = false;
                },
                function (msg) {
                    console.log('Clients loading failed. ' + msg);
                    showError('list', null);
                    $scope.isLoading = false;
                });
            Storage.get('region').then(function (data) {
                    $scope.regions = data;
                }, function (msg) {
                    console.log('Regions loading failed. ' + msg);
                });
        };

        var reloadFromCache = function () {
            localforage.getItem('clients_with_totals').then(function (data) {
                applyData(data);
                if (data != null) {
                    $scope.isLoading = false;
                }
                reload();
            }).catch(function () {
                reload();
            });
        };

        reloadFromCache();

        var showError = function (action, name) {
            var messages = {
                list: "Помилка при завантаженні клієнтів!",
                add: "Помилка при додаванні!",
                edit: "Помилка при збереженні!",
                delete: "Помилка при видаленні!"
            };
            Notify.error(INSTANCE, action, name, messages[action])
        };

        var showSuccess = function (action, name) {
            var messages = {
                add: "Клієнта було успішно додано!",
                edit: "Клієнта було успішно збережено!",
                delete: "Клієнта було успішно видалено!"
            };
            Notify.success(INSTANCE, action, name, messages[action])
        };

        $scope.isUnchanged = function () {
            return angular.equals($scope.prevClient, $scope.clientToEdit)
        };

        $scope.add = function () {
            var ACTION = 'add';
            $scope.clientToEdit = {isNew: true, region_id: 0};
            $scope.prevClient = angular.copy($scope.clientToEdit);
            var modalInstance = $modal.open({
                templateUrl: 'assets/tpl/client/edit.html',
                scope: $scope
            });

            modalInstance.result.then(function (item) {
                Storage.insert(INSTANCE, item).then(
                    function (data) {
                        reload();
                        showSuccess(ACTION, item.name);
                    }, function (msg) {
                        console.log('Client ' + ACTION + ' failed. ' + msg);
                        showError(ACTION, item.name);
                    }
                );
            });
        };

        $scope.edit = function (client) {
            var ACTION = 'edit';
            $scope.clientToEdit = angular.copy(client);
            $scope.clientToEdit.region_id = parseInt($scope.clientToEdit.region_id);
            $scope.clientToEdit.isNew = false;
            $scope.prevClient = angular.copy($scope.clientToEdit);
            var modalInstance = $modal.open({
                templateUrl: 'assets/tpl/client/edit.html',
                scope: $scope
            });

            modalInstance.result.then(function (item) {
                Storage.update(INSTANCE, item).then(
                    function (data) {
                        reload();
                        showSuccess(ACTION, item.name);
                    }, function (msg) {
                        console.log('Client ' + ACTION + ' failed. ' + msg);
                        showError(ACTION, item.name);
                    }
                );
            });
        };

        $scope.delete = function (client) {
            var ACTION = 'delete';
            $scope.clientToDelete = client;
            var modalInstance = $modal.open({
                templateUrl: 'assets/tpl/client/delete.confirm.html',
                scope: $scope
            });

            modalInstance.result.then(function (item) {
                Storage.delete(INSTANCE, item.id).then(
                    function (data) {
                        reload();
                        showSuccess(ACTION, item.name);
                    }, function (msg) {
                        console.log('Client ' + ACTION + ' failed. ' + msg);
                        showError(ACTION, item.name);
                    }
                );
            });
        };

}]);