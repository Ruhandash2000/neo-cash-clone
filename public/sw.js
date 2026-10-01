/**
 * Neo Cashless Service Worker
 * Phase 7: PWA Offline Support
 *
 * Strategy:
 * - App shell (JS/CSS/HTML) → Cache First
 * - API calls (Supabase/SSLCommerz) → Network First (never cache)
 * - Static assets (fonts, icons) → Stale While Revalidate
 */

const CACHE_VERSION = "neo-cash-v1";
const STATIC_CACHE  = `${CACHE_VERSION}-static`;
const FONT_CACHE    = `${CACHE_VERSION}-fonts`;

const APP_SHELL = [
  "/",
  "/manifest.json",
  "/icon-192.jpg",
  "/icon-512.jpg",
];

const NEVER_CACHE = [
  "supabase.co",
  "sslcommerz.com",
  "ngrok",
  "googleapis.com/upload",
  "/api/",
];

// ── Install: cache app shell ──────────────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// ── Activate: clean old caches ────────────────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k.startsWith("neo-cash-") && k !== STATIC_CACHE && k !== FONT_CACHE)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ── Fetch: routing strategies ─────────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Never cache API/payment/auth requests
  if (NEVER_CACHE.some((pattern) => request.url.includes(pattern))) {
    event.respondWith(fetch(request));
    return;
  }

  // Font cache: Stale While Revalidate
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    event.respondWith(
      caches.open(FONT_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        const networkFetch = fetch(request).then((res) => {
          cache.put(request, res.clone());
          return res;
        });
        return cached ?? networkFetch;
      })
    );
    return;
  }

  // App shell: Cache First with network fallback
  if (request.mode === "navigate" || APP_SHELL.includes(url.pathname)) {
    event.respondWith(
      caches.match(request).then((cached) => cached ?? fetch(request))
    );
    return;
  }

  // Static assets (.js, .css, images): Cache First
  if (/\.(js|css|png|jpg|jpeg|svg|woff2?)$/.test(url.pathname)) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        const res = await fetch(request);
        if (res.ok) cache.put(request, res.clone());
        return res;
      })
    );
    return;
  }

  // Everything else: Network First
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});

// ── Background Sync: queue failed payment requests ───────────────────────────
self.addEventListener("sync", (event) => {
  if (event.tag === "retry-payments") {
    // Notify the app to retry queued payments
    event.waitUntil(
      self.clients.matchAll().then((clients) =>
        clients.forEach((client) => client.postMessage({ type: "RETRY_PAYMENTS" }))
      )
    );
  }
});

// ── Push Notifications ────────────────────────────────────────────────────────
self.addEventListener("push", (event) => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title ?? "Neo Cashless", {
      body:  data.body  ?? "You have a new notification",
      icon:  "/icon-192.jpg",
      badge: "/icon-192.jpg",
      tag:   data.tag ?? "neo-cash-notif",
      data:  { url: data.url ?? "/" },
      actions: [
        { action: "view",    title: "View" },
        { action: "dismiss", title: "Dismiss" },
      ],
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  if (event.action === "dismiss") return;
  const url = event.notification.data?.url ?? "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clients) => {
      const existing = clients.find((c) => c.url.includes(url));
      return existing ? existing.focus() : self.clients.openWindow(url);
    })
  );
});
