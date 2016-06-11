var CACHE_NAME = 'ua-gb-cache-v1';
var urlsToCache = [
    '/',
    '/assets/tpl/app.html',
    'assets/tpl/order/list.html',
    'assets/tpl/order/history.html',
    'assets/tpl/client/list.html',
    'assets/tpl/region/list.html',
    '/assets/tpl/login.html',
    '/dist/css/ua-gb.css',
    '/dist/css/vendor.css',
    '/dist/js/ua-gb.js',
    '/dist/js/vendor.js',
    '/dist/img/bg.jpg',
    '/dist/fonts/fontawesome-webfont.eot',
    '/dist/fonts/fontawesome-webfont.svg',
    '/dist/fonts/fontawesome-webfont.ttf',
    '/dist/fonts/fontawesome-webfont.woff',
    '/dist/fonts/FontAwesome.otf',
    '/dist/fonts/glyphicons-halflings-regular.eot',
    '/dist/fonts/glyphicons-halflings-regular.svg',
    '/dist/fonts/glyphicons-halflings-regular.ttf',
    '/dist/fonts/glyphicons-halflings-regular.woff',
    '/dist/fonts/glyphicons-halflings-regular.woff2',
    '/dist/fonts/Simple-Line-Icons.eot',
    '/dist/fonts/Simple-Line-Icons.svg',
    '/dist/fonts/Simple-Line-Icons.ttf',
    '/dist/fonts/Simple-Line-Icons.woff',
    '/dist/fonts/sourcesanspro/sourcesanspro-bold.woff',
    '/dist/fonts/sourcesanspro/sourcesanspro-light.woff',
    '/dist/fonts/sourcesanspro/sourcesanspro.woff'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function(event) {
    //console.log(event.request);
});