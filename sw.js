/* Hallmark QAQC - offline-first service worker.
   Strategy: the whole app (HTML + libraries + icons) is precached on first online visit and then
   served from cache first, so it opens instantly and works with no connection at all.
   A fresh copy is fetched quietly in the background whenever there is a connection. */
const CACHE_VERSION = 'hallmark-qaqc-v17';
const CORE = ['./', './index.html', './manifest.webmanifest'];
const ASSETS = [
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png', './icons/favicon-32.png',
  './vendor/html2pdf.bundle.min.js', './vendor/jszip.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_VERSION);
    // Core files must succeed (install fails & retries if the page itself can't be cached)
    await Promise.all(CORE.map(async u => { const r = await fetch(new Request(u, { cache: 'reload' })); if (!r.ok) throw new Error(u + ' ' + r.status); await cache.put(u, r); }));
    // Everything else is cached individually so one slow/missing icon can never block offline support
    await Promise.all(ASSETS.map(async u => { try { const r = await fetch(new Request(u, { cache: 'reload' })); if (r.ok) await cache.put(u, r); } catch (e) {} }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith('hallmark-qaqc-') && k !== CACHE_VERSION).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

async function fromCache(request, isNav) {
  const cache = await caches.open(CACHE_VERSION);
  let hit = await cache.match(request, { ignoreSearch: true });
  if (!hit && isNav) hit = (await cache.match('./index.html')) || (await cache.match('./'));
  return hit;
}

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  const isNav = req.mode === 'navigate';

  event.respondWith((async () => {
    const cached = await fromCache(req, isNav);
    // Refresh in the background (never blocks, silently ignored when offline)
    const refresh = fetch(req).then(async res => {
      if (res && res.ok) { const c = await caches.open(CACHE_VERSION); await c.put(isNav ? './index.html' : req, res.clone()); }
      return res;
    }).catch(() => null);
    if (cached) { event.waitUntil(refresh); return cached; }
    const res = await refresh;
    if (res) return res;
    return new Response('Offline', { status: 503, statusText: 'Offline', headers: { 'Content-Type': 'text/plain' } });
  })());
});
