/*
 * Copyright D3 Ledger, Inc. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * NODE_IP=http://localhost:8080 DEBUG=iroha-util node scripts/setup.js
 */
require('@babel/polyfill')
require('@babel/register')({
  presets: [ '@babel/env' ]
})

module.exports = require('./setup-accounts-and-assets')
