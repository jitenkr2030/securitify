const CACHE_NAME = 'securitify-v1';
const STATIC_CACHE = 'securitify-static-v1';
const API_CACHE = 'securitify-api-v1';
const IMAGE_CACHE = 'securitify-images-v1';

// URLs to cache on install
const STATIC_URLS = [
  '/',
  '/landing',
  '/register',
  '/auth/signin',
  '/dashboard',
  '/pricing',
  '/product',
  '/favicon.ico',
  '/favicon.png',
  '/apple-touch-icon.png',
  '/manifest.json'
];

// API endpoints that can be cached
const CACHEABLE_API_URLS = [
  '/api/tenants',
  '/api/users',
  '/api/guards',
  '/api/posts',
  '/api/attendance',
  '/api/payroll',
  '/api/psara/licenses',
  '/api/psara/training-records',
  '/api/psara/client-agreements',
  '/api/psara/wage-register',
  '/api/psara/compliance-reports'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.addAll(STATIC_URLS);
      }),
      caches.open(API_CACHE).then((cache) => {
        return cache.addAll(CACHEABLE_API_URLS.map(url => new Request(url, { method: 'GET' })));
      })
    ])
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== API_CACHE && cacheName !== IMAGE_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - handle requests with caching strategy
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Handle static assets
  if (event.request.method === 'GET' && 
      (event.request.destination === 'document' || 
       event.request.destination === 'script' || 
       event.request.destination === 'style')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        });
      })
    );
    return;
  }

  // Handle images
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(IMAGE_CACHE).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        }).catch(() => {
          // Return a fallback image if available
          return new Response('', { status: 404 });
        });
      })
    );
    return;
  }

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    if (event.request.method === 'GET') {
      event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
          // Return cached response if available
          if (cachedResponse) {
            // Also fetch fresh data in background
            fetch(event.request).then((freshResponse) => {
              if (freshResponse.status === 200) {
                const freshResponseClone = freshResponse.clone();
                caches.open(API_CACHE).then((cache) => {
                  cache.put(event.request, freshResponseClone);
                });
              }
            });
            return cachedResponse;
          }
          
          // Fetch from network
          return fetch(event.request).then((response) => {
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(API_CACHE).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }
            return response;
          }).catch(() => {
            // Return cached response if network fails
            return caches.match(event.request);
          });
        })
      );
    } else {
      // For non-GET API requests, always fetch from network
      event.respondWith(fetch(event.request));
    }
    return;
  }

  // Default: fetch from network
  event.respondWith(fetch(event.request));
});

// Handle background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-attendance') {
    event.waitUntil(syncAttendanceData());
  } else if (event.tag === 'sync-payroll') {
    event.waitUntil(syncPayrollData());
  } else if (event.tag === 'sync-documents') {
    event.waitUntil(syncDocumentData());
  }
});

// Handle push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification from Securitify',
    icon: '/favicon.png',
    badge: '/favicon.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/favicon.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/favicon.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Securitify', options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  }
});

// Background sync functions
async function syncAttendanceData() {
  try {
    const offlineData = await getOfflineData('attendance');
    for (const data of offlineData) {
      await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }
    await clearOfflineData('attendance');
  } catch (error) {
    console.error('Failed to sync attendance data:', error);
  }
}

async function syncPayrollData() {
  try {
    const offlineData = await getOfflineData('payroll');
    for (const data of offlineData) {
      await fetch('/api/payroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }
    await clearOfflineData('payroll');
  } catch (error) {
    console.error('Failed to sync payroll data:', error);
  }
}

async function syncDocumentData() {
  try {
    const offlineData = await getOfflineData('documents');
    for (const data of offlineData) {
      await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }
    await clearOfflineData('documents');
  } catch (error) {
    console.error('Failed to sync document data:', error);
  }
}

// Helper functions for offline storage
async function getOfflineData(key) {
  return new Promise((resolve) => {
    const request = indexedDB.open('SecuritifyOfflineDB', 1);
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['offlineData'], 'readonly');
      const store = transaction.objectStore('offlineData');
      const getRequest = store.get(key);
      getRequest.onsuccess = () => resolve(getRequest.result || []);
    };
  });
}

async function clearOfflineData(key) {
  return new Promise((resolve) => {
    const request = indexedDB.open('SecuritifyOfflineDB', 1);
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['offlineData'], 'readwrite');
      const store = transaction.objectStore('offlineData');
      store.delete(key);
      transaction.oncomplete = () => resolve();
    };
  });
}