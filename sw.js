importScripts("/lib/localforage.min.js");

var CACHE_NAME = 'ua-gb-cache-v1';
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
    var fetchRequest = event.request.clone();

    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                return fetch(event.request).then(
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

                        getStorageKey(fetchRequest).then(function (key) {
                            responseToCache.json().then(function (result) {
                                localforage.setItem(key, result);
                            });
                        });

                        return response;
                    }
                );
            })
    );
});

/* Private methods */

var getStorageKey = function (request) {
    var url = request.url.split('/');
    var name = '';
    switch (url[5]) {
        case '_proc':
            name = url[6];
            if (request.method == 'POST') {
                return request.json().then(function (t) {
                    if (t && t.params) {
                        var date = t.params[0].value;
                        name += "_" + date;
                    }
                    return name;
                }).catch(function (err) {
                    return Promise.resolve(name);
                });
            } else {
                return Promise.resolve(name);
            }
        default:
            name = url[5];
            return Promise.resolve(name);
    }

};