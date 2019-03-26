/*
 * Copyright D3 Ledger, Inc. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

window.addEventListener('load', registerServiceWorker, false)

function registerServiceWorker () {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
  } else {
    console.warn('Service workers are not supported in this browser.')
  }
}

function initialiseState (sendToserver) {
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

  return navigator.serviceWorker.ready.then(serviceWorkerRegistration => {
    serviceWorkerRegistration.pushManager.getSubscription().then(subscription => {
      if (!subscription) {
        subscribe(sendToserver)

        return
      }

      sendSubscriptionToServer(subscription, sendToserver)
    })
      .catch(err => console.warn('Error during getSubscription()', err))
  })
}

function subscribe (sendToserver) {
  const publicKey = base64UrlToUint8Array('BK6AT_ybJtO3p-JfgIAA_NbeVszLIlIdQUO4PDXd_qum2g8cewUsdfp2mI_fX1FoQDTcQZ4pE9-ECAsoAzGTX6I=')

  navigator.serviceWorker.ready.then(serviceWorkerRegistration => {
    serviceWorkerRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: publicKey
    })
      .then(subscription => sendSubscriptionToServer(subscription, sendToserver))
      .catch(e => {
        if (Notification.permission === 'denied') {
          console.warn('Permission for Notifications was denied')
        } else {
          console.error('Unable to subscribe to push.', e)
        }
      })
  })
}

function sendSubscriptionToServer (subscription, sendToserver) {
  const key = subscription.getKey ? subscription.getKey('p256dh') : ''
  const auth = subscription.getKey ? subscription.getKey('auth') : ''
  const pushSubscription = {
    endpoint: subscription.endpoint,
    keys: {
      p256dh: key ? btoa(String.fromCharCode.apply(null, new Uint8Array(key))) : '',
      auth: auth ? btoa(String.fromCharCode.apply(null, new Uint8Array(auth))) : ''
    }
  }

  sendToserver(pushSubscription)
}

function base64UrlToUint8Array (base64UrlData) {
  const padding = '='.repeat((4 - base64UrlData.length % 4) % 4)
  const base64 = (base64UrlData + padding)
    // eslint-disable-next-line
    .replace(/\-/g, '+')
    .replace(/_/g, '/')

  const rawData = atob(base64)
  const buffer = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    buffer[i] = rawData.charCodeAt(i)
  }

  return buffer
}

export default {
  initialiseState
}
