import { grpc } from 'grpc-web-client'
import flow from 'lodash/fp/flow'
import { queryHelper } from 'iroha-helpers'
import { QueryServiceClient } from 'iroha-helpers/lib/proto/endpoint_pb_service'
import * as pbResponse from 'iroha-helpers/lib/proto/qry_responses_pb'
import {
  cache,
  getProtoEnumName,
  DEFAULT_TIMEOUT_LIMIT
} from './util'

import Debug from 'debug'
const debug = Debug('iroha-util')

/**
 * wrapper function of queries
 * @param {Object} query
 * @param {Function} onResponse
 * @param {Number} timeoutLimit
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

    /**
     * grpc-node hangs against unresponsive server, which possibly occur when
     * invalid node IP is set. To avoid this problem, we use timeout timer.
     * c.f. {@link https://github.com/grpc/grpc/issues/13163 Grpc issue 13163}
     */
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
 * getAccount
 * {@link https://iroha.readthedocs.io/en/latest/api/queries.html#get-account getAccount - Iroha docs}
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
 * getSignatories
 * {@link https://iroha.readthedocs.io/en/latest/api/queries.html#get-signatories getSignatories - Iroha docs}
 * @param {String} accountId
 */
function getSignatories (accountId) {
  debug('starting getSignatories...')

  return sendQuery(
    queryHelper.addQuery(queryHelper.emptyQuery(), 'getSignatories', { accountId }),
    (resolve, reject, responseName, response) => {
      if (responseName !== 'SIGNATORIES_RESPONSE') {
        return reject(new Error(`Query response error: expected=ACCOUNT_RESPONSE, actual=${responseName}`))
      }

      const account = response.getSignatoriesResponse().toObject().keysList

      debug('account', account)

      resolve(account)
    }
  )
}

/**
 * getAccountTransactions
 * {@link https://iroha.readthedocs.io/en/latest/api/queries.html#get-account-transactions getAccountTransactions - Iroha docs}
 * @param {String} accountId
 */
function getAccountTransactions (accountId) {
  debug('starting getAccountTransactions...')

  return sendQuery(
    queryHelper.addQuery(queryHelper.emptyQuery(), 'getAccountTransactions', { accountId }),
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
 * getAccountAssetTransactions
 * {@link https://iroha.readthedocs.io/en/latest/api/queries.html#get-account-asset-transactions getAccountAssetTransactions - Iroha docs}
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
 * getAccountAssets
 * {@link https://iroha.readthedocs.io/en/latest/api/queries.html#get-account-assets getAccountAssets - Iroha docs}
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
 * getAssetInfo
 * {@link https://iroha.readthedocs.io/en/latest/api/queries.html#get-asset-info getAssetInfo - Iroha docs}
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

/**
 * getPendingTransactions
 * {@link https://iroha.readthedocs.io/en/latest/api/queries.html#get-pending-transactions getPendingTransactions - Iroha docs}
 */
function getPendingTransactions () {
  debug('starting getPendingTransactions...')

  return sendQuery(
    queryHelper.addQuery(queryHelper.emptyQuery(), 'getPendingTransactions'),
    (resolve, reject, responseName, response) => {
      if (responseName !== 'TRANSACTIONS_RESPONSE') {
        return reject(new Error(`Query response error: expected=TRANSACTIONS_RESPONSE , actual=${responseName}`))
      }
      const transactions = response.getTransactionsResponse()
      debug('transactions', transactions)

      resolve(transactions)
    }
  )
}

export {
  getAccount,
  getAccountAssets,
  getAccountAssetTransactions,
  getAccountTransactions,
  getSignatories,
  getPendingTransactions,
  getAssetInfo
}
