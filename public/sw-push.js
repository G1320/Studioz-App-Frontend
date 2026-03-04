// Push notification service worker for StudioZ
// This file must live at the root of the public directory so it can
// control the entire origin scope.

self.addEventListener('push', (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { title: 'StudioZ', body: event.data.text() };
  }

  const { title = 'StudioZ', body = '', icon, actionUrl } = payload;

  const options = {
    body,
    icon: icon || '/android-chrome-192x192.png',
    badge: '/favicon-32x32.png',
    data: { actionUrl: actionUrl || '/' },
    vibrate: [100, 50, 100],
    tag: 'studioz-notification',
    renotify: true,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const actionUrl = event.notification.data?.actionUrl || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Focus an existing tab if one is open
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(actionUrl);
          return client.focus();
        }
      }
      // Otherwise open a new window
      return clients.openWindow(actionUrl);
    })
  );
});
