app.service('DB', [ '$http', '$state',

    function ($http, $state) {
        var apiUrl = "https://mintfox.com.ua/api/api.php/";
        var apiSpUrl = "https://mintfox.com.ua/api/sp/api.php/";
        var suffix = "?transform=1"

        function handleError(e){
            if (e.status == 401) {
                sessionStorage.setItem('stateToGo', sessionStorage.getItem('stateToGo') || $state.current.name);
                window.location = '#/access/logout';
            }
        };

        var _getRecords = function (table) {
            var url = apiUrl + table + suffix;
            return $http.get(url).then(function(r) {
                return r.data[table] || [];
            }).catch(handleError);
        };

        var _callStoredProc = function (spname) {
            var url = apiSpUrl + spname;
            return $http.post(url).then(function(r) {
                return r.data[0] || [];
            }).catch(handleError)
        };

        var _callStoredProcWithParams = function (spname, params) {
            var url = apiSpUrl + spname + "?" + params.sel_date;

            return $http({
                method: 'POST',
                url: url,
                data: $.param(params),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function(r) {
                return r.data[0] || [];
            }).catch(handleError);
        };

        function _createRecords(table, item) {
            var url = apiUrl + table;
            return $http.post(url, item).catch(handleError);
        };

        function _updateRecords(table, item) {
            var url = apiUrl + table + "/" + item.id;
            return $http.put(url, item).catch(handleError);
        };

        function _deleteRecords(table, id) {
            var url = apiUrl + table + "/" + id;
            return $http.delete(url).catch(handleError);
        };

        return {
            getRecords: function (table) {
                return _getRecords(table);
            },
            callStoredProc: function(spname) {
                return _callStoredProc(spname);
            },
            callStoredProcWithParams: function(spname, params) {
                return _callStoredProcWithParams(spname, params);
            },
            createRecords: function (table, item) {
                return _createRecords(table, item);
            },
            updateRecords: function (table, item) {
                return _updateRecords(table, item);
            },
            deleteRecords: function (table, id) {
                return _deleteRecords(table, id);
            }
        };
    }]);