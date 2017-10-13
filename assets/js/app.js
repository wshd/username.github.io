angular.module('app', [
    'ui.router',
    'ui.bootstrap',
    'ui-notification',
    'smart-table',
    'googlechart'
]);


// config

var app =
    angular.module('app')
        .config(["$httpProvider", function ($httpProvider) {
            $httpProvider.defaults.withCredentials = true;
        }])
        .config(
        [        '$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
            function ($controllerProvider,   $compileProvider,   $filterProvider,   $provide) {

                // lazy controller, directive and service
                app.controller = $controllerProvider.register;
                app.directive  = $compileProvider.directive;
                app.filter     = $filterProvider.register;
                app.factory    = $provide.factory;
                app.service    = $provide.service;
                app.constant   = $provide.constant;
                app.value      = $provide.value;
            }
        ]);