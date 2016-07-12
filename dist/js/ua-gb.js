angular.module('app', [
    'ui.router',
    'ui.bootstrap',
    'ui-notification',
    'smart-table',
    'googlechart',
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
'use strict';

/**
 * Config for the router
 */
angular.module('app')
  .run(
    [          '$rootScope', '$state', '$stateParams', 'DreamFactory',
      function ($rootScope,   $state,   $stateParams, DreamFactory) {
          $rootScope.$state = $state;
          $rootScope.$stateParams = $stateParams;
          $rootScope.df = DreamFactory;

          $rootScope.$on('$stateChangeError', function (e) {
              e.preventDefault();
              sessionStorage.setItem('stateToGo', '');
              $state.go('access.login');
          });
      }
    ]
  )
  .config(
    [          '$stateProvider', '$urlRouterProvider',
      function ($stateProvider,   $urlRouterProvider) {

          var authenticated = ['Auth', function (Auth) {
              //if (!Auth.currentUser()) throw "User not authorized!";
              //return true;
              return Auth.currentUser();
          }];

          $urlRouterProvider
              .otherwise('/app/history');
          $stateProvider
              .state('app', {
                  abstract: true,
                  url: '/app',
                  templateUrl: 'assets/tpl/app.html',
                  resolve: {
                      authenticated: authenticated
                  }
              })
              .state('app.orders', {
                  url: '/orders',
                  templateUrl: 'assets/tpl/order/list.html',
                  controller: 'ListOrderCtrl'
              })
              .state('app.history', {
                  url: '/history',
                  templateUrl: 'assets/tpl/order/history.html',
                  controller: 'HistoryOrderCtrl'
              })
              .state('app.clients', {
                  url: '/clients',
                  templateUrl: 'assets/tpl/client/list.html',
                  controller: 'ListClientCtrl'
              })
              .state('app.regions', {
                  url: '/regions',
                  templateUrl: 'assets/tpl/region/list.html',
                  controller: 'RegionCtrl'
              })
              .state('access', {
                  url: '/access',
                  template: '<div ui-view class="fade-in-right-big smooth"></div>'
              })
              .state('access.login', {
                  url: '/login',
                  templateUrl: 'assets/tpl/login.html',
                  controller: 'LoginCtrl'
              })
              .state('access.logout', {
                  url: '/logout',
                  template: '<div ui-view></div>',
                  controller: 'LogoutCtrl'
              })
              /*
              .state('app.dashboard-v1', {
                  url: '/dashboard-v1',
                  templateUrl: 'tpl/app_dashboard_v1.html',
                  resolve: {
                    deps: ['$ocLazyLoad',
                      function( $ocLazyLoad ){
                        return $ocLazyLoad.load(['js/controllers/chart.js']);
                    }]
                  }
              })
              .state('app.dashboard-v2', {
                  url: '/dashboard-v2',
                  templateUrl: 'tpl/app_dashboard_v2.html',
                  resolve: {
                    deps: ['$ocLazyLoad',
                      function( $ocLazyLoad ){
                        return $ocLazyLoad.load(['js/controllers/chart.js']);
                    }]
                  }
              })
              .state('app.ui', {
                  url: '/ui',
                  template: '<div ui-view class="fade-in-up"></div>'
              })
              .state('app.ui.buttons', {
                  url: '/buttons',
                  templateUrl: 'tpl/ui_buttons.html'
              })
              .state('app.ui.icons', {
                  url: '/icons',
                  templateUrl: 'tpl/ui_icons.html'
              })
              .state('app.ui.grid', {
                  url: '/grid',
                  templateUrl: 'tpl/ui_grid.html'
              })
              .state('app.ui.widgets', {
                  url: '/widgets',
                  templateUrl: 'tpl/ui_widgets.html'
              })          
              .state('app.ui.bootstrap', {
                  url: '/bootstrap',
                  templateUrl: 'tpl/ui_bootstrap.html'
              })
              .state('app.ui.sortable', {
                  url: '/sortable',
                  templateUrl: 'tpl/ui_sortable.html'
              })
              .state('app.ui.scroll', {
                  url: '/scroll',
                  templateUrl: 'tpl/ui_scroll.html',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad){
                          return uiLoad.load('js/controllers/scroll.js');
                      }]
                  }
              })
              .state('app.ui.portlet', {
                  url: '/portlet',
                  templateUrl: 'tpl/ui_portlet.html'
              })
              .state('app.ui.timeline', {
                  url: '/timeline',
                  templateUrl: 'tpl/ui_timeline.html'
              })
              .state('app.ui.tree', {
                  url: '/tree',
                  templateUrl: 'tpl/ui_tree.html',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load('angularBootstrapNavTree').then(
                              function(){
                                 return $ocLazyLoad.load('js/controllers/tree.js');
                              }
                          );
                        }
                      ]
                  }
              })
              .state('app.ui.toaster', {
                  url: '/toaster',
                  templateUrl: 'tpl/ui_toaster.html',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad){
                          return $ocLazyLoad.load('toaster').then(
                              function(){
                                 return $ocLazyLoad.load('js/controllers/toaster.js');
                              }
                          );
                      }]
                  }
              })
              .state('app.ui.jvectormap', {
                  url: '/jvectormap',
                  templateUrl: 'tpl/ui_jvectormap.html',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad){
                          return $ocLazyLoad.load('js/controllers/vectormap.js');
                      }]
                  }
              })
              .state('app.ui.googlemap', {
                  url: '/googlemap',
                  templateUrl: 'tpl/ui_googlemap.html',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( [
                            'js/app/map/load-google-maps.js',
                            'js/app/map/ui-map.js',
                            'js/app/map/map.js'] ).then(
                              function(){
                                return loadGoogleMaps(); 
                              }
                            );
                      }]
                  }
              })
              .state('app.chart', {
                  url: '/chart',
                  templateUrl: 'tpl/ui_chart.html',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad){
                          return uiLoad.load('js/controllers/chart.js');
                      }]
                  }
              })
              // table
              .state('app.table', {
                  url: '/table',
                  template: '<div ui-view></div>'
              })
              .state('app.table.static', {
                  url: '/static',
                  templateUrl: 'tpl/table_static.html'
              })
              .state('app.table.datatable', {
                  url: '/datatable',
                  templateUrl: 'tpl/table_datatable.html'
              })
              .state('app.table.footable', {
                  url: '/footable',
                  templateUrl: 'tpl/table_footable.html'
              })
              .state('app.table.grid', {
                  url: '/grid',
                  templateUrl: 'tpl/table_grid.html',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load('ngGrid').then(
                              function(){
                                  return $ocLazyLoad.load('js/controllers/grid.js');
                              }
                          );
                      }]
                  }
              })
              .state('app.table.uigrid', {
                  url: '/uigrid',
                  templateUrl: 'tpl/table_uigrid.html',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load('ui.grid').then(
                              function(){
                                  return $ocLazyLoad.load('js/controllers/uigrid.js');
                              }
                          );
                      }]
                  }
              })
              .state('app.table.editable', {
                  url: '/editable',
                  templateUrl: 'tpl/table_editable.html',
                  controller: 'XeditableCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load('xeditable').then(
                              function(){
                                  return $ocLazyLoad.load('js/controllers/xeditable.js');
                              }
                          );
                      }]
                  }
              })
              .state('app.table.smart', {
                  url: '/smart',
                  templateUrl: 'tpl/table_smart.html',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load('smart-table').then(
                              function(){
                                  return $ocLazyLoad.load('js/controllers/table.js');
                              }
                          );
                      }]
                  }
              })
              // form
              .state('app.form', {
                  url: '/form',
                  template: '<div ui-view class="fade-in"></div>',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load('js/controllers/form.js');
                      }]
                  }
              })
              .state('app.form.components', {
                  url: '/components',
                  templateUrl: 'tpl/form_components.html',
                  resolve: {
                      deps: ['uiLoad', '$ocLazyLoad',
                        function( uiLoad, $ocLazyLoad ){
                          return uiLoad.load( JQ_CONFIG.daterangepicker )
                          .then(
                              function(){
                                return uiLoad.load('js/controllers/form.components.js');
                              }
                          ).then(
                              function(){
                                return $ocLazyLoad.load('ngBootstrap');
                              }
                          );
                        }
                      ]
                  }
              })
              .state('app.form.elements', {
                  url: '/elements',
                  templateUrl: 'tpl/form_elements.html'
              })
              .state('app.form.validation', {
                  url: '/validation',
                  templateUrl: 'tpl/form_validation.html'
              })
              .state('app.form.wizard', {
                  url: '/wizard',
                  templateUrl: 'tpl/form_wizard.html'
              })
              .state('app.form.fileupload', {
                  url: '/fileupload',
                  templateUrl: 'tpl/form_fileupload.html',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad){
                          return $ocLazyLoad.load('angularFileUpload').then(
                              function(){
                                 return $ocLazyLoad.load('js/controllers/file-upload.js');
                              }
                          );
                      }]
                  }
              })
              .state('app.form.imagecrop', {
                  url: '/imagecrop',
                  templateUrl: 'tpl/form_imagecrop.html',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad){
                          return $ocLazyLoad.load('ngImgCrop').then(
                              function(){
                                 return $ocLazyLoad.load('js/controllers/imgcrop.js');
                              }
                          );
                      }]
                  }
              })
              .state('app.form.select', {
                  url: '/select',
                  templateUrl: 'tpl/form_select.html',
                  controller: 'SelectCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load('ui.select').then(
                              function(){
                                  return $ocLazyLoad.load('js/controllers/select.js');
                              }
                          );
                      }]
                  }
              })
              .state('app.form.slider', {
                  url: '/slider',
                  templateUrl: 'tpl/form_slider.html',
                  controller: 'SliderCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load('vr.directives.slider').then(
                              function(){
                                  return $ocLazyLoad.load('js/controllers/slider.js');
                              }
                          );
                      }]
                  }
              })
              .state('app.form.editor', {
                  url: '/editor',
                  templateUrl: 'tpl/form_editor.html',
                  controller: 'EditorCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load('textAngular').then(
                              function(){
                                  return $ocLazyLoad.load('js/controllers/editor.js');
                              }
                          );
                      }]
                  }
              })
              .state('app.form.xeditable', {
                  url: '/xeditable',
                  templateUrl: 'tpl/form_xeditable.html',
                  controller: 'XeditableCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load('xeditable').then(
                              function(){
                                  return $ocLazyLoad.load('js/controllers/xeditable.js');
                              }
                          );
                      }]
                  }
              })
              // pages
              .state('app.page', {
                  url: '/page',
                  template: '<div ui-view class="fade-in-down"></div>'
              })
              .state('app.page.profile', {
                  url: '/profile',
                  templateUrl: 'tpl/page_profile.html'
              })
              .state('app.page.post', {
                  url: '/post',
                  templateUrl: 'tpl/page_post.html'
              })
              .state('app.page.search', {
                  url: '/search',
                  templateUrl: 'tpl/page_search.html'
              })
              .state('app.page.invoice', {
                  url: '/invoice',
                  templateUrl: 'tpl/page_invoice.html'
              })
              .state('app.page.price', {
                  url: '/price',
                  templateUrl: 'tpl/page_price.html'
              })
              .state('app.docs', {
                  url: '/docs',
                  templateUrl: 'tpl/docs.html'
              })
              // others
              .state('lockme', {
                  url: '/lockme',
                  templateUrl: 'tpl/page_lockme.html'
              })
              .state('access', {
                  url: '/access',
                  template: '<div ui-view class="fade-in-right-big smooth"></div>'
              })
              .state('access.signin', {
                  url: '/signin',
                  templateUrl: 'tpl/page_signin.html',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['js/controllers/signin.js'] );
                      }]
                  }
              })
              .state('access.signup', {
                  url: '/signup',
                  templateUrl: 'tpl/page_signup.html',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['js/controllers/signup.js'] );
                      }]
                  }
              })
              .state('access.forgotpwd', {
                  url: '/forgotpwd',
                  templateUrl: 'tpl/page_forgotpwd.html'
              })
              .state('access.404', {
                  url: '/404',
                  templateUrl: 'tpl/page_404.html'
              })

              // fullCalendar
              .state('app.calendar', {
                  url: '/calendar',
                  templateUrl: 'tpl/app_calendar.html',
                  // use resolve to load other dependences
                  resolve: {
                      deps: ['$ocLazyLoad', 'uiLoad',
                        function( $ocLazyLoad, uiLoad ){
                          return uiLoad.load(
                            JQ_CONFIG.fullcalendar.concat('js/app/calendar/calendar.js')
                          ).then(
                            function(){
                              return $ocLazyLoad.load('ui.calendar');
                            }
                          )
                      }]
                  }
              })

              // mail
              .state('app.mail', {
                  abstract: true,
                  url: '/mail',
                  templateUrl: 'tpl/mail.html',
                  // use resolve to load other dependences
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['js/app/mail/mail.js',
                                               'js/app/mail/mail-service.js',
                                               JQ_CONFIG.moment] );
                      }]
                  }
              })
              .state('app.mail.list', {
                  url: '/inbox/{fold}',
                  templateUrl: 'tpl/mail.list.html'
              })
              .state('app.mail.detail', {
                  url: '/{mailId:[0-9]{1,4}}',
                  templateUrl: 'tpl/mail.detail.html'
              })
              .state('app.mail.compose', {
                  url: '/compose',
                  templateUrl: 'tpl/mail.new.html'
              })

              .state('layout', {
                  abstract: true,
                  url: '/layout',
                  templateUrl: 'tpl/layout.html'
              })
              .state('layout.fullwidth', {
                  url: '/fullwidth',
                  views: {
                      '': {
                          templateUrl: 'tpl/layout_fullwidth.html'
                      },
                      'footer': {
                          templateUrl: 'tpl/layout_footer_fullwidth.html'
                      }
                  },
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['js/controllers/vectormap.js'] );
                      }]
                  }
              })
              .state('layout.mobile', {
                  url: '/mobile',
                  views: {
                      '': {
                          templateUrl: 'tpl/layout_mobile.html'
                      },
                      'footer': {
                          templateUrl: 'tpl/layout_footer_mobile.html'
                      }
                  }
              })
              .state('layout.app', {
                  url: '/app',
                  views: {
                      '': {
                          templateUrl: 'tpl/layout_app.html'
                      },
                      'footer': {
                          templateUrl: 'tpl/layout_footer_fullwidth.html'
                      }
                  },
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['js/controllers/tab.js'] );
                      }]
                  }
              })
              .state('apps', {
                  abstract: true,
                  url: '/apps',
                  templateUrl: 'tpl/layout.html'
              })
              .state('apps.note', {
                  url: '/note',
                  templateUrl: 'tpl/apps_note.html',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['js/app/note/note.js',
                                               JQ_CONFIG.moment] );
                      }]
                  }
              })
              .state('apps.contact', {
                  url: '/contact',
                  templateUrl: 'tpl/apps_contact.html',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['js/app/contact/contact.js'] );
                      }]
                  }
              })
              .state('app.weather', {
                  url: '/weather',
                  templateUrl: 'tpl/apps_weather.html',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load(
                              {
                                  name: 'angular-skycons',
                                  files: ['js/app/weather/skycons.js',
                                          'js/app/weather/angular-skycons.js',
                                          'js/app/weather/ctrl.js',
                                          JQ_CONFIG.moment ] 
                              }
                          );
                      }]
                  }
              })
              .state('app.todo', {
                  url: '/todo',
                  templateUrl: 'tpl/apps_todo.html',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['js/app/todo/todo.js',
                                               JQ_CONFIG.moment] );
                      }]
                  }
              })
              .state('app.todo.list', {
                  url: '/{fold}'
              })
              */
              .state('music', {
                  url: '/music',
                  templateUrl: 'tpl/music.html',
                  controller: 'MusicCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load([
                            'com.2fdevs.videogular', 
                            'com.2fdevs.videogular.plugins.controls', 
                            'com.2fdevs.videogular.plugins.overlayplay',
                            'com.2fdevs.videogular.plugins.poster',
                            'com.2fdevs.videogular.plugins.buffering',
                            'js/app/music/ctrl.js', 
                            'js/app/music/theme.css'
                          ]);
                      }]
                  }
              })
                .state('music.home', {
                    url: '/home',
                    templateUrl: 'tpl/music.home.html'
                })
                .state('music.genres', {
                    url: '/genres',
                    templateUrl: 'tpl/music.genres.html'
                })
                .state('music.detail', {
                    url: '/detail',
                    templateUrl: 'tpl/music.detail.html'
                })
                .state('music.mtv', {
                    url: '/mtv',
                    templateUrl: 'tpl/music.mtv.html'
                })
                .state('music.mtvdetail', {
                    url: '/mtvdetail',
                    templateUrl: 'tpl/music.mtv.detail.html'
                })
                .state('music.playlist', {
                    url: '/playlist/{fold}',
                    templateUrl: 'tpl/music.playlist.html'
                })
      }
    ]
  );

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
                showCharts: true,
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

            $scope.toggleCharts = function () {
                $scope.app.showCharts = !$scope.app.showCharts;
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

app.controller('LoginCtrl', ['$scope', 'Auth',
    function ($scope, Auth) {
        $scope.authError = '';
        $scope.user = {};
        $scope.login = function () {
            Auth.login($scope.user).then(function (data) {
                var prevState = sessionStorage.getItem('stateToGo');
                $scope.$state.go(prevState ? prevState : 'app.history');
            }, function (msg) {
                console.log(msg);
                $scope.authError = msg;
            });
        };


    }]);

app.controller('LogoutCtrl', ['$scope', 'Auth',
    function ($scope, Auth) {
        Auth.logout().then(function () {
            $scope.regions = [];
            $scope.$state.go('access.login');
        }, function (msg) {
            console.log(msg);
        });
    }]);
app.controller('ListClientCtrl', [ '$scope', '$http', '$modal', 'Storage', 'Notify',
    function ($scope, $http, $modal, Storage, Notify) {
        var INSTANCE = 'client';

        $scope.isLoading = true;
        $scope.$on('api:ready', function () {
            reload();
        });

        var applyData = function (data) {
            $scope.clients = data;
        };

        var reload = function () {
            Storage.getSP('clients_with_totals').then(function (data) {
                    applyData(data);
                    $scope.isLoading = false;
                },
                function (msg) {
                    console.log('Clients loading failed. ' + msg);
                    showError('list', null);
                    $scope.isLoading = false;
                });
            Storage.get('region').then(function (data) {
                    $scope.regions = data;
                }, function (msg) {
                    console.log('Regions loading failed. ' + msg);
                });
        };

        var reloadFromCache = function () {
            localforage.getItem('clients_with_totals').then(function (data) {
                applyData(data);
                if (data != null) {
                    $scope.isLoading = false;
                }
                reload();
            }).catch(function () {
                reload();
            });
        };

        reloadFromCache();

        var showError = function (action, name) {
            var messages = {
                list: "Помилка при завантаженні клієнтів!",
                add: "Помилка при додаванні!",
                edit: "Помилка при збереженні!",
                delete: "Помилка при видаленні!"
            };
            Notify.error(INSTANCE, action, name, messages[action])
        };

        var showSuccess = function (action, name) {
            var messages = {
                add: "Клієнта було успішно додано!",
                edit: "Клієнта було успішно збережено!",
                delete: "Клієнта було успішно видалено!"
            };
            Notify.success(INSTANCE, action, name, messages[action])
        };

        $scope.isUnchanged = function () {
            return angular.equals($scope.prevClient, $scope.clientToEdit)
        };

        $scope.add = function () {
            var ACTION = 'add';
            $scope.clientToEdit = {isNew: true, region_id: 0};
            $scope.prevClient = angular.copy($scope.clientToEdit);
            var modalInstance = $modal.open({
                templateUrl: 'assets/tpl/client/edit.html',
                scope: $scope
            });

            modalInstance.result.then(function (item) {
                Storage.insert(INSTANCE, item).then(
                    function (data) {
                        reload();
                        showSuccess(ACTION, item.name);
                    }, function (msg) {
                        console.log('Client ' + ACTION + ' failed. ' + msg);
                        showError(ACTION, item.name);
                    }
                );
            });
        };

        $scope.edit = function (client) {
            var ACTION = 'edit';
            $scope.clientToEdit = angular.copy(client);
            $scope.clientToEdit.region_id = parseInt($scope.clientToEdit.region_id);
            $scope.clientToEdit.isNew = false;
            $scope.prevClient = angular.copy($scope.clientToEdit);
            var modalInstance = $modal.open({
                templateUrl: 'assets/tpl/client/edit.html',
                scope: $scope
            });

            modalInstance.result.then(function (item) {
                Storage.update(INSTANCE, item).then(
                    function (data) {
                        reload();
                        showSuccess(ACTION, item.name);
                    }, function (msg) {
                        console.log('Client ' + ACTION + ' failed. ' + msg);
                        showError(ACTION, item.name);
                    }
                );
            });
        };

        $scope.delete = function (client) {
            var ACTION = 'delete';
            $scope.clientToDelete = client;
            var modalInstance = $modal.open({
                templateUrl: 'assets/tpl/client/delete.confirm.html',
                scope: $scope
            });

            modalInstance.result.then(function (item) {
                Storage.delete(INSTANCE, item.id).then(
                    function (data) {
                        reload();
                        showSuccess(ACTION, item.name);
                    }, function (msg) {
                        console.log('Client ' + ACTION + ' failed. ' + msg);
                        showError(ACTION, item.name);
                    }
                );
            });
        };

}]);
app.controller('ListOrderCtrl', [ '$scope', '$filter', '$modal', 'Storage', 'Notify',
    function ($scope, $filter, $modal, Storage, Notify) {
        var INSTANCE = 'order';

        var orderLoading = true,
            regionLoading = true,
            clientLoading = false; // TODO: apply later
        $scope.isLoading = true;
        $scope.$on('api:ready', function () {
            reload();
        });
        $scope.$on('regionchange', function(){
            FilterOrders();
        });

        var applyOrders = function (data) {
            angular.forEach(data, function (v, k) {
                v._bags = angular.fromJson(v.bags);
                v._goods = angular.fromJson(v.goods);
            });
            $scope.orders = data;
            FilterOrders();
        };

        var applyRegionsByDate = function (data) {
            $scope.app.regions = data;
            drawChart();
        };

        var applyRegions = function (data) {
            $scope.regions = data;
        };

        var applyClients = function (data) {
            $scope.clients = data;
        };

        var reloadOrders = function () {
            var params = [{
                name: "sel_date",
                param_type: "date",
                value: $scope.app.selDate
            }];

            Storage.getSP_params('orders_by_date', params).then(function (data) {
                    applyOrders(data);
                    orderLoading = false;
                    calcLoading();
                },
                function (msg) {
                    console.log('Orders loading failed. ' + msg);
                    showError('list', null);
                    orderLoading = false;
                    calcLoading();
                });
        };

        var reloadRegions = function () {
            Storage.get('region').then(function (data) {
                applyRegions(data);
            }, function (msg) {
                console.log('Regions loading failed. ' + msg);
            });
        };

        var reloadRegionsByDate = function () {
            var params = [{
                name: "sel_date",
                param_type: "date",
                value: $scope.app.selDate
            }];

            Storage.getSP_params('region_orders_by_date', params).then(function (data) {
                    applyRegionsByDate(data);
                    regionLoading = false;
                    calcLoading();
                },
                function (msg) {
                    console.log('Orders loading failed. ' + msg);
                    showError('list', null);
                    regionLoading = false;
                    calcLoading();
                });
        };

        var reloadClients = function () {
            Storage.getSP('clients_with_totals').then(function (data) {
                applyClients(data);
                clientLoading = false;
                calcLoading();
            }, function (msg) {
                console.log('Clients loading failed. ' + msg);
                clientLoading = false;
                calcLoading();
            });
        };


        var reloadCachedOrders = function () {
            localforage.getItem('orders_by_date_' + $scope.app.selDate).then(function (data) {
                applyOrders(data);
                if (data != null) {
                    orderLoading = false;
                    calcLoading();
                }
                reloadOrders();
            }).catch(function () { reloadOrders(); });
        };

        var reloadCachedRegions = function () {
            localforage.getItem('region').then(function (data) {
                applyRegions(data);
                reloadRegions();
            }).catch(function () { reloadRegions(); });
        };

        var reloadCachedRegionsByDate = function () {
            localforage.getItem('region_orders_by_date_' + $scope.app.selDate).then(function (data) {
                applyRegionsByDate(data);
                if (data != null) {
                    regionLoading = false;
                    calcLoading();
                }
                reloadRegionsByDate();
            }).catch(function () { reloadRegionsByDate(); });
        };

        var reloadCachedClients = function () {
            localforage.getItem('clients_with_totals').then(function (data) {
                applyClients(data);
                if (data != null) {
                    clientLoading = false;
                    calcLoading();
                }
                reloadClients();
            }).catch(function () { reloadClients(); });
        };

        var reload = function () {
            reloadOrders();
            reloadRegionsByDate();
            reloadRegions();
            reloadClients();
        };


        var reloadFromCache = function () {
            reloadCachedOrders();
            reloadCachedRegionsByDate();
            reloadCachedRegions();
            reloadCachedClients();
        };
        reloadFromCache();

        var calcLoading = function () {
            $scope.isLoading = orderLoading || regionLoading || clientLoading;
        };

        var FilterOrders = function () {
            $scope.filteredOrders = ($scope.app.selRegion || {}).id > 0
                ? $scope.orders.filter(function(o){return o.region_id == $scope.app.selRegion.id})
                : $scope.orders;
            $scope.regionName = ($scope.app.selRegion || {}).name || "Всі";
            $scope.regionOrders = ($scope.app.selRegion || {}).order_amount || CountTotalOrders();
            $scope.regionWeight = ($scope.app.selRegion || {}).order_total_weight || CountTotalWeight();
        };

        var CountTotalOrders = function () {
            var i = 0, regs = $scope.app.regions || [], max = regs.length, total = 0;
            for (i; i<max; i++){ total += parseInt(regs[i].order_amount) || 0; }
            return total;
        }

        var CountTotalWeight = function () {
            var i = 0, regs = $scope.app.regions || [], max = regs.length, total = 0;
            for (i; i<max; i++){ total += parseInt(regs[i].order_total_weight) || 0; }
            return total;
        }

        var drawChart = function () {
            var rows = [];
            $scope.chart = {};

            $scope.chart.type = "BarChart";

            angular.forEach($scope.app.regions, function (v) {
                var row = {c: []};
                row.c.push({v: v.name});
                row.c.push({v: v.order_amount});
                row.c.push({v: v.order_total_weight});
                rows.push(row);
            });

            $scope.chart.data = {"cols": [
                {id: "r", label: "Region", type: "string"},
                {id: "a", label: "Кількість", type: "number"},
                {id: "w", label: "Вага (кг)", type: "number"}
            ], "rows": rows
            };

            $scope.chart.options = {
                'colors': ['#f05050', '#16aad8'],
                'isStacked': 'true',
                'chartArea': {'left': '150', 'right': '15', 'top': '10', 'width': '100%', 'height': '80%'},
                'legend': {'position': 'bottom'}
            };
        };

        var showError = function (action, name) {
            var messages = {
                list: "Помилка при завантаженні замовлень!",
                add: "Помилка при додаванні!",
                edit: "Помилка при збереженні!",
                delete: "Помилка при видаленні!"
            };
            Notify.error(INSTANCE, action, name, messages[action])
        };

        var showSuccess = function (action, name) {
            var messages = {
                add: "Замовлення було успішно додано!",
                edit: "Замовлення було успішно збережено!",
                delete: "Замовлення було успішно видалено!"
            };
            Notify.success(INSTANCE, action, name, messages[action])
        };


        $scope.open_calendar = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.calendar_opened = true;
        };

        $scope.client_selected = function(client) {
            $scope.orderToEdit.client_id = client.id;
            $scope.orderToEdit.address = client.address;
            $scope.orderToEdit.region_id = parseInt(client.region_id);
        };

        $scope.getTotalWeight = function(){
            return $scope.orderToEdit._bags.reduce(function(pv, cv) { return parseInt(pv) + parseInt(cv); }, 0);
        };

        $scope.isUnchanged = function () {
            return angular.equals($scope.prevOrder, $scope.orderToEdit)
        };

        $scope.editClient = function () {
            console.log($scope.orderToEdit.selected_client.id);

            var ACTION = 'edit';
            var _ENTITY = 'client';
            $scope.clientToEdit = $scope.orderToEdit.selected_client;
            $scope.clientToEdit.isNew = false;
            $scope.clientToEdit.region_id = parseInt($scope.orderToEdit.selected_client.region_id);
            var modalInstance = $modal.open({
                templateUrl: 'assets/tpl/client/edit.html',
                backdrop: 'static',
                scope: $scope
            });

            modalInstance.result.then(function (item) {
                Storage.update(_ENTITY, item).then(
                    function (data) {
                        reload();
                        Notify.success(_ENTITY, ACTION, item.name, 'Клієнта було успішно збережено!');
                        $scope.orderToEdit.selected_client = angular.copy(item);
                        $scope.client_selected(item);
                    }, function (msg) {
                        Notify.error(_ENTITY, ACTION, item.name, 'Помилка при збереженні!');
                        console.log('Client ' + ACTION + ' failed. ' + msg);
                    }
                );
            });

        };

        $scope.addClient = function () {
            var ACTION = 'add';
            var _ENTITY = 'client';
            $scope.clientToEdit = {
                isNew: true,
                region_id: $scope.orderToEdit.region_id
            };
            var modalInstance = $modal.open({
                templateUrl: 'assets/tpl/client/edit.html',
                backdrop: 'static',
                scope: $scope
            });

            modalInstance.result.then(function (item) {
                Storage.insert(_ENTITY, item).then(
                    function (data) {
                        reload();
                        Notify.success(_ENTITY, ACTION, item.name, 'Клієнта було успішно додано!');
                        item.id = data.id;
                        $scope.orderToEdit.selected_client = item;
                        $scope.client_selected(item);
                    }, function (msg) {
                        Notify.error(_ENTITY, ACTION, item.name, 'Помилка при додаванні!');
                        console.log('Client ' + ACTION + ' failed. ' + msg);
                    }
                );
            });
        };

        $scope.add = function () {
            var ACTION = 'add';
            $scope.orderToEdit = {
                isNew: true,
                region_id: parseInt(($scope.app.selRegion || {}).id) || 0,
                client_id: 0,
                date: $scope.app.selDate,
                _bags: [],
                _goods: []
            };
            $scope.prevOrder = {};
            var modalInstance = $modal.open({
                templateUrl: 'assets/tpl/order/edit.html',
                scope: $scope,
                size: 'lg'
            });

            modalInstance.result.then(function (item) {
                item.bags = JSON.stringify(item._bags);
                item.goods = JSON.stringify(item._goods);
                item.date = $filter('date')(item.date, 'yyyy-MM-dd');
                item.weight = $scope.getTotalWeight();
                Storage.insert(INSTANCE, item).then(
                    function (data) {
                        showSuccess(ACTION, item.number);
                        reload();
                    }, function (msg) {
                        showError(ACTION, item.number);
                        console.log('Order ' + ACTION + ' failed. ' + msg);
                    }
                );
            });
        };

        $scope.edit = function (order) {
            var ACTION = 'edit';
            $scope.orderToEdit = angular.copy(order);
            $scope.orderToEdit.region_id = parseInt($scope.orderToEdit.region_id);
            $scope.orderToEdit.client_id = parseInt($scope.orderToEdit.client_id);
            $scope.orderToEdit.selected_client = $scope.clients.filter(function(c){return c.id == $scope.orderToEdit.client_id;})[0];
            $scope.orderToEdit.isNew = false;
            $scope.prevOrder = angular.copy($scope.orderToEdit);
            var modalInstance = $modal.open({
                templateUrl: 'assets/tpl/order/edit.html',
                scope: $scope,
                size: 'lg'
            });

            modalInstance.result.then(function (item) {
                item.bags = JSON.stringify(item._bags);
                item.goods = JSON.stringify(item._goods);
                item.date = $filter('date')(item.date, 'yyyy-MM-dd');
                item.weight = $scope.getTotalWeight();
                Storage.update(INSTANCE, item).then(
                    function (data) {
                        showSuccess(ACTION, item.number);
                        reload();
                    }, function (msg) {
                        showError(ACTION, item.number);
                        console.log('Order ' + ACTION + ' failed. ' + msg);
                    }
                );
            });
        };

        $scope.delete = function (client) {
            var ACTION = 'delete';
            $scope.orderToDelete = client;
            var modalInstance = $modal.open({
                templateUrl: 'assets/tpl/order/delete.confirm.html',
                scope: $scope
            });

            modalInstance.result.then(function (item) {
                Storage.delete(INSTANCE, item.id).then(
                    function (data) {
                        reload();
                        showSuccess(ACTION, item.number);
                    }, function (msg) {
                        console.log('Order ' + ACTION + ' failed. ' + msg);
                        showError(ACTION, item.number);
                    }
                );
            });
        };

    }]);

app.controller('HistoryOrderCtrl', [ '$scope', '$state', '$filter', 'Storage', 'Notify',
    function ($scope, $state, $filter, Storage, Notify) {
        var today = {
            date: $filter('date')(new Date(), 'yyyy-MM-dd'),
            isToday: true,
            amount: "0",
            total_weight: "0"
        };

        $scope.isLoading = true;
        $scope.$on('api:ready', function () {
            reload();
        });

        var applyData = function (data) {
            if (data[0].date == today.date){
                data[0].isToday = true;
            }else{
                data = [ today].concat(data);
            }
            $scope.dates = data;
            drawChart();
        };

        var reload = function () {
            Storage.getSP('order_history').then(function (data) {
                applyData(data);
                $scope.isLoading = false;
            }, function (msg) {
                console.log('Order history loading failed. ' + msg);
                Notify.error('order', 'list', null, 'Помилка при завантаженні історії замовлень!');
                $scope.isLoading = false;
            });
        };

        var reloadFromCache = function () {
            localforage.getItem('order_history').then(function (data) {
                applyData(data);
                if (data != null) {
                    $scope.isLoading = false;
                }
                reload();
            }).catch(function () {
                reload();
            });
        };

        reloadFromCache();

        var drawChart = function () {
            var rows = [];
            $scope.chart = {};

            $scope.chart.type = "LineChart";

            angular.forEach($scope.dates, function (v) {
                var row = {c: []};
                row.c.push({v: new Date(v.date)});
                row.c.push({v: v.amount});
                row.c.push({v: v.total_weight});
                rows.push(row);
            });

            $scope.chart.data = {"cols": [
                {id: "d", label: "Дата", type: "date"},
                {id: "a", label: "Кількість", type: "number"},
                {id: "w", label: "Вага (кг)", type: "number"}
            ], "rows": rows
            };

            $scope.chart.options = {
                'colors': ['#f05050', '#16aad8'],
                'isStacked': 'true',
                'chartArea': {'left': '50', 'right': '15', 'top': '10', 'width': '100%', 'height': '80%'},
                'legend': {'position': 'bottom'},
                "fill": 20,
                "displayExactValues": true
            };
        };

        $scope.selectDate = function (newDate) {
            $scope.app.selDate = newDate;
            $scope.app.selRegion = {};
            $state.go('app.orders');
        };
    }]);

app.controller('RegionCtrl', ['$scope', '$modal', 'Storage', 'Notify',
    function ($scope, $modal, Storage, Notify) {
        var INSTANCE = 'region';

        $scope.isLoading = true;
        $scope.$on('api:ready', function () {
            reload();
        });

        var applyData = function (data) {
            $scope.regions = data;
        };

        var reload = function () {
            Storage.getSP('regions_with_totals').then(function (data) {
                    applyData(data);
                    $scope.isLoading = false;
                },
                function (msg) {
                    console.log('Regions loading failed. ' + msg);
                    showError('list', null);
                    $scope.isLoading = false;
                });
        };

        var reloadFromCache = function () {
            localforage.getItem('regions_with_totals').then(function (data) {
                applyData(data);
                if (data != null) {
                    $scope.isLoading = false;
                }
                reload();
            }).catch(function () {
                reload();
            });
        };

        reloadFromCache();

        var showError = function (action, name) {
            var messages = {
                list: "Помилка при завантаженні регіонів!",
                add: "Помилка при додаванні!",
                edit: "Помилка при збереженні!",
                delete: "Помилка при видаленні!"
            };
            Notify.error(INSTANCE, action, name, messages[action])
        };

        var showSuccess = function (action, name) {
            var messages = {
                add: "Регіон було успішно додано!",
                edit: "Регіон було успішно збережено!",
                delete: "Регіон було успішно видалено!"
            };
            Notify.success(INSTANCE, action, name, messages[action])
        };

        $scope.isUnchanged = function () {
            return angular.equals($scope.prevRegion, $scope.regionToEdit)
        };

        $scope.add = function () {
            var ACTION = 'add';
            $scope.regionToEdit = {isNew: true};
            $scope.prevRegion = angular.copy($scope.regionToEdit);
            var modalInstance = $modal.open({
                templateUrl: 'assets/tpl/region/edit.html',
                scope: $scope
            });

            modalInstance.result.then(function (item) {
                Storage.insert(INSTANCE, item).then(
                    function (data) {
                        showSuccess(ACTION, item.name);
                        reload();
                    }, function (msg) {
                        showError(ACTION, item.name);
                        console.log('Region ' + ACTION + ' failed. ' + msg);
                    }
                );
            });
        };

        $scope.edit = function (region) {
            var ACTION = 'edit';
            $scope.regionToEdit = angular.copy(region);
            $scope.regionToEdit.isNew = false;
            $scope.prevRegion = angular.copy($scope.regionToEdit);
            var modalInstance = $modal.open({
                templateUrl: 'assets/tpl/region/edit.html',
                scope: $scope
            });

            modalInstance.result.then(function (item) {
                Storage.update(INSTANCE, item).then(
                    function (data) {
                        showSuccess(ACTION, item.name);
                        reload();
                    }, function (msg) {
                        showError(ACTION, item.name);
                        console.log('Region ' + ACTION + ' failed. ' + msg);
                    }
                );
            });
        };

        $scope.delete = function (region) {
            var ACTION = 'delete';
            $scope.regionToDelete = region;
            var modalInstance = $modal.open({
                templateUrl: 'assets/tpl/region/delete.confirm.html',
                scope: $scope
            });

            modalInstance.result.then(function (item) {
                Storage.delete(INSTANCE, item.id).then(
                    function (data) {
                        showSuccess(ACTION, item.name);
                        reload();
                    }, function (msg) {
                        showError(ACTION, item.name);
                        console.log('Region ' + ACTION + ' failed. ' + msg);
                    }
                );
            });
        };
    }]);

angular.module('app')
    .directive('bagManager', function() {
        return {
            restrict: 'E',
            scope: { bags: '=', placeholder: '@'},
            template:
            '<div class="bags">' +
            '<div ng-repeat="(idx, bag) in bags track by $index" class="bag label label-info" ng-click="remove(idx)">{{bag}}<span class="glyphicon glyphicon-remove"></span></div>' +
            '</div>' +
            '<input type="text" placeholder="{{placeholder}}" ng-model="new_value" class="form-control bag-input" ></input> ',
            link: function ( $scope, $element ) {
                // FIXME: this is lazy and error-prone
                var input = angular.element( $element.children()[1] );

                // This adds the new tag to the tags array
                $scope.add = function() {
                    $scope.bags.push( $scope.new_value );
                    $scope.new_value = "";
                };

                // This is the ng-click handler to remove an item
                $scope.remove = function ( idx ) {
                    $scope.bags.splice( idx, 1 );
                };

                // Capture all keypresses
                input.bind( 'keypress', function ( event ) {
                    // But we only care when Enter was pressed
                    if ( $scope.new_value != "" && ( event.keyCode == 13 || event.keyCode == 43 ) ) {
                        event.preventDefault();
                        $scope.$apply( $scope.add );
                    }
                    else if (event.keyCode < 48 || event.keyCode > 57){
                        event.preventDefault(); // numbers input only
                    }
                });
            }
        };
    });

angular.module('app')
    .directive('goodManager', function() {
        return {
            restrict: 'E',
            scope: { goods: '=', typeph: '@', priceph: '@'},
            template:
            '<div class="goods">' +
            '<div ng-repeat="(idx, good) in goods track by $index" class="good label label-default" ng-click="remove(idx)">' +
            '<span class="glyphicon glyphicon-remove"></span>' +
            '<div class="good-type">{{good.type}}</div><div class="good-price">{{good.price}}</div>' +
            '</div>' +
            '</div>' +
            '<div class="input-group" style="clear: both;">' +
            '<input type="text" class="form-control" ng-model="new_value.type" placeholder="{{typeph}}" />' +
            '<span class="input-group-btn" style="width:0px;"></span>' +
            '<input type="text" class="form-control" ng-model="new_value.price" placeholder="{{priceph}}" style="border-left: 0" />' +
            '<span class="input-group-btn"><button class="btn btn-info" ng-click="add()"><span class="glyphicon glyphicon-plus"></span></button></span>' +
            '</div>',
            link: function ( $scope, $element ) {
                $scope.new_value = {};
                var inputs = angular.element( $element[0].querySelectorAll('input') );

                // This adds the new tag to the tags array
                $scope.add = function() {
                    if ($scope.new_value.hasOwnProperty('type') && $scope.new_value.hasOwnProperty('price')) {
                        $scope.goods.push($scope.new_value);
                        $scope.new_value = {};
                    }
                    event.preventDefault();
                };

                // This is the ng-click handler to remove an item
                $scope.remove = function ( idx ) {
                    $scope.goods.splice( idx, 1 );
                };

                // Capture all keypresses
                inputs.bind( 'keypress', function ( event ) {
                    // But we only care when Enter was pressed
                    if ( $scope.new_value.type != "" &&  $scope.new_value.price != "" && ( event.keyCode == 13 || event.keyCode == 43 ) ) {
                        event.preventDefault();
                        $scope.$apply( $scope.add );
                    }
                });
            }
        };
    });

angular.module('app')
  .directive('setNgAnimate', ['$animate', function ($animate) {
    return {
        link: function ($scope, $element, $attrs) {
            $scope.$watch( function() {
                return $scope.$eval($attrs.setNgAnimate, $scope);
            }, function(valnew, valold){
                $animate.enabled(!!valnew, $element);
            });
        }
    };
  }]);
angular.module('app')
  .directive('uiButterbar', ['$rootScope', '$anchorScroll', function($rootScope, $anchorScroll) {
     return {
      restrict: 'AC',
      template:'<span class="bar"></span>',
      link: function(scope, el, attrs) {        
        el.addClass('butterbar hide');
        scope.$on('$stateChangeStart', function(event) {
          $anchorScroll();
          el.removeClass('hide').addClass('active');
        });
        scope.$on('$stateChangeSuccess', function( event, toState, toParams, fromState ) {
          event.targetScope.$watch('$viewContentLoaded', function(){
            el.addClass('hide').removeClass('active');
          })
        });
      }
     };
  }]);
angular.module('app')
  .directive('uiFocus', function($timeout, $parse) {
    return {
      link: function(scope, element, attr) {
        var model = $parse(attr.uiFocus);
        scope.$watch(model, function(value) {
          if(value === true) {
            $timeout(function() {
              element[0].focus();
            });
          }
        });
        element.bind('blur', function() {
           scope.$apply(model.assign(scope, false));
        });
      }
    };
  });
 angular.module('app')
  .directive('uiFullscreen', ['uiLoad', 'JQ_CONFIG', '$document', '$window', function(uiLoad, JQ_CONFIG, $document, $window) {
    return {
      restrict: 'AC',
      template:'<i class="fa fa-expand fa-fw text"></i><i class="fa fa-compress fa-fw text-active"></i>',
      link: function(scope, el, attr) {
        el.addClass('hide');
        uiLoad.load(JQ_CONFIG.screenfull).then(function(){
          // disable on ie11
          if (screenfull.enabled && !navigator.userAgent.match(/Trident.*rv:11\./)) {
            el.removeClass('hide');
          }
          el.on('click', function(){
            var target;
            attr.target && ( target = $(attr.target)[0] );            
            screenfull.toggle(target);
          });
          $document.on(screenfull.raw.fullscreenchange, function () {
            if(screenfull.isFullscreen){
              el.addClass('active');
            }else{
              el.removeClass('active');
            }
          });
        });
      }
    };
  }]);

'use strict';

/**
 * 0.1.1
 * General-purpose jQuery wrapper. Simply pass the plugin name as the expression.
 *
 * It is possible to specify a default set of parameters for each jQuery plugin.
 * Under the jq key, namespace each plugin by that which will be passed to ui-jq.
 * Unfortunately, at this time you can only pre-define the first parameter.
 * @example { jq : { datepicker : { showOn:'click' } } }
 *
 * @param ui-jq {string} The $elm.[pluginName]() to call.
 * @param [ui-options] {mixed} Expression to be evaluated and passed as options to the function
 *     Multiple parameters can be separated by commas
 * @param [ui-refresh] {expression} Watch expression and refire plugin on changes
 *
 * @example <input ui-jq="datepicker" ui-options="{showOn:'click'},secondParameter,thirdParameter" ui-refresh="iChange">
 */
angular.module('ui.jq', ['ui.load']).
  value('uiJqConfig', {}).
  directive('uiJq', ['uiJqConfig', 'JQ_CONFIG', 'uiLoad', '$timeout', function uiJqInjectingFunction(uiJqConfig, JQ_CONFIG, uiLoad, $timeout) {

  return {
    restrict: 'A',
    compile: function uiJqCompilingFunction(tElm, tAttrs) {

      if (!angular.isFunction(tElm[tAttrs.uiJq]) && !JQ_CONFIG[tAttrs.uiJq]) {
        throw new Error('ui-jq: The "' + tAttrs.uiJq + '" function does not exist');
      }
      var options = uiJqConfig && uiJqConfig[tAttrs.uiJq];

      return function uiJqLinkingFunction(scope, elm, attrs) {

        function getOptions(){
          var linkOptions = [];

          // If ui-options are passed, merge (or override) them onto global defaults and pass to the jQuery method
          if (attrs.uiOptions) {
            linkOptions = scope.$eval('[' + attrs.uiOptions + ']');
            if (angular.isObject(options) && angular.isObject(linkOptions[0])) {
              linkOptions[0] = angular.extend({}, options, linkOptions[0]);
            }
          } else if (options) {
            linkOptions = [options];
          }
          return linkOptions;
        }

        // If change compatibility is enabled, the form input's "change" event will trigger an "input" event
        if (attrs.ngModel && elm.is('select,input,textarea')) {
          elm.bind('change', function() {
            elm.trigger('input');
          });
        }

        // Call jQuery method and pass relevant options
        function callPlugin() {
          $timeout(function() {
            elm[attrs.uiJq].apply(elm, getOptions());
          }, 0, false);
        }

        function refresh(){
          // If ui-refresh is used, re-fire the the method upon every change
          if (attrs.uiRefresh) {
            scope.$watch(attrs.uiRefresh, function() {
              callPlugin();
            });
          }
        }

        if ( JQ_CONFIG[attrs.uiJq] ) {
          uiLoad.load(JQ_CONFIG[attrs.uiJq]).then(function() {
            callPlugin();
            refresh();
          }).catch(function() {
            
          });
        } else {
          callPlugin();
          refresh();
        }
      };
    }
  };
}]);
angular.module('app')
  .directive('uiModule', ['MODULE_CONFIG','uiLoad', '$compile', function(MODULE_CONFIG, uiLoad, $compile) {
    return {
      restrict: 'A',
      compile: function (el, attrs) {
        var contents = el.contents().clone();
        return function(scope, el, attrs){
          el.contents().remove();
          uiLoad.load(MODULE_CONFIG[attrs.uiModule])
          .then(function(){
            $compile(contents)(scope, function(clonedElement, scope) {
              el.append(clonedElement);
            });
          });
        }
      }
    };
  }]);
angular.module('app')
  .directive('uiNav', ['$timeout', function($timeout) {
    return {
      restrict: 'AC',
      link: function(scope, el, attr) {
        var _window = $(window), 
        _mb = 768, 
        wrap = $('.app-aside'), 
        next, 
        backdrop = '.dropdown-backdrop';
        // unfolded
        el.on('click', 'a', function(e) {
          next && next.trigger('mouseleave.nav');
          var _this = $(this);
          _this.parent().siblings( ".active" ).toggleClass('active');
          _this.next().is('ul') &&  _this.parent().toggleClass('active') &&  e.preventDefault();
          // mobile
          _this.next().is('ul') || ( ( _window.width() < _mb ) && $('.app-aside').removeClass('show off-screen') );
        });

        // folded & fixed
        el.on('mouseenter', 'a', function(e){
          next && next.trigger('mouseleave.nav');
          $('> .nav', wrap).remove();
          if ( !$('.app-aside-fixed.app-aside-folded').length || ( _window.width() < _mb ) || $('.app-aside-dock').length) return;
          var _this = $(e.target)
          , top
          , w_h = $(window).height()
          , offset = 50
          , min = 150;

          !_this.is('a') && (_this = _this.closest('a'));
          if( _this.next().is('ul') ){
             next = _this.next();
          }else{
            return;
          }
         
          _this.parent().addClass('active');
          top = _this.parent().position().top + offset;
          next.css('top', top);
          if( top + next.height() > w_h ){
            next.css('bottom', 0);
          }
          if(top + min > w_h){
            next.css('bottom', w_h - top - offset).css('top', 'auto');
          }
          next.appendTo(wrap);

          next.on('mouseleave.nav', function(e){
            $(backdrop).remove();
            next.appendTo(_this.parent());
            next.off('mouseleave.nav').css('top', 'auto').css('bottom', 'auto');
            _this.parent().removeClass('active');
          });

          $('.smart').length && $('<div class="dropdown-backdrop"/>').insertAfter('.app-aside').on('click', function(next){
            next && next.trigger('mouseleave.nav');
          });

        });

        wrap.on('mouseleave', function(e){
          next && next.trigger('mouseleave.nav');
          $('> .nav', wrap).remove();
        });
      }
    };
  }]);
angular.module('app')
  .directive('uiScrollTo', ['$location', '$anchorScroll', function($location, $anchorScroll) {
    return {
      restrict: 'AC',
      link: function(scope, el, attr) {
        el.on('click', function(e) {
          $location.hash(attr.uiScrollTo);
          $anchorScroll();
        });
      }
    };
  }]);

angular.module('app')
  .directive('uiShift', ['$timeout', function($timeout) {
    return {
      restrict: 'A',
      link: function(scope, el, attr) {
        // get the $prev or $parent of this el
        var _el = $(el),
            _window = $(window),
            prev = _el.prev(),
            parent,
            width = _window.width()
            ;

        !prev.length && (parent = _el.parent());
        
        function sm(){
          $timeout(function () {
            var method = attr.uiShift;
            var target = attr.target;
            _el.hasClass('in') || _el[method](target).addClass('in');
          });
        }
        
        function md(){
          parent && parent['prepend'](el);
          !parent && _el['insertAfter'](prev);
          _el.removeClass('in');
        }

        (width < 768 && sm()) || md();

        _window.resize(function() {
          if(width !== _window.width()){
            $timeout(function(){
              (_window.width() < 768 && sm()) || md();
              width = _window.width();
            });
          }
        });
      }
    };
  }]);
angular.module('app')
  .directive('uiToggleClass', ['$timeout', '$document', function($timeout, $document) {
    return {
      restrict: 'AC',
      link: function(scope, el, attr) {
        el.on('click', function(e) {
          e.preventDefault();
          var classes = attr.uiToggleClass.split(','),
              targets = (attr.target && attr.target.split(',')) || Array(el),
              key = 0;
          angular.forEach(classes, function( _class ) {
            var target = targets[(targets.length && key)];            
            ( _class.indexOf( '*' ) !== -1 ) && magic(_class, target);
            $( target ).toggleClass(_class);
            key ++;
          });
          $(el).toggleClass('active');

          function magic(_class, target){
            var patt = new RegExp( '\\s' + 
                _class.
                  replace( /\*/g, '[A-Za-z0-9-_]+' ).
                  split( ' ' ).
                  join( '\\s|\\s' ) + 
                '\\s', 'g' );
            var cn = ' ' + $(target)[0].className + ' ';
            while ( patt.test( cn ) ) {
              cn = cn.replace( patt, ' ' );
            }
            $(target)[0].className = $.trim( cn );
          }
        });
      }
    };
  }]);
app.service('Auth', [ '$q', '$http', 'DreamFactory',
    function ($q, $http, DreamFactory) {
        var _login = function (user) {
            var deffered = $q.defer();
            if (DreamFactory.api.ready){
                var callParams = {
                    body: user
                };

                DreamFactory.api.user.login(callParams,
                    function (data) {
                        $http.defaults.headers.common["X-DreamFactory-Session-Token"] = data.session_id;
                        localforage.setItem('currentUser', data);
                        deffered.resolve(data);
                    },
                    function (msg) {
                        deffered.reject(msg);
                    }
                );
            }
            return deffered.promise;
        };

        var _logout = function () {
            var deffered = $q.defer();
            if (DreamFactory.api.ready){
                DreamFactory.api.user.logout( {},
                    function (data) {
                        delete $http.defaults.headers.common["X-DreamFactory-Session-Token"];
                        localforage.removeItem('currentUser');
                        deffered.resolve(data);
                    },
                    function (msg) {
                        deffered.reject(msg);
                    }
                );
            }
            return deffered.promise;
        };

        var _currentUser = function () {
            return localforage.getItem('currentUser');
        };

        return {
            login: function (user) {
                return _login(user);
            },
            logout: function () {
                return _logout();
            },
            currentUser: function () {
                return _currentUser();
            }
        };
    }]);
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
app.service('Storage', [ '$q', 'DreamFactory', '$http',  'Auth',
    function ($q, DreamFactory, $http, Auth) {

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