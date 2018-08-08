/*
 * NODE_IP=http://localhost:8080 DEBUG=iroha-util node scripts/setup.js
 */

require('@babel/register')({
  presets: [ '@babel/env' ]
})

module.exports = require('./setup-accounts-and-assets')
