import { grpc } from 'grpc-web-client'
import flow from 'lodash/fp/flow'
import { queryHelper, txHelper, cryptoHelper } from 'iroha-helpers'

import { QueryServiceClient, CommandServiceClient } from 'iroha-helpers/lib/proto/endpoint_pb_service.js'
import * as pbResponse from 'iroha-helpers/lib/proto/qry_responses_pb.js'
import { TxStatus, TxStatusRequest } from 'iroha-helpers/lib/proto/endpoint_pb.js'

const debug = require('debug')('iroha-util')
/**
 * default timeout limit of queries
 */
const DEFAULT_TIMEOUT_LIMIT = 5000

/**
 * cached items available from start to end of the app
 * plus, `nodeIp` is persisted by localStorage
 */
const cache = {
  username: null, // NOT persisted by localStorage
  // TODO: do not cache keys; require a private key on every action instead.
  // For now it is needed for queries until tokens are implemented.
  key: null, // NOT persisted by localStorage
  nodeIp: null // persisted by localStorage
}

/**
 * mock localStorage for testing environment
 */
const localStorage = global.localStorage || {
  setItem () {},
  getItem () {},
  removeItem () {}
}

/*
 * ===== functions =====
 */
/**
 * login
 * @param {String} username
 * @param {String} privateKey length is 64
 * @param {String} nodeIp
 */
function login (username, privateKey, nodeIp) {
  debug('starting login...')

  if (privateKey.length !== 64) {
    return Promise.reject(new Error('privateKey should have length of 64'))
  }

  cache.username = username
  cache.key = privateKey
  cache.nodeIp = nodeIp

  localStorage.setItem('iroha-wallet:nodeIp', nodeIp)

  return getAccount(username)
    .then(account => {
      debug('login succeeded!')
      return account
    })
    .catch(err => {
      debug('login failed')
      throw err
    })
}

/**
 * clear local cache
 */
function logout () {
  cache.username = null
  cache.key = null
  cache.nodeIp = null

  return Promise.resolve()
}

/**
 * return node IP which was used before
 */
function getStoredNodeIp () {
  return localStorage.getItem('iroha-wallet:nodeIp') || ''
}

/**
 * clear localStorage
 */
function clearStorage () {
  localStorage.removeItem('iroha-wallet:nodeIp')
}

/**
 * return true if logged in
 */
function isLoggedIn () {
  return !!cache.username
}

/**
 * generate new keypair
 */
const generateKeypair = cryptoHelper.generateKeyPair

// TODO: implement it
function acceptSettlement () {
  debug('starting acceptSettlement...')

  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), 500)
  })
}

// TODO: implement it
function rejectSettlement () {
  debug('starting rejectSettlement...')

  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), 500)
  })
}

/*
 * ===== queries =====
 */
/**
 * wrapper function of queries
 * @param {Object} query
 * @param {Function} onResponse
 * @param {Number} timeoutLimit timeoutLimit
 */
function sendQuery (
  query,
  onResponse = function (resolve, reject, responseName, response) {},
  timeoutLimit = DEFAULT_TIMEOUT_LIMIT
) {
  return new Promise((resolve, reject) => {
    const queryClient = new QueryServiceClient(
      cache.nodeIp
    )

    let queryToSend = flow(
      (q) => queryHelper.addMeta(q, { creatorAccountId: cache.username }),
      (q) => queryHelper.sign(q, cache.key)
    )(query)

    debug('submitting query...')
    debug('peer ip:', cache.nodeIp)
    debug('parameters:', JSON.stringify(queryToSend.toObject().payload, null, '  '))
    debug('')

    // grpc-node hangs against unresponsive server, which possibly occur when
    // invalid node IP is set. To avoid this problem, we use timeout timer.
    // c.f. https://github.com/grpc/grpc/issues/13163
    const timer = setTimeout(() => {
      queryClient.$channel.close()
      const err = new Error('please check IP address OR your internet connection')
      err.code = grpc.Code.Canceled
      reject(err)
    }, timeoutLimit)

    queryClient.find(queryToSend, (err, response) => {
      clearTimeout(timer)

      if (err) {
        return reject(err)
      }

      debug('submitted query successfully!')

      const type = response.getResponseCase()
      const responseName = getProtoEnumName(
        pbResponse.QueryResponse.ResponseCase,
        'iroha.protocol.QueryResponse',
        type
      )

      onResponse(resolve, reject, responseName, response)
    })
  })
}

/**
 * getAccount https://hyperledger.github.io/iroha-api/#get-account
 * @param {String} accountId
 */
function getAccount (accountId) {
  debug('starting getAccount...')

  return sendQuery(
    queryHelper.addQuery(queryHelper.emptyQuery(), 'getAccount', { accountId }),
    (resolve, reject, responseName, response) => {
      if (responseName !== 'ACCOUNT_RESPONSE') {
        return reject(new Error(`Query response error: expected=ACCOUNT_RESPONSE, actual=${responseName}`))
      }

      const account = response.getAccountResponse().getAccount().toObject()

      debug('account', account)

      resolve(account)
    }
  )
}

/**
 * getAccountTransactions https://hyperledger.github.io/iroha-api/#get-account-transactions
 * @param {String} accountId
 */
function getAccountTransactions (accountId) {
  debug('starting getAccountTransactions...')

  return sendQuery(
    queryHelper.addQuery(queryHelper.emptyQuery(), 'getAccountTransactions', { accountId: 'test@notary' }),
    (resolve, reject, responseName, response) => {
      if (responseName !== 'TRANSACTIONS_RESPONSE') {
        return reject(new Error(`Query response error: expected=TRANSACTIONS_RESPONSE, actual=${responseName}`))
      }

      const transactions = response.getTransactionsResponse().toObject().transactionsList

      debug('transactions', transactions)

      resolve(transactions)
    }
  )
}

/**
 * getAccountAssetTransactions https://hyperledger.github.io/iroha-api/#get-account-asset-transactions
 * @param {String} accountId
 * @param {String} assetId
 */
function getAccountAssetTransactions (accountId, assetId) {
  debug('starting getAccountAssetTransactions...')

  return sendQuery(
    queryHelper.addQuery(queryHelper.emptyQuery(), 'getAccountAssetTransactions', { accountId, assetId }),
    (resolve, reject, responseName, response) => {
      if (responseName !== 'TRANSACTIONS_RESPONSE') {
        return reject(new Error(`Query response error: expected=TRANSACTIONS_RESPONSE, actual=${responseName}`))
      }

      const transactions = response.getTransactionsResponse().toObject().transactionsList

      debug('transactions', transactions)

      resolve(transactions)
    }
  )
}

/**
 * getAccountAssets https://hyperledger.github.io/iroha-api/#get-account-assets
 * @param {String} accountId
 */
function getAccountAssets (accountId) {
  debug('starting getAccountAssets...')

  return sendQuery(
    queryHelper.addQuery(queryHelper.emptyQuery(), 'getAccountAssets', { accountId }),
    (resolve, reject, responseName, response) => {
      if (responseName !== 'ACCOUNT_ASSETS_RESPONSE') {
        return reject(new Error(`Query response error: expected=ACCOUNT_ASSETS_RESPONSE, actual=${responseName}`))
      }

      const assets = response.getAccountAssetsResponse().toObject().accountAssetsList

      debug('assets', assets)

      resolve(assets)
    }
  )
}

/**
 * getAssetInfo https://hyperledger.github.io/iroha-api/?protobuf#get-asset-info
 * @param {String} assetId
 */
function getAssetInfo (assetId) {
  debug('starting getAssetInfo...')

  return sendQuery(
    queryHelper.addQuery(queryHelper.emptyQuery(), 'getAssetInfo', { assetId }),
    (resolve, reject, responseName, response) => {
      if (responseName !== 'ASSET_RESPONSE') {
        return reject(new Error(`Query response error: expected=ASSET_RESPONSE, actual=${responseName}`))
      }

      const info = response.getAssetResponse().toObject()

      debug('asset info', info)

      resolve(info)
    }
  )
}

// TODO: implement it
function getAllUnsignedTransactions (accountId) {
  debug('starting getAllUnsignedTransactions...')

  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(['DUMMY']), 500)
  })
}

/*
 * ===== commands =====
 */
/**
 * wrapper function of commands
 * @param {String} privateKey
 * @param {Object} tx transaction
 * @param {Number} timeoutLimit
 */
function command (
  privateKey = '',
  tx,
  timeoutLimit = DEFAULT_TIMEOUT_LIMIT
) {
  let txClient, txHash

  return new Promise((resolve, reject) => {
    let txToSend = flow(
      (t) => txHelper.addMeta(t, { creatorAccountId: cache.username }),
      (t) => txHelper.sign(t, privateKey)
    )(tx)

    txHash = txHelper.hash(txToSend)

    txClient = new CommandServiceClient(
      cache.nodeIp
    )

    debug('submitting transaction...')
    debug('peer ip:', cache.nodeIp)
    debug('parameters:', JSON.stringify(txToSend.getPayload(), null, '  '))
    debug('txhash:', Buffer.from(txHash).toString('hex'))
    debug('')

    const timer = setTimeout(() => {
      txClient.$channel.close()
      reject(new Error('please check IP address OR your internet connection'))
    }, timeoutLimit)

    txClient.torii(txToSend, (err, data) => {
      clearTimeout(timer)

      if (err) {
        return reject(err)
      }

      debug('submitted transaction successfully!')
      resolve()
    })
  })
    .then(() => {
      debug('opening transaction status stream...')

      return new Promise((resolve, reject) => {
        const request = new TxStatusRequest()

        request.setTxHash(txHash)

        let stream = txClient.statusStream(request)

        // TODO: fix this if (when) https://github.com/improbable-eng/grpc-web/pull/189 is merged
        const notaryError = () => {
          reject(new Error('Problem with notary. Please try again later.'))
          stream.cancel()
        }
        let timer = setTimeout(notaryError, timeoutLimit * 2)

        let statuses = []

        stream.on('data', function (response) {
          clearInterval(timer)
          statuses.push(response)
          timer = setTimeout(notaryError, timeoutLimit * 2)
        })

        stream.on('end', function (end) {
          clearTimeout(timer)

          const last = statuses[statuses.length - 1].getTxStatus()

          const lastStatusName = getProtoEnumName(
            TxStatus,
            'iroha.protocol.TxStatus',
            last
          )

          if (lastStatusName !== 'COMMITTED') {
            return reject(new Error(`Your transaction wasn't commited: expected=COMMITED, actual=${lastStatusName}`))
          }

          resolve()
        })
      })
    })
}

/**
 * createAccount https://hyperledger.github.io/iroha-api/?protobuf#create-account
 * @param {String} privateKey
 * @param {String} accountName
 * @param {String} domainId
 * @param {String} mainPubKey
 */
function createAccount (privateKey, accountName, domainId, mainPubkey) {
  debug('starting createAccount...')

  return command(
    privateKey,
    txHelper.addCommand(txHelper.emptyTransaction(), 'createAccount', { accountName, domainId, mainPubkey })
  )
}

/**
 * createAsset https://hyperledger.github.io/iroha-api/#create-asset
 * @param {String} privateKey
 * @param {String} assetName
 * @param {String} domainI
 * @param {Number} precision
 */
function createAsset (privateKey, assetName, domainId, precision) {
  debug('starting createAsset...')

  return command(
    privateKey,
    txHelper.addCommand(txHelper.emptyTransaction(), 'createAsset', { assetName, domainId, precision })
  )
}

/**
 * addAssetQuantity https://hyperledger.github.io/iroha-api/#add-asset-quantity
 * @param {String} privateKey
 * @param {String} accountId
 * @param {String} assetId
 * @param {String} amount
 */
function addAssetQuantity (privateKey, assetId, amount) {
  debug('starting addAssetQuantity...')

  return command(
    privateKey,
    txHelper.addCommand(txHelper.emptyTransaction(), 'addAssetQuantity', { assetId, amount })
  )
}

/**
 * setAccountDetail https://hyperledger.github.io/iroha-api/#set-account-detail
 * @param {String} privateKey
 * @param {String} accountId
 * @param {String} key
 * @param {String} value
 */
function setAccountDetail (privateKey, accountId, key, value) {
  debug('starting setAccountDetail...')

  return command(
    privateKey,
    txHelper.addCommand(txHelper.emptyTransaction(), 'setAccountDetail', { accountId, key, value })
  )
}

/**
 * transferAsset https://hyperledger.github.io/iroha-api/#transfer-asset
 * @param {String} privateKey
 * @param {String} srcAccountId
 * @param {String} destAccountId
 * @param {String} assetId
 * @param {String} description
 * @param {String} amount
 */
function transferAsset (privateKey, srcAccountId, destAccountId, assetId, description, amount) {
  debug('starting transferAsset...')

  return command(
    privateKey,
    txHelper.addCommand(txHelper.emptyTransaction(), 'transferAsset', { srcAccountId, destAccountId, assetId, description, amount })
  )
}

// TODO: implement it
function createSettlement () {
  debug('starting createSettlement...')

  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), 500)
  })
}

/*
 *  ===== utilities ===
 */

const protoEnumName = {}
function getProtoEnumName (obj, key, value) {
  if (protoEnumName.hasOwnProperty(key)) {
    if (protoEnumName[key].length < value) {
      return 'unknown'
    } else {
      return protoEnumName[key][value]
    }
  } else {
    protoEnumName[key] = []
    for (let k in obj) {
      let idx = obj[k]
      if (isNaN(idx)) {
        debug(
          'getProtoEnumName:wrong enum value, now is type of ' +
            typeof idx +
            ' should be integer'
        )
      } else {
        protoEnumName[key][idx] = k
      }
    }
    return getProtoEnumName(obj, key, value)
  }
}

/*
 *  ===== export ===
 */
export default {
  getStoredNodeIp,
  clearStorage,
  login,
  logout,
  isLoggedIn,
  generateKeypair,
  acceptSettlement,
  rejectSettlement,

  // queries
  getAccount,
  getAccountAssets,
  getAccountAssetTransactions,
  getAccountTransactions,
  getAssetInfo,
  getAllUnsignedTransactions,

  // commands
  createAccount,
  createAsset,
  transferAsset,
  addAssetQuantity,
  createSettlement,
  setAccountDetail
}
