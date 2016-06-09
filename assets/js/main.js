'use strict';

/* Controllers */

angular.module('app')
    .controller('AppCtrl', ['$scope', '$window',    '$filter',  '$state',  'Notification',
        function(              $scope,   $window,   $filter,    $state,    Notification  ) {
            // add 'ie' classes to html
            var isIE = !!navigator.userAgent.match(/MSIE/i);
            isIE && angular.element($window.document.body).addClass('ie');
            isSmartDevice( $window ) && angular.element($window.document.body).addClass('smart');
            registerSW();


            // config
            $scope.app = {
                name: 'UA-GB',
                version: '1.0.3(10.08.2015)',
                // for chart colors
                color: {
                    primary: '#7266ba',
                    info:    '#23b7e5',
                    success: '#27c24c',
                    warning: '#fad733',
                    danger:  '#f05050',
                    light:   '#e8eff0',
                    dark:    '#3a3f51',
                    black:   '#1c2b36'
                },
                settings: {
                    themeID: 1,
                    navbarHeaderColor: 'bg-info dker',
                    navbarCollapseColor: 'bg-info dker',
                    asideColor: 'bg-light dker b-r',
                    headerFixed: true,
                    asideHide: true,
                    asideFixed: true,
                    asideFolded: false,
                    asideDock: true,
                    container: true,
                    itemsPerPage: 25
                },
                Notification: Notification,
                selDate: $filter('date')(new Date(), 'yyyy-MM-dd'),
                regions: [],
                selRegion: {}
            };

            $scope.SelectedRegionId = function () {
                return ($scope.app.selRegion || {}).id;
            };

            $scope.SelectRegion = function (region) {
                $scope.app.selRegion = ($scope.app.selRegion || {}).id == region.id ? {} : region;
                $scope.$broadcast('regionchange');
            };

            $scope.goHome = function () {
                $scope.app.selDate = $filter('date')(new Date(), 'yyyy-MM-dd');
                $scope.app.selRegion = {};
                $state.go('app.history');
            };

            $scope.print = function () {
                $window.print();
            };

            // save settings to local storage
            /*
             if ( angular.isDefined($localStorage.settings) ) {
             $scope.app.settings = $localStorage.settings;
             } else {
             $localStorage.settings = $scope.app.settings;
             }
             $scope.$watch('app.settings', function(){
             if( $scope.app.settings.asideDock  &&  $scope.app.settings.asideFixed ){
             // aside dock and fixed must set the header fixed.
             $scope.app.settings.headerFixed = true;
             }
             // save to local storage
             $localStorage.settings = $scope.app.settings;
             }, true);
             */


            // angular translate
            /*
             $scope.lang = { isopen: false };
             $scope.langs = {en:'English', de_DE:'German', it_IT:'Italian'};
             $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "English";
             $scope.setLang = function(langKey, $event) {
             // set the current lang
             $scope.selectLang = $scope.langs[langKey];
             // You can change the language during runtime
             $translate.use(langKey);
             $scope.lang.isopen = !$scope.lang.isopen;
             };
             */

            function isSmartDevice( $window )
            {
                // Adapted from http://www.detectmobilebrowsers.com
                var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
                // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
                return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
            }

            function registerSW()
            {
                if (!navigator.serviceWorker) return;

                navigator.serviceWorker.register('/sw.js').then(function() {
                    console.log('Registration worked!');
                }).catch(function(why) {
                    console.log('Registration failed! ' + why);
                });
            }

        }]);
