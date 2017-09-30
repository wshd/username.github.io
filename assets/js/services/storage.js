app.service('Storage', [ '$q', 'DB', '$http',  'Auth',
    function ($q, db, $http, Auth) {

        function handleError(e){
            if (e.error.length > 0 && e.error[0].code == 403) {
                window.location = '#/access/logout';
            }
        };

        var checkAuth = function(){
            Auth.currentUser().then(function (sessionUser) {
                if (sessionUser && !$http.defaults.headers.common["X-DreamFactory-Session-Token"]) {
                    $http.defaults.headers.common["X-DreamFactory-Session-Token"] = sessionUser.session_id;
                }
            });
        };

        var _get = function (table) {
            return db.getRecords(table);
        };

        var _getSP = function (spname) {
            return db.callStoredProc(spname);

        };

        var _getSP_params = function (spname, params) {
            return db.callStoredProcWithParams(spname, params);
        };

        var _insert = function (table, item) {
            return db.createRecords(table, item);
        };

        var _update = function (table, item) {
            return db.updateRecords(table, item);
        };

        var _delete = function (table, id) {
            return db.deleteRecords(table, id);
        };

        return {
            get: function (table) {
                //checkAuth();
                return _get(table);
            },
            getSP: function (spname) {
                //checkAuth();
                return _getSP(spname);
            },
            getSP_params: function (spname, params) {
                //checkAuth();
                return _getSP_params(spname, params);
            },
            insert: function (table, item) {
                //checkAuth();
                return _insert(table, item);
            },
            update: function (table, item) {
                //checkAuth();
                return _update(table, item);
            },
            delete: function (table, id) {
                //checkAuth();
                return _delete(table, id);
            }
        };
    }]);