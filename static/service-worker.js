// Set cache version
const version = '1.0.0'
const cacheName = `precache-${version}`
const currentCaches = [cacheName, 'runtime']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => {
        return cache.addAll(['./', './index.html'])
      })
      .then(self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => {
        return Promise.all(
          keys
            .filter((key) => !currentCaches.includes(cacheName))
            .map((key) => caches.delete(key)),
        )
      })
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse
        }
        return caches.open('runtime').then((cache) => {
          return fetch(event.request)
            .then((response) => {
              return cache.put(event.request, response.clone()).then(() => {
                return response
              })
            })
            .catch(() => {
              return caches.open(cacheName).then((cache) => {
                return cache.match('/offline/')
              })
            })
            .catch(() => {
              return new Response('Network error', {
                status: 408,
                headers: { 'Content-Type': 'text/plain' },
              })
            })
        })
      }),
    )
  }
})
