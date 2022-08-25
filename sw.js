const cachedAssetsName = 'gerant-app-cache-v2';
// put assets
const assets = [
  './',
  './index.html',
  './main.js',
  './app.js',
  './img/logo.ico',
  './fonts/static/Montserrat-Regular.ttf',
  './fonts/static/Montserrat-Medium.ttf',
  './fonts/static/Montserrat-SemiBold.ttf',
  './icons/Group.svg',
  './icons/XMLID_133_.svg',
  './icons/Vector.svg',
  './style.css',
];
self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(cachedAssetsName).then((cache) => {
      cache.addAll(assets);
    })
  );
});
self.addEventListener('activate', (evt) => {
  // delete any caches that aren't in expectedCaches
  // which will get rid of static-v1
  evt.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (!cachedAssetsName.includes(key)) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});

self.addEventListener('fetch', (evt) => {
  evt.respondWith(
    caches.match(evt.request).then((cacheReq) => {
      if (cacheReq) {
        return cacheReq;
      }
      console.log(evt.request);
      return fetch(evt.request);
    })
  );
});
