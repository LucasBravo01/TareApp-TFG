// const STATIC_CACHE = "static-v1";

// const APP_SHELL = [
//   '/',
// ];

// self.addEventListener("install", (e) => {
//   const cacheStatic = caches
//     .open(STATIC_CACHE)
//     .then((cache) => cache.addAll(APP_SHELL));

//   e.waitUntil(cacheStatic);
// });

self.addEventListener("fetch", (e) => {
  console.log("fetch! ", e.request);
  e.respondWith(
    caches
      .match(e.request)
      .then((res) => {
        return res || fetch(e.request);
      })
      .catch(console.log)
  );
  //e.waitUntil(response);
});



///////////////////////

self.addEventListener('push', e => {
  const data = e.data.json();
  console.log('Notificación push recibida:', data);
  
  self.registration.showNotification(data.notification.title, {
      body: data.notification.body,
      icon: data.notification.icon
  });
});

async function sendSubscriptionToServer(subscription) {
  const response = await fetch('/guardar-suscripcion', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ subscription })
  });

  if (!response.ok) {
      console.error('Error al guardar la suscripción en el servidor');
  }
}

self.addEventListener('pushsubscriptionchange', async (event) => {
  const subscription = await self.registration.pushManager.subscribe(event.oldSubscription.options);
  await sendSubscriptionToServer(subscription);
});

self.addEventListener('activate', async () => {
  const subscription = await self.registration.pushManager.getSubscription();
  if (subscription) {
      await sendSubscriptionToServer(subscription);
  }
});