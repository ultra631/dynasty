/* Service worker minimal — permet l'installation PWA et un cache de base.
   On garde ça simple : cache de la page au premier chargement. */
const CACHE = 'dynasty-v1';
const FICHIERS = ['./', './index.html', './logo.png', './icon-192.png', './icon-512.png', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FICHIERS)).catch(()=>{}));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Réseau d'abord (pour avoir les données Firebase à jour), cache en secours.
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
