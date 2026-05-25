// Biblegram PWA Service Worker for stable offline asset caching & background push skeleton
const CACHE_NAME = 'biblegram-cache-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/icons.svg',
  '/manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  // Let network first, fallback to cache for offline stability
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request);
    })
  );
});

// Background push notification listener
function getPushThumbnailUrl(url) {
  if (!url) return '';
  if (url.includes('unsplash.com')) {
    let cleanUrl = url;
    // Force standard JPG format for perfect native mobile OS push notification support
    if (cleanUrl.includes('fm=')) {
      cleanUrl = cleanUrl.replace(/fm=[a-zA-Z0-9]+/, 'fm=jpg');
    } else {
      cleanUrl += '&fm=jpg';
    }
    // Replace auto=format with auto=compress to avoid OS-level WebP parse errors outside sandboxed browser contexts
    if (cleanUrl.includes('auto=')) {
      cleanUrl = cleanUrl.replace(/auto=[a-zA-Z0-9,]+/g, 'auto=compress');
    }
    // Shrink dimensions & quality for ultra-fast background caching
    if (cleanUrl.includes('w=')) {
      cleanUrl = cleanUrl.replace(/w=\d+/, 'w=200');
    } else {
      cleanUrl += '&w=200';
    }
    if (cleanUrl.includes('q=')) {
      cleanUrl = cleanUrl.replace(/q=\d+/, 'q=60');
    } else {
      cleanUrl += '&q=60';
    }
    return cleanUrl;
  }
  return url;
}

self.addEventListener('push', (e) => {
  let data = { title: '은혜의 소식', body: '새로운 묵상 구절이 도착했습니다.', data: {} };
  if (e.data) {
    try {
      data = e.data.json();
    } catch {
      data = { title: '은혜의 소식', body: e.data.text(), data: {} };
    }
  }

  const rawImage = data.image || data.data.image;
  const optimizedImage = rawImage ? getPushThumbnailUrl(rawImage) : undefined;

  // Resolve absolute paths for native OS notification handlers to prevent relative fetch errors
  const iconUrl = optimizedImage || new URL('/favicon.svg', self.location.origin).href;
  const badgeUrl = new URL('/favicon.svg', self.location.origin).href;

  const options = {
    body: data.body,
    icon: iconUrl,
    badge: badgeUrl,
    image: optimizedImage,
    vibrate: [100, 50, 100],
    data: data.data || {},
    actions: [
      { action: 'open', title: '성소로 이동' }
    ]
  };

  e.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Push notification click listener for deep linking
self.addEventListener('notificationclick', (e) => {
  e.notification.close();

  const notifData = e.notification.data || {};
  const cardId = notifData.cardId;
  const type = notifData.type; // 'like' | 'comment' | 'reply'

  // Construct deep link URL
  let targetUrl = '/';
  if (cardId) {
    targetUrl = `/?notifCardId=${cardId}&notifType=${type}`;
  }

  const fullUrl = new URL(targetUrl, self.location.origin).href;

  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // 1. If matching tab is open, focus it and broadcast message
      for (const client of clientList) {
        if (client.url.startsWith(self.location.origin) && 'focus' in client) {
          client.postMessage({
            type: 'NAVIGATE_NOTIF',
            cardId: cardId,
            notifType: type
          });
          return client.focus();
        }
      }
      // 2. Otherwise open a new tab with deep-link query params
      if (self.clients.openWindow) {
        return self.clients.openWindow(fullUrl);
      }
    })
  );
});
