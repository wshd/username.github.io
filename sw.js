importScripts("/lib/localforage.min.js");

var APP_VERSION = '1.0.5(13.10.2017)';
var CACHE_NAME = 'ua-gb-cache-v' + APP_VERSION;
var urlsToCache = [
    '/',
    '/assets/tpl/app.html',
    '/assets/tpl/blocks/aside.html',
    '/assets/tpl/blocks/header.html',
    '/assets/tpl/blocks/nav.html',
    '/assets/tpl/order/list.html',
    '/assets/tpl/order/history.html',
    '/assets/tpl/client/list.html',
    '/assets/tpl/region/list.html',
    '/assets/tpl/login.html',
    '/dist/css/ua-gb.css',
    '/dist/css/vendor.min.css',
    '/dist/js/ua-gb.js',
    '/dist/js/vendor.js',
    '/lib/localforage.min.js',
    '/dist/img/bg.jpg',
    '/dist/fonts/fontawesome-webfont.eot?v=4.2.0',
    '/dist/fonts/fontawesome-webfont.eot?#iefix&v=4.2.0',
    '/dist/fonts/fontawesome-webfont.svg?v=4.2.0#fontawesomeregular',
    '/dist/fonts/fontawesome-webfont.ttf?v=4.2.0',
    '/dist/fonts/fontawesome-webfont.woff?v=4.2.0',
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

localforage.config({
    name        : 'UA-GB',
    storeName   : 'UA-GB_' + APP_VERSION
});

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
    var fetchRequest = event.request.clone();

    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                var storageKey = getStorageKey(fetchRequest);
                var dataKey  = getDataKey(fetchRequest);
                // Cache hit - return response
                if (response) {
                    return response;
                }

                return fetch(event.request).then(
                    function(response) {
                        // Check if we received a valid response
                        if(!response
                            || response.status !== 200
                            || response.type !== 'cors'
                            || !storageKey
                            || (!isSp(fetchRequest) && fetchRequest.method != "GET")) {
                            return response;
                        }

                        // IMPORTANT: Clone the response. A response is a stream
                        // and because we want the browser to consume the response
                        // as well as the cache consuming the response, we need
                        // to clone it so we have 2 stream.
                        var responseToCache = response.clone();

                        responseToCache.json().then(function (result) {
                            localforage.setItem(storageKey, result[dataKey] || []);
                        });

                        return response;
                    }
                )
                    .catch(function (error) {
                        console.log(error);
                    });
            })
    );
});

/* Private methods */

var getStorageKey = function (request) {
    var url = request.url.split('/');
    var name = '';
    switch (url[4]) {
        case 'sp':
            name = url[6];
            return name;
        default:
            name = url[5];
            return name;
    }
};

var getDataKey = function (request) {
    var url = request.url.split('/');
    switch (url[4]) {
        case 'sp':
            return 0;
        default:
            var name = url[5] || '';
            var parts = name.split('?');
            return parts[0];
    }
};

var isSp = function (request) {
    var url = request.url.split('/');
    return url[4] === 'sp';
};