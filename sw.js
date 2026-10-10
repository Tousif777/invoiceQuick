const CACHE_NAME = 'quickbillfree-v5';
const STATIC_ASSETS = [
  './',
  'index.html',
  'style.css',
  'js/invoice.js',
  'js/html2pdf.bundle.min.js',
  'manifest.json',
  'assets/favicon-16x16.png',
  'assets/favicon-32x32.png',
  'assets/apple-touch-icon.png',
  'assets/og-image.png'
];

// Install: Cache all static shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Network-first for fresh dynamic updates, fallback to cache for offline reliability
self.addEventListener('fetch', (event) => {
  // Only handle GET requests and skip analytics/external requests
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // Skip Google Analytics & external fonts to prevent CORS/tracking interference
  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Cache valid responses
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Offline: serve from cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Default fallback to index.html for page navigation
          if (event.request.mode === 'navigate') {
            return caches.match('index.html');
          }
          return new Response('Network offline and asset not cached', { status: 503, statusText: 'Offline' });
        });
      })
  );
});
