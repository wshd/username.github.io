angular.module('app', [
    'ui.router',
    'ui.bootstrap',
    'ui-notification',
    'smart-table',
    'googlechart',
    'LocalForageModule'
]);

// config

var app =
    angular.module('app')
        .constant('APP_VERSION', '1.0.7(18.11.2020)')
        .config(["$httpProvider", function ($httpProvider) {
            $httpProvider.defaults.withCredentials = true;
        }])
        .config(["$localForageProvider", "APP_VERSION", function($localForageProvider, APP_VERSION) {
            $localForageProvider.config({
                name        : 'UA-GB',
                storeName   : 'UA-GB_' + APP_VERSION
            });
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