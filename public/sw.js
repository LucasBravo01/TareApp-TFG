"use strict"

const STATIC_CACHE = "static-v1";

const APP_SHELL = [];

self.addEventListener("install", (e) => {
  const cacheStatic = caches
    .open(STATIC_CACHE)
    .then((cache) => cache.addAll(APP_SHELL));

  e.waitUntil(cacheStatic);
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches
      .match(e.request)
      .then((res) => {
        return res || fetch(e.request);
      })
  );
});

self.addEventListener('push', e => {
  const data = e.data.json();
  
  self.registration.showNotification(data.notification.title, {
      body: data.notification.body,
      icon: data.notification.icon
  });
});