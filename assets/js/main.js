'use strict';

/* Controllers */

angular.module('app')
    .controller('AppCtrl', ['$scope', '$window',    '$filter',  '$state',  'Notification', 'APP_VERSION',
        function(              $scope,   $window,   $filter,    $state,    Notification,  APP_VERSION ) {
            // add 'ie' classes to html
            var isIE = !!navigator.userAgent.match(/MSIE/i);
            isIE && angular.element($window.document.body).addClass('ie');
            isSmartDevice( $window ) && angular.element($window.document.body).addClass('smart');
            registerSW();


            // config
            $scope.app = {
                name: 'UA-GB',
                version: APP_VERSION,
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
                showCharts: true,
                selDate: $filter('date')(new Date(), 'yyyy-MM-dd'),
                regions: [],
                selRegion: {},
                themeColor: "bg-info",
                isOnline: true
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

            $scope.toggleCharts = function () {
                $scope.app.showCharts = !$scope.app.showCharts;
            };

            $scope.isOnline = function() {
                var onlineColor = "bg-info";
                var offlineColor = "bg-black";

                var wasOnline = $scope.app.isOnline;
                $scope.app.isOnline = window.navigator.onLine;
                $scope.app.themeColor = $scope.app.isOnline ? onlineColor : offlineColor;
                if (wasOnline != $scope.app.isOnline) {
                    // notify user about going online/offline
                    // alert("You're now " + $scope.app.isOnline ? "online" : "offline");
                    $scope.app.settings.navbarCollapseColor =
                        $scope.app.settings.navbarHeaderColor = $scope.app.themeColor + " dker";
                }
                return $scope.app.isOnline;
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
