app.service('Auth', [ '$q', '$http', '$localForage',
    function ($q, $http, $localForage) {
        var _login = function(user) {
            var url = 'https://masiki.toys/api/api.php/';

            return $http({
                method: 'POST',
                url: url,
                data: $.param(user),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function(r) {
                var token = angular.fromJson(r.data);
                $http.defaults.headers.common['X-XSRF-TOKEN'] = token;
                return $localForage.setItem('currentUser', token);
            });
        };

        var _logout = function () {
            delete $http.defaults.headers.common["X-XSRF-TOKEN"];
            $localForage.removeItem('currentUser');
            return $q.when(true);
        };

        var _currentUser = function () {
            return $localForage.getItem('currentUser');
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