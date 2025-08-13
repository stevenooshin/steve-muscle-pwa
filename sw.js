const CACHE = 'steve-muscle-cache-v2';
const ASSETS = ['/', '/index.html', '/manifest.webmanifest'];

self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
});
self.addEventListener('activate', (e)=>{
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE && caches.delete(k))))
  );
});
self.addEventListener('fetch', (e)=>{
  e.respondWith(
    caches.match(e.request).then(resp => resp || fetch(e.request).then(net => {
      const copy = net.clone();
      caches.open(CACHE).then(cache => cache.put(e.request, copy)).catch(()=>{});
      return net;
    }).catch(()=>resp))
  );
});
