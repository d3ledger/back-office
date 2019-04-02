import map from 'lodash/fp/map'
import flatMap from 'lodash/fp/flatMap'
import concat from 'lodash/fp/concat'
import fromPairs from 'lodash/fp/fromPairs'
import flow from 'lodash/fp/flow'
import { grpc } from 'grpc-web-client'
import irohaUtil from '@util/iroha'

const types = flow(
  flatMap(x => [x + '_REQUEST', x + '_SUCCESS', x + '_FAILURE']),
  concat([
  ]),
  map(x => [x, x]),
  fromPairs
)([
  'SEARCH_TRANSACTION_BY_ID',
  'SEARCH_TRANSACTIONS_BY_ACCOUNT_ID',
  'SEARCH_TRANSACTIONS_BY_BLOCK'
])

function initialState () {
  return {
    searchedTransactions: []
  }
}

const state = initialState()

const getters = {
  searchedTransactions (state) {
    return state.searchedTransactions
  }
}

/**
 * Store a connection error so the top component can handle it.
 * @param {Object} state
 * @param {Error} err
 */
function handleError (state, err) {
  switch (err.code) {
    case grpc.Code.Unavailable:
    case grpc.Code.Canceled:
      state.connectionError = err
      break

    default:
      state.connectionError = null
  }
}

const mutations = {
  [types.SEARCH_TRANSACTION_BY_ID_REQUEST] (state) {
  },

  [types.SEARCH_TRANSACTION_BY_ID_SUCCESS] (state, result) {
    state.searchedTransactions = result.transactions.map(item => ({
      createdTime: item.payload.reducedPayload.createdTime,
      srcAccountId: item.payload.reducedPayload.commandsList[0].transferAsset.srcAccountId,
      destAccountId: item.payload.reducedPayload.commandsList[0].transferAsset.destAccountId,
      amount: item.payload.reducedPayload.commandsList[0].transferAsset.amount,
      assetId: item.payload.reducedPayload.commandsList[0].transferAsset.assetId,
      description: item.payload.reducedPayload.commandsList[0].transferAsset.description
    }))
  },

  [types.SEARCH_TRANSACTION_BY_ID_FAILURE] (state, err) {
    state.searchedTransactions = []
    handleError(state, err)
  },
  [types.SEARCH_TRANSACTIONS_BY_ACCOUNT_ID_REQUEST] (state) {
  },

  [types.SEARCH_TRANSACTIONS_BY_ACCOUNT_ID_SUCCESS] (state, result) {
    state.searchedTransactions = result.transactions.map(item => ({
      createdTime: item.payload.reducedPayload.createdTime,
      srcAccountId: item.payload.reducedPayload.commandsList[0].transferAsset.srcAccountId,
      destAccountId: item.payload.reducedPayload.commandsList[0].transferAsset.destAccountId,
      amount: item.payload.reducedPayload.commandsList[0].transferAsset.amount,
      assetId: item.payload.reducedPayload.commandsList[0].transferAsset.assetId,
      description: item.payload.reducedPayload.commandsList[0].transferAsset.description
    }))
  },

  [types.SEARCH_TRANSACTIONS_BY_ACCOUNT_ID_FAILURE] (state, err) {
    state.searchedTransactions = []
    handleError(state, err)
  },
  [types.SEARCH_TRANSACTIONS_BY_BLOCK_REQUEST] (state) {
  },

  [types.SEARCH_TRANSACTIONS_BY_BLOCK_SUCCESS] (state, result) {
    state.searchedTransactions = result.transactions
      .filter(item => item.payload.reducedPayload.commandsList[0].transferAsset)
      .map(item => ({
        createdTime: item.payload.reducedPayload.createdTime,
        srcAccountId: item.payload.reducedPayload.commandsList[0].transferAsset.srcAccountId,
        destAccountId: item.payload.reducedPayload.commandsList[0].transferAsset.destAccountId,
        amount: item.payload.reducedPayload.commandsList[0].transferAsset.amount,
        assetId: item.payload.reducedPayload.commandsList[0].transferAsset.assetId,
        description: item.payload.reducedPayload.commandsList[0].transferAsset.description
      }))
  },

  [types.SEARCH_TRANSACTIONS_BY_BLOCK_FAILURE] (state, err) {
    state.searchedTransactions = []
    handleError(state, err)
  }
}

const actions = {
  searchTransactionById ({ commit, state }, { transactionId }) {
    commit(types.SEARCH_TRANSACTION_BY_ID_REQUEST)
    return irohaUtil.getTransactions({
      txHashes: [transactionId]
    })
      .then(responses => {
        commit(types.SEARCH_TRANSACTION_BY_ID_SUCCESS, {
          transactions: responses
        })
      })
      .catch(err => {
        commit(types.SEARCH_TRANSACTION_BY_ID_FAILURE, err)
        throw err
      })
  },
  searchTransactionsByAccountId ({ commit, state }, { accountId }) {
    commit(types.SEARCH_TRANSACTIONS_BY_ACCOUNT_ID_REQUEST)
    return irohaUtil.getAccountTransactions({
      accountId,
      pageSize: 100,
      firstTxHash: undefined
    })
      .then(responses => {
        commit(types.SEARCH_TRANSACTIONS_BY_ACCOUNT_ID_SUCCESS, {
          transactions: responses.transactionsList
        })
      })
      .catch(err => {
        commit(types.SEARCH_TRANSACTIONS_BY_ACCOUNT_ID_FAILURE, err)
        throw err
      })
  },

  searchTransactionsByBlock ({ commit, state }, { height }) {
    commit(types.SEARCH_TRANSACTIONS_BY_BLOCK_REQUEST)
    return irohaUtil.getBlock({
      height
    })
      .then(responses => {
        commit(types.SEARCH_TRANSACTIONS_BY_BLOCK_SUCCESS, {
          transactions: responses.payload.transactionsList
        })
      })
      .catch(err => {
        commit(types.SEARCH_TRANSACTIONS_BY_BLOCK_FAILURE, err)
        throw err
      })
  }
}

export default {
  types,
  state,
  getters,
  mutations,
  actions
}
