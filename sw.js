var CACHE_NAME = 'ua-gb-cache-v1';
var urlsToCache = [
    '/',
    '/assets/tpl/app.html',
    'assets/tpl/blocks/aside.html',
    'assets/tpl/blocks/header.html',
    'assets/tpl/blocks/nav.html',
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
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                // IMPORTANT: Clone the request. A request is a stream and
                // can only be consumed once. Since we are consuming this
                // once by cache and once by the browser for fetch, we need
                // to clone the response
                var fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(
                    function(response) {
                        // Check if we received a valid response
                        if(!response || response.status !== 200 || response.type !== 'cors') {
                            return response;
                        }

                        // IMPORTANT: Clone the response. A response is a stream
                        // and because we want the browser to consume the response
                        // as well as the cache consuming the response, we need
                        // to clone it so we have 2 stream.
                        var responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(function(cache) {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});