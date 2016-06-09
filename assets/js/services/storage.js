app.service('Storage', [ '$q', 'DreamFactory', '$http',  'Auth',
    function ($q, DreamFactory, $http, Auth) {

        function handleError(e){
            if (e.error.length > 0 && e.error[0].code == 403) {
                window.location = '#/access/logout';
            }
        };

        var checkAuth = function(){
            var sessionUser = Auth.currentUser();
            if (sessionUser && !$http.defaults.headers.common["X-DreamFactory-Session-Token"]) {
                $http.defaults.headers.common["X-DreamFactory-Session-Token"] = sessionUser.session_id;
            }
        };

        var _get = function (table) {
            var deffered = $q.defer();
            if (DreamFactory.api.ready){
                var callParams = {
                    table_name: table
                };

                DreamFactory.api.uagb.getRecords(callParams,
                    function (data) {
                        deffered.resolve(data.record);
                    },
                    function (msg) {
                        handleError(msg);
                        deffered.reject(msg);
                    }
                );
            }
            return deffered.promise;
        };

        var _getSP = function (spname) {
            var deffered = $q.defer();
            if (DreamFactory.api.ready){
                var callParams = {
                    procedure_name: spname
                };

                DreamFactory.api.uagb.callStoredProc(callParams,
                    function (data) {
                        deffered.resolve(data);
                    },
                    function (msg) {
                        handleError(msg);
                        deffered.reject(msg);
                    }
                );
            }
            return deffered.promise;

        };

        var _getSP_params = function (spname, params) {
            var deffered = $q.defer();
            if (DreamFactory.api.ready){
                var callParams = {
                    procedure_name: spname,
                    body: {
                        params: params
                    }
                };

                DreamFactory.api.uagb.callStoredProcWithParams(callParams,
                    function (data) {
                        deffered.resolve(data);
                    },
                    function (msg) {
                        handleError(msg);
                        deffered.reject(msg);
                    }
                );
            }
            return deffered.promise;

        };

        var _insert = function (table, item) {
            var deffered = $q.defer();
            if (DreamFactory.api.ready) {
                var callParams = {
                    table_name: table,
                    body: item
                };

                DreamFactory.api.uagb.createRecords(callParams,
                    function (data) {
                        deffered.resolve(data);
                    },
                    function (msg) {
                        handleError(msg);
                        deffered.reject(msg);
                    }
                );
            }
            return deffered.promise;
        };

        var _update = function (table, item) {
            var deffered = $q.defer();
            if (DreamFactory.api.ready) {
                var callParams = {
                    table_name: table,
                    body: [item]
                };

                DreamFactory.api.uagb.updateRecords(callParams,
                    function (data) {
                        deffered.resolve(data);
                    },
                    function (msg) {
                        handleError(msg);
                        deffered.reject(msg);
                    }
                );
            }
            return deffered.promise;
        };

        var _delete = function (table, id) {
            var deffered = $q.defer();
            if (DreamFactory.api.ready) {
                var callParams = {
                    table_name: table,
                    ids: id
                };

                DreamFactory.api.uagb.deleteRecordsByIds(callParams,
                    function (data) {
                        deffered.resolve(data);
                    },
                    function (msg) {
                        handleError(msg);
                        deffered.reject(msg);
                    }
                );
            }
            return deffered.promise;
        };

        return {
            get: function (table) {
                checkAuth();
                return _get(table);
            },
            getSP: function (spname) {
                checkAuth();
                return _getSP(spname);
            },
            getSP_params: function (spname, params) {
                checkAuth();
                return _getSP_params(spname, params);
            },
            insert: function (table, item) {
                checkAuth();
                return _insert(table, item);
            },
            update: function (table, item) {
                checkAuth();
                return _update(table, item);
            },
            delete: function (table, id) {
                checkAuth();
                return _delete(table, id);
            }
        };
    }]);