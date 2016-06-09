app.service('Notify', [ 'Notification',
    function (Notification) {
        var DELAY = 3000;
        var actonIcon = {
            list: "list",
            add: "plus",
            edit: "pencil",
            delete: "trash"
            },
        entityIcon = {
            region: "direction",
            client: "user",
            order: "present"
        };

        var _success = function (entity, action, name, msg) {
            Notification.success({
                message: '<i class="glyphicon glyphicon-' + actonIcon[action] + ' bg-light bg-white-opacity wrapper-xs"></i> &nbsp; ' + msg,
                title: name ? '<i class="icon-' + entityIcon[entity] + ' fa-fw wrapper-xs"></i> &nbsp; ' + name : null,
                delay: DELAY
            });
        };

        var _error = function (entity, action, name, msg) {
            Notification.error({
                message: '<i class="glyphicon glyphicon-' + actonIcon[action] + ' bg-light bg-white-opacity wrapper-xs"></i> &nbsp; ' + msg,
                title: name ? '<i class="icon-' + entityIcon[entity] + ' fa-fw wrapper-xs"></i> &nbsp; ' + name : null,
                delay: DELAY
            });
        };

        return {
            success: function (entity, action, name, msg) {
                return _success(entity, action, name, msg);
            },
            error: function (entity, action, name, msg) {
                return _error(entity, action, name, msg);
            }
        }
    }]);