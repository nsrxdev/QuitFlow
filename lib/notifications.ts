export async function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/service-worker.js")
      return registration
    } catch (error) {
      console.error("Service worker registration failed:", error)
      return null
    }
  }
  return null
}

export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications")
    return false
  }

  if (Notification.permission === "granted") {
    return true
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission()
    return permission === "granted"
  }

  return false
}

export async function subscribeUserToPush() {
  try {
    const registration = await navigator.serviceWorker.ready

    // Hardcoded VAPID public key (you should replace this with your own)
    const publicKey = "your-vapid-public-key"

    if (!publicKey) {
      console.error("VAPID public key is missing")
      return null
    }

    // Convert the public key to Uint8Array
    const applicationServerKey = urlBase64ToUint8Array(publicKey)

    // Subscribe the user
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    })

    return subscription
  } catch (error) {
    console.error("Error subscribing to push notifications:", error)
    return null
  }
}

// Helper function to convert base64 to Uint8Array
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }

  return outputArray
}

export async function sendNotification(title: string, body: string, url = "/") {
  if (!("Notification" in window) || Notification.permission !== "granted") {
    console.log("Notifications not supported or permission not granted")
    return
  }

  // For testing purposes, we'll create a notification directly
  // In a real app, notifications would come from the server via push
  const registration = await navigator.serviceWorker.ready

  await registration.showNotification(title, {
    body,
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    data: { url },
  })
}

