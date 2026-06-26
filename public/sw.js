const CACHE = 'quranik-v1'

const STATIC_ASSETS = [
  '/',
  '/brand.png',
  '/brand-sm.png',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/manifest.json',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(STATIC_ASSETS))
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  if (url.origin === location.origin) {
    if (STATIC_ASSETS.includes(url.pathname)) {
      event.respondWith(caches.match(request))
      return
    }
  }

  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  )
})
