app.service('Auth', [ '$q', '$http',
    function ($q, $http) {
        var _login = function(user) {
            var url = 'https://mintfox.com.ua/api/api.php/';

            return $http({
                method: 'POST',
                url: url,
                data: $.param(user),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function(r) {
                var token = angular.fromJson(r.data);
                $http.defaults.headers.common['X-XSRF-TOKEN'] = token;
                return localforage.setItem('currentUser', token);
            });
        };

        var _logout = function () {
            delete $http.defaults.headers.common["X-XSRF-TOKEN"];
            localforage.removeItem('currentUser');
            return $q.when(true);
        };

        var _currentUser = function () {
            return localforage.getItem('currentUser');
        };

        return {
            login: function (user) {
                return _login(user);
            },
            logout: function () {
                return _logout();
            },
            currentUser: function () {
                return _currentUser();
            }
        };
    }]);