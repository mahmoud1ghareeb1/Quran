/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

const CACHE_NAME = 'quran-app-cache-v1';
const APP_SHELL_URLS = [
  '/',
  'index.html',
  'index.css',
  'index.tsx',
  'tafsir_data.ts',
  'https://fonts.googleapis.com/css2?family=Amiri+Quran:wght@400&family=Tajawal:wght@400;500;700&display=swap',
  'https://fonts.gstatic.com/s/tajawal/v9/Iura6YBj_oCad4k1nzSBC45I.woff2', // tajawal regular
  'https://fonts.gstatic.com/s/amiriquran/v6/XLY-p2_3N42DUS43M_i4sS0_IeA.woff2' // amiri quran regular
];

// Install event: cache the app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Service Worker: Caching App Shell');
      // AddAll will fail if any of the requests fail.
      // We use individual add requests to be more resilient.
      const promises = APP_SHELL_URLS.map(url => {
        return cache.add(url).catch(err => {
          console.warn(`Service Worker: Failed to cache ${url}`, err);
        });
      });
      return Promise.all(promises);
    })
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event: serve from cache or network
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // For API calls (Quran data, recitations), use stale-while-revalidate strategy
  if (url.hostname === 'api.quran.com' || url.hostname === 'everyayah.com') {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(request).then(cachedResponse => {
          const fetchPromise = fetch(request).then(networkResponse => {
            // If we get a valid response, update the cache
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(err => {
            console.warn(`Service Worker: Fetch failed for ${request.url}`, err);
            // If fetch fails, we still have the cachedResponse to rely on.
          });

          // Return cached response immediately if available, and update cache in the background.
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // For App Shell assets and fonts, use cache-first strategy
  event.respondWith(
    caches.match(request).then(response => {
      // Return the cached response if it exists.
      // If not, fetch from the network.
      return response || fetch(request).then(fetchResponse => {
          // Optional: cache newly fetched non-API assets if needed
          return fetchResponse;
      });
    })
  );
});
