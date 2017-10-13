app.service('Storage', ['DB',
    function (db) {

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
                return _get(table);
            },
            getSP: function (spname) {
                return _getSP(spname);
            },
            getSP_params: function (spname, params) {
                return _getSP_params(spname, params);
            },
            insert: function (table, item) {
                return _insert(table, item);
            },
            update: function (table, item) {
                return _update(table, item);
            },
            delete: function (table, id) {
                return _delete(table, id);
            }
        };
    }]);