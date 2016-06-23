app.service('Auth', [ '$q', '$http', 'DreamFactory',
    function ($q, $http, DreamFactory) {
        var _login = function (user) {
            var deffered = $q.defer();
            if (DreamFactory.api.ready){
                var callParams = {
                    body: user
                };

                DreamFactory.api.user.login(callParams,
                    function (data) {
                        $http.defaults.headers.common["X-DreamFactory-Session-Token"] = data.session_id;
                        localforage.setItem('currentUser', data);
                        deffered.resolve(data);
                    },
                    function (msg) {
                        deffered.reject(msg);
                    }
                );
            }
            return deffered.promise;
        };

        var _logout = function () {
            var deffered = $q.defer();
            if (DreamFactory.api.ready){
                DreamFactory.api.user.logout( {},
                    function (data) {
                        delete $http.defaults.headers.common["X-DreamFactory-Session-Token"];
                        localforage.removeItem('currentUser');
                        deffered.resolve(data);
                    },
                    function (msg) {
                        deffered.reject(msg);
                    }
                );
            }
            return deffered.promise;
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