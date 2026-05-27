// ─── ICHŌS SERVICE WORKER ────────────────────────────────────────────────────
// Handles: offline caching, push notifications, background sync, periodic sync

const CACHE_VERSION = 'ichos-v1';
const STATIC_CACHE  = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const API_CACHE     = `${CACHE_VERSION}-api`;

// Static assets to pre-cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// API routes — cache with network-first strategy
const API_ROUTES = [
  '/api/user',
  '/api/matches',
  '/api/alerts',
  '/api/booth',
];

// ─── INSTALL ──────────────────────────────────────────────────────────────────

self.addEventListener('install', event => {
  console.log('[Ichōs SW] Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('[Ichōs SW] Pre-caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
      .catch(err => console.warn('[Ichōs SW] Pre-cache failed (some assets may not exist yet):', err))
  );
});

// ─── ACTIVATE ────────────────────────────────────────────────────────────────

self.addEventListener('activate', event => {
  console.log('[Ichōs SW] Activating...');
  event.waitUntil(
    Promise.all([
      // Remove old caches
      caches.keys().then(keys =>
        Promise.all(
          keys
            .filter(key => key.startsWith('ichos-') && !key.startsWith(CACHE_VERSION))
            .map(key => {
              console.log('[Ichōs SW] Deleting old cache:', key);
              return caches.delete(key);
            })
        )
      ),
      // Take control of all clients immediately
      self.clients.claim(),
    ])
  );
});

// ─── FETCH ───────────────────────────────────────────────────────────────────

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and browser extensions
  if (request.method !== 'GET') return;
  if (!url.origin.startsWith('http')) return;

  // ── API requests: Network-first, fallback to cache ──
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request, API_CACHE));
    return;
  }

  // ── Google Fonts: Cache-first (they're stable) ──
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // ── Static assets: Cache-first ──
  if (
    request.destination === 'script' ||
    request.destination === 'style'  ||
    request.destination === 'image'  ||
    request.destination === 'font'
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // ── Navigation requests: Network-first, fallback to offline page ──
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => caches.match('/offline.html').then(r => r || caches.match('/')))
    );
    return;
  }

  // ── Everything else: Stale-while-revalidate ──
  event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
});

// ─── CACHING STRATEGIES ───────────────────────────────────────────────────────

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || new Response(
      JSON.stringify({ error: 'offline', message: 'You are offline. Showing cached data.' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Offline', { status: 503 });
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache    = await caches.open(cacheName);
  const cached   = await cache.match(request);
  const fetchPromise = fetch(request)
    .then(response => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => null);

  return cached || fetchPromise;
}

// ─── PUSH NOTIFICATIONS ───────────────────────────────────────────────────────

self.addEventListener('push', event => {
  if (!event.data) return;

  let data;
  try {
    data = event.data.json();
  } catch {
    data = { title: 'Ichōs', body: event.data.text() };
  }

  const options = {
    body:    data.body    || 'You have a new resonance alert',
    icon:    '/icons/icon-192.png',
    badge:   '/icons/icon-96.png',
    image:   data.image   || undefined,
    tag:     data.tag     || 'ichos-alert',
    renotify: true,
    requireInteraction: data.requireInteraction || false,
    data: {
      url:  data.url  || '/',
      type: data.type || 'general',
      id:   data.id   || null,
    },
    actions: getActions(data.type),
    vibrate: [100, 50, 100],
    silent:  false,
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Ichōs', options)
  );
});

function getActions(type) {
  switch (type) {
    case 'verse_match':
      return [
        { action: 'view',  title: 'See match',    icon: '/icons/action-view.png'  },
        { action: 'later', title: 'Later',         icon: '/icons/action-later.png' },
      ];
    case 'booth_visit':
      return [
        { action: 'open_booth', title: 'Open booth', icon: '/icons/action-booth.png' },
        { action: 'dismiss',    title: 'Dismiss',                                    },
      ];
    case 'new_echo':
      return [
        { action: 'enter_room', title: 'Enter room', icon: '/icons/action-room.png' },
        { action: 'dismiss',    title: 'Later',                                      },
      ];
    case 'badge_earned':
      return [
        { action: 'view_badge', title: 'View badge', icon: '/icons/action-badge.png' },
      ];
    default:
      return [
        { action: 'view',    title: 'Open Ichōs' },
        { action: 'dismiss', title: 'Dismiss'    },
      ];
  }
}

// ─── NOTIFICATION CLICK ───────────────────────────────────────────────────────

self.addEventListener('notificationclick', event => {
  event.notification.close();

  const data   = event.notification.data || {};
  const action = event.action;

  let targetUrl = data.url || '/';

  if (action === 'open_booth')  targetUrl = '/booth';
  if (action === 'enter_room')  targetUrl = `/echoes/${data.id || ''}`;
  if (action === 'view_badge')  targetUrl = '/badges';
  if (action === 'view')        targetUrl = data.url || '/alerts';
  if (action === 'dismiss')     return;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        // Focus existing window if open
        for (const client of clientList) {
          if (client.url === targetUrl && 'focus' in client) {
            return client.focus();
          }
        }
        // Otherwise open new window
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
  );
});

// ─── BACKGROUND SYNC ─────────────────────────────────────────────────────────
// Syncs offline journal entries and queued actions when connectivity returns

self.addEventListener('sync', event => {
  console.log('[Ichōs SW] Background sync:', event.tag);

  if (event.tag === 'sync-journal-entries') {
    event.waitUntil(syncJournalEntries());
  }
  if (event.tag === 'sync-verse-pins') {
    event.waitUntil(syncVersePins());
  }
  if (event.tag === 'sync-reactions') {
    event.waitUntil(syncReactions());
  }
});

async function syncJournalEntries() {
  try {
    // In production: read from IndexedDB, POST to /api/journal
    const db = await openDB();
    const pending = await db.getAll('pending-journal');

    for (const entry of pending) {
      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
      if (response.ok) {
        await db.delete('pending-journal', entry.id);
        console.log('[Ichōs SW] Synced journal entry:', entry.id);
      }
    }
  } catch (err) {
    console.error('[Ichōs SW] Journal sync failed:', err);
    throw err; // Retry
  }
}

async function syncVersePins() {
  // Placeholder — same pattern as journal sync
  console.log('[Ichōs SW] Syncing verse pins...');
}

async function syncReactions() {
  // Placeholder — same pattern as journal sync
  console.log('[Ichōs SW] Syncing reactions...');
}

// ─── PERIODIC BACKGROUND SYNC ────────────────────────────────────────────────
// Fetches the Weekly Echo Report in the background on Sundays

self.addEventListener('periodicsync', event => {
  if (event.tag === 'weekly-echo-report') {
    event.waitUntil(fetchWeeklyReport());
  }
  if (event.tag === 'refresh-matches') {
    event.waitUntil(refreshMatches());
  }
});

async function fetchWeeklyReport() {
  try {
    const response = await fetch('/api/report/weekly');
    if (response.ok) {
      const cache = await caches.open(API_CACHE);
      await cache.put('/api/report/weekly', response.clone());

      // Notify user the report is ready
      await self.registration.showNotification('Ichōs · Weekly Echo Report', {
        body:  'Your Sunday digest is ready — see what moved through your network this week.',
        icon:  '/icons/icon-192.png',
        badge: '/icons/icon-96.png',
        tag:   'weekly-report',
        data:  { url: '/report', type: 'weekly_report' },
      });
    }
  } catch (err) {
    console.error('[Ichōs SW] Weekly report fetch failed:', err);
  }
}

async function refreshMatches() {
  try {
    await fetch('/api/matches?background=true');
    console.log('[Ichōs SW] Matches refreshed in background');
  } catch (err) {
    console.error('[Ichōs SW] Match refresh failed:', err);
  }
}

// ─── MESSAGE CHANNEL ─────────────────────────────────────────────────────────
// Allows the app to communicate with the service worker

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data?.type === 'GET_VERSION') {
    event.ports[0]?.postMessage({ version: CACHE_VERSION });
  }
  if (event.data?.type === 'CLEAR_CACHE') {
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))));
    event.ports[0]?.postMessage({ cleared: true });
  }
});

// ─── INDEXEDDB HELPER ────────────────────────────────────────────────────────

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('ichos-offline', 1);

    request.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('pending-journal')) {
        db.createObjectStore('pending-journal', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('pending-verses')) {
        db.createObjectStore('pending-verses', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('pending-reactions')) {
        db.createObjectStore('pending-reactions', { keyPath: 'id' });
      }
    };

    request.onsuccess = e => {
      const db = e.target.result;
      // Add getAll and delete helpers
      db.getAll = (store) => new Promise((res, rej) => {
        const tx  = db.transaction(store, 'readonly');
        const req = tx.objectStore(store).getAll();
        req.onsuccess = () => res(req.result);
        req.onerror   = () => rej(req.error);
      });
      db.delete = (store, key) => new Promise((res, rej) => {
        const tx  = db.transaction(store, 'readwrite');
        const req = tx.objectStore(store).delete(key);
        req.onsuccess = () => res();
        req.onerror   = () => rej(req.error);
      });
      resolve(db);
    };

    request.onerror = () => reject(request.error);
  });
}
