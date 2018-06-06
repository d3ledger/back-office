/* eslint-disable no-unused-vars */
/*
 * NODE_IP=localhost:50051 DEBUG=iroha-util node example/setup-accounts-and-assets.js
 */
const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const iroha = require('iroha-lib')
const irohaUtil = require('../src/util/iroha-util')

const crypto = new iroha.ModelCrypto()
const adminPrivKeyHex = fs.readFileSync(path.join(__dirname, 'admin@test.priv')).toString().trim()
const adminPubKey = crypto.fromPrivateKey(adminPrivKeyHex).publicKey()
const alicePrivKeyHex = fs.readFileSync(path.join(__dirname, 'alice@test.priv')).toString().trim()
const alicePubKey = crypto.fromPrivateKey(alicePrivKeyHex).publicKey()

const nodeIp = process.env.NODE_IP || 'localhost:50051'

const accounts = ['admin@test', 'alice@test']
const wallets = require('../src/mocks/wallets.json').wallets

irohaUtil.login('admin@test', adminPrivKeyHex, nodeIp)
  .then(() => tryToCreateAccount('alice', 'test', alicePubKey))
  .then(() => initializeAssets())
  .then(() => irohaUtil.logout())
  .then(() => setupAccountTransactions('admin@test', adminPrivKeyHex))
  .then(() => setupAccountTransactions('alice@test', alicePrivKeyHex))
  .catch(err => console.error(err))

function initializeAssets () {
  const initializingAssets = wallets.map(w => {
    const precision = String(w.amount).split('.')[1].length
    const amount = String(w.amount)

    return tryToCreateAsset(w.name.toLowerCase(), 'test', precision)
      .then(() => irohaUtil.addAssetQuantity('admin@test', `${w.name.toLowerCase()}#test`, amount))
      .then(() => {
        const transferringInitialAssets = _.without(accounts, 'admin@test').map(accountId => {
          const amount = String(Math.random() + 1).substr(0, precision + 2)

          return irohaUtil.transferAsset('admin@test', accountId, `${w.name.toLowerCase()}#test`, 'initial tx', amount).catch(() => {})
        })

        return Promise.all(transferringInitialAssets)
      })
  })

  return Promise.all(initializingAssets)
}

function setupAccountTransactions (accountId, accountPrivKeyHex) {
  return irohaUtil.login(accountId, accountPrivKeyHex, nodeIp)
    .then(() => {
      const transfers = []

      wallets.map(w => {
        const precision = String(w.amount).split('.')[1].length

        _.times(_.random(3, 5), () => {
          const from = accountId
          const to = _.sample(_.without(accounts, from))
          const message = _.sample(['hello', 'hi', ''])
          const amount = String(Math.random()).substr(0, precision + 2)

          const p = irohaUtil.transferAsset(from, to, `${w.name.toLowerCase()}#test`, message, amount).catch(() => {})

          transfers.push(p)
        })
      })

      return Promise.all(transfers)
    })
    .then(() => irohaUtil.logout())
}

function tryToCreateAccount (accountName, domainId, publicKey) {
  return new Promise((resolve, reject) => {
    irohaUtil.createAccount(accountName, domainId, publicKey)
      .then(() => {
        console.log(`${accountName}@${domainId} has successfully been created`)
        resolve()
      })
      .catch(err => {
        irohaUtil.getAccount(accountName + '@' + domainId)
          .then(account => {
            console.log(`${account.accountId} already exist`)
            resolve()
          })
          .catch(() => reject(err))
      })
  })
}

function tryToCreateAsset (assetName, domainId, precision) {
  return new Promise((resolve, reject) => {
    irohaUtil.createAsset(assetName, domainId, precision)
      .then(() => {
        console.log(`${assetName}#${domainId} (precision: ${precision}) has successfully been created`)
        resolve()
      })
      .catch(err => {
        irohaUtil.getAssetInfo(assetName + '#' + domainId)
          .then(info => {
            if (info.asset.precision === precision) {
              console.log(`${assetName}#${domainId} (precision: ${precision}) already exist`)
              resolve()
            } else {
              reject(new Error(`${assetName}#${domainId} is already used with different precision.`))
            }
          })
          .catch(() => reject(err))
      })
  })
}
