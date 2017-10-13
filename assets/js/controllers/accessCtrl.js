app.controller('LoginCtrl', ['$scope', 'Auth',
    function ($scope, Auth) {
        $scope.authError = '';
        $scope.user = {};
        $scope.login = function () {
            Auth.login($scope.user).then(function (data) {
                var prevState = sessionStorage.getItem('stateToGo');
                $scope.$state.go(prevState ? prevState : 'app.history');
                sessionStorage.setItem('stateToGo', '');
            }, function (msg) {
                console.log(msg);
                if (msg.status = 401) {
                    $scope.authError = "Вхід не виконано. Перевірте правильність пароля та електронної пошти";
                } else {
                    $scope.authError = msg;
                }
            });
        };


    }]);

app.controller('LogoutCtrl', ['$scope', 'Auth',
    function ($scope, Auth) {
        Auth.logout().then(function () {
            $scope.regions = [];
            $scope.$state.go('access.login');
        }, function (msg) {
            console.log(msg);
        });
    }]);