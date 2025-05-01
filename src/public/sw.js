self.importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

if (workbox) {
  console.log('[SW] Workbox berhasil dimuat');

  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
      cacheName: 'pages-cache',
    })
  );

  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'style' || request.destination === 'script',
    new workbox.strategies.CacheFirst({
      cacheName: 'assets-cache',
    })
  );

  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: 'images-cache',
    })
  );
} else {
  console.error('[SW] Workbox gagal dimuat');
}

self.addEventListener("push", async (event) => {
  console.log("[SW] Push event received");

  const subscription = await self.registration.pushManager.getSubscription();
  if (!subscription) {
    console.log(
      "[SW] Tidak ada subscription aktif, notifikasi tidak ditampilkan."
    );
    return;
  }

  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.message || "Kamu punya cerita baru!",
    icon: "icons/icon-192x192.png",
    badge: "icons/icon-72x72.png",
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "StoryApp", options)
  );
});

self.addEventListener("message", (event) => {
  console.log("[SW] Pesan diterima:", event.data);
  if (event.data && event.data.type === "simulate-push") {
    const { title, message } = event.data.payload || {};
    const options = {
      body: message || "Simulasi notifikasi",
      icon: "icons/icon-192x192.png",
      badge: "icons/icon-72x72.png",
    };

    event.waitUntil(
      self.registration.showNotification(title || "Simulasi StoryApp", options)
    );
  }
});
