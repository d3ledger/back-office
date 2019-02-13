window.addEventListener('load', registerServiceWorker, false)

function registerServiceWorker () {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(initialiseState)
  } else {
    console.warn('Service workers are not supported in this browser.')
  }
}

function initialiseState () {
  if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
    console.warn('Notifications aren\'t supported.')
    return
  }

  if (Notification.permission === 'denied') {
    console.warn('The user has blocked notifications.')
    return
  }

  if (!('PushManager' in window)) {
    console.warn('Push messaging isn\'t supported.')
    return
  }

  navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
    serviceWorkerRegistration.pushManager.getSubscription().then(function (subscription) {
      if (!subscription) {
        subscribe()

        return
      }

      sendSubscriptionToServer(subscription)
    })
      .catch(function (err) {
        console.warn('Error during getSubscription()', err)
      })
  })
}

function subscribe () {
  const publicKey = base64UrlToUint8Array('BK6AT_ybJtO3p-JfgIAA_NbeVszLIlIdQUO4PDXd_qum2g8cewUsdfp2mI_fX1FoQDTcQZ4pE9-ECAsoAzGTX6I=')

  navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
    serviceWorkerRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: publicKey
    })
      .then(function (subscription) {
        return sendSubscriptionToServer(subscription)
      })
      .catch(function (e) {
        if (Notification.permission === 'denied') {
          console.warn('Permission for Notifications was denied')
        } else {
          console.error('Unable to subscribe to push.', e)
        }
      })
  })
}

function sendSubscriptionToServer (subscription) {
  var key = subscription.getKey ? subscription.getKey('p256dh') : ''
  var auth = subscription.getKey ? subscription.getKey('auth') : ''

  document.getElementById('subscription').value = JSON.stringify(subscription)

  return fetch('/profile/subscription', {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      endpoint: subscription.endpoint,
      key: key ? btoa(String.fromCharCode.apply(null, new Uint8Array(key))) : '',
      auth: auth ? btoa(String.fromCharCode.apply(null, new Uint8Array(auth))) : ''
    })
  })
}

function base64UrlToUint8Array (base64UrlData) {
  const padding = '='.repeat((4 - base64UrlData.length % 4) % 4)
  const base64 = (base64UrlData + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = atob(base64)
  const buffer = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    buffer[i] = rawData.charCodeAt(i)
  }

  return buffer
}
