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
const testPrivKeyHex = fs.readFileSync(path.join(__dirname, 'test@notary.priv')).toString().trim()
const testPubKey = crypto.fromPrivateKey(testPrivKeyHex).publicKey()
const alicePrivKeyHex = fs.readFileSync(path.join(__dirname, 'alice@notary.priv')).toString().trim()
const alicePubKey = crypto.fromPrivateKey(alicePrivKeyHex).publicKey()

const nodeIp = process.env.NODE_IP || '127.0.0.1:50051'
const DUMMY_FILE_PATH = path.join(__dirname, '../src/mocks/wallets.json')
const accounts = ['test@notary', 'alice@notary']
const wallets = require(DUMMY_FILE_PATH).wallets

console.log(`setting up accounts and assets with using '${DUMMY_FILE_PATH}'`)
console.log(`accounts: ${accounts.join(', ')}`)
console.log(`assets: ${wallets.map(w => w.name).join(', ')}`)
console.log('')

irohaUtil.login('test@notary', testPrivKeyHex, nodeIp)
  .then(() => tryToCreateAccount('alice', 'notary', alicePubKey))
  .then(() => initializeAssets())
  .then(() => irohaUtil.logout())
  .then(() => setupAccountTransactions('test@notary', testPrivKeyHex))
  .then(() => setupAccountTransactions('alice@notary', alicePrivKeyHex))
  .then(() => console.log('done!'))
  .catch(err => console.error(err))

function initializeAssets () {
  console.log('initializing assets')

  const initializingAssets = wallets.map(w => {
    const precision = String(w.amount).split('.')[1].length
    const amount = String(w.amount)
    const assetName = w.name.toLowerCase()
    const assetId = assetName + '#notary'

    return tryToCreateAsset(assetName, 'notary', precision)
      .then(() => {
        console.log(`adding initial amount of ${assetId} to test@notary`)

        return irohaUtil.addAssetQuantity(testPrivKeyHex, 'test@notary', `${w.name.toLowerCase()}#notary`, amount)
      })
      .then(() => {
        console.log(`distributing initial amount of ${assetId} to every account`)

        const transferringInitialAssets = _.without(accounts, 'test@notary').map(accountId => {
          const amount = String(Math.random() + 1).substr(0, precision + 2)

          return irohaUtil.transferAsset(testPrivKeyHex, 'test@notary', accountId, `${w.name.toLowerCase()}#notary`, 'initial tx', amount).catch(() => {})
        })

        return Promise.all(transferringInitialAssets)
      })
  })

  return Promise.all(initializingAssets)
}

function setupAccountTransactions (accountId, accountPrivKeyHex) {
  console.log(`issuing random tx from ${accountId} to another`)

  return irohaUtil.login(accountId, accountPrivKeyHex, nodeIp)
    .then(() => {
      const txs = []

      wallets.map(w => {
        const precision = String(w.amount).split('.')[1].length

        _.times(_.random(3, 5), () => {
          const from = accountId
          const to = _.sample(_.without(accounts, from))
          const message = _.sample(['hello', 'hi', '', 'PART_OF_DUMMY_SETTLEMENT'])
          const amount = String(Math.random()).substr(0, precision + 2)

          const p = irohaUtil.transferAsset(testPrivKeyHex, from, to, `${w.name.toLowerCase()}#notary`, message, amount).catch(() => {})

          txs.push(p)
        })
      })

      return Promise.all(txs)
    })
    .then(() => irohaUtil.logout())
}

function tryToCreateAccount (accountName, domainId, publicKey) {
  console.log(`trying to create an account: ${accountName}@${domainId}`)

  return new Promise((resolve, reject) => {
    irohaUtil.createAccount(testPrivKeyHex, accountName, domainId, publicKey)
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
  console.log(`trying to create an asset: ${assetName}#${domainId} (precision=${precision})`)

  return new Promise((resolve, reject) => {
    irohaUtil.createAsset(testPrivKeyHex, assetName, domainId, precision)
      .then(() => {
        console.log(`${assetName}#${domainId} (precision: ${precision}) has successfully been created`)
        resolve()
      })
      .catch(err => {
        irohaUtil.getAssetInfo(assetName + '#' + domainId)
          .then(info => {
            if (info.asset.precision === precision) {
              console.log(`${assetName}#${domainId} (precision=${precision}) already exist`)
              resolve()
            } else {
              reject(new Error(`${assetName}#${domainId} is already used with different precision.`))
            }
          })
          .catch(() => reject(err))
      })
  })
}
