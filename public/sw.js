/*
 * Copyright D3 Ledger, Inc. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Service worker file.
 *
 * NOTE: This file MUST be located in the root.
 */

'use strict'

console.log('Started', self)

self.addEventListener('install', function (event) {
  self.skipWaiting()
  console.log('Installed', event)
})

self.addEventListener('activate', function (event) {
  console.log('Activated', event)
})

self.addEventListener('push', function (event) {
  console.log('Push message', event)

  var data = event.data.text()
  console.log('Push data: ' + data)
  let message, title
  if (isJson(data)) {
    title = data.title
    message = data.message
  } else {
    title = 'Push Message'
    message = data
  }

  return self.registration.showNotification(title, {
    body: message
  })
})

var isJson = function (str) {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}
