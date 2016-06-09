angular.module('app', [
    'ui.router',
    'ui.bootstrap',
    'ui-notification',
    'smart-table',
    'ngDreamFactory'
]);


// config

var app =
    angular.module('app')
        .constant('DSP_URL', 'https://dream-wshd.rhcloud.com')
        .constant('DSP_API_KEY', 'uagb')
        .config(['$httpProvider', 'DSP_API_KEY', function($httpProvider, DSP_API_KEY) {
            $httpProvider.defaults.headers.common['X-DreamFactory-Application-Name'] = DSP_API_KEY;
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