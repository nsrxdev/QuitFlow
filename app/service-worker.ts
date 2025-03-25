/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope

self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {}
  const title = data.title || "Stop Smoking App"
  const options = {
    body: data.body || "New notification",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    data: {
      url: data.url || "/",
    },
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  const url = event.notification.data?.url || "/"

  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clientList) => {
      // If a window client is already open, focus it
      for (const client of clientList) {
        if (client.url === url && "focus" in client) {
          return client.focus()
        }
      }
      // Otherwise, open a new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(url)
      }
    }),
  )
})

// Skip waiting and claim clients to update the service worker immediately
self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting())
})

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim())
})

export {}

