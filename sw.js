const STATIC_CACHE      = 'static-cash-v1';
const DYNAMIC_CACHE     = 'dynamic-cach-v2';
const ASSETS = [
    '/',
  '/index.html',
  '/js/app.js',
  '/js/ui.js',
  '/js/materialize.min.js',
  '/css/styles.css',
  '/css/materialize.min.css',
  '/img/dish.png',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
  '/pages/fallback.html'
]

//Cache size limit functin
limitCache = (name, size) => {
    caches.open(name).then(cache => {
       cache.keys().then(keys => {
           if(keys.length > size) {
                cache.delete(keys[0]).then(limitCache(name,size));
           }
       })
    })
}

self.addEventListener('install', evt => {
    //Don't stop the listener until
    evt.waitUntil (
        caches.open(STATIC_CACHE)
            .then(cache => {
                //Add static assets to the cache on load
                cache.addAll(ASSETS);
            })
            .catch(err => {
                console.log('cache could not been added');
            })
    );
})


self.addEventListener('fetch', evt => {
    evt.respondWith(
        caches.match(evt.request).then(cacheRes => {
            return cacheRes || fetch(evt.request).then(fetchRes => {
                return caches.open(DYNAMIC_CACHE).then(cache => {
                    cache.put(evt.request.url, fetchRes.clone());
                    limitCache(DYNAMIC_CACHE, 15);
                    return fetchRes
                })
            })
        }).catch(() => {
            if(evt.request.url.indexOf('.html') > -1) {
                return caches.match('./pages/fallback.html');
            }
        })
    )
})

