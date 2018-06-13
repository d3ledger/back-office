import Vue from 'vue'
import _ from 'lodash'
import grpc from 'grpc'
import irohaUtil from 'util/iroha-util'
import { amountToString } from 'util/iroha-amount'

// TODO: To be removed. This is used for 2 reasons for now:
//   1. to get assetIds, because previous GetAccountAssets API required a client
//      to know assetIds in advance.
//   2. to get asset's properties (e.g. color) which cannot be fetched from API.
const DUMMY_ASSETS = require('@/mocks/wallets.json').wallets
const DUMMY_ASSET_IDS = DUMMY_ASSETS.map(a => `${a.name.toLowerCase()}#test`)

const types = {
  RESET: 'RESET',
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT_REQUEST: 'LOGOUT_REQUEST',
  LOGOUT_SUCCESS: 'LOGOUT_SUCCESS',
  LOGOUT_FAILURE: 'LOGOUT_FAILURE',
  GET_ACCOUNT_TRANSACTIONS_REQUEST: 'GET_ACCOUNT_TRANSACTIONS_REQUEST',
  GET_ACCOUNT_TRANSACTIONS_SUCCESS: 'GET_ACCOUNT_TRANSACTIONS_SUCCESS',
  GET_ACCOUNT_TRANSACTIONS_FAILURE: 'GET_ACCOUNT_TRANSACTIONS_FAILURE',
  GET_ACCOUNT_ASSET_TRANSACTIONS_REQUEST: 'GET_ACCOUNT_ASSET_TRANSACTIONS_REQUEST',
  GET_ACCOUNT_ASSET_TRANSACTIONS_SUCCESS: 'GET_ACCOUNT_ASSET_TRANSACTIONS_SUCCESS',
  GET_ACCOUNT_ASSET_TRANSACTIONS_FAILURE: 'GET_ACCOUNT_ASSET_TRANSACTIONS_FAILURE',
  GET_ACCOUNT_ASSETS_REQUEST: 'GET_ACCOUNT_ASSETS_REQUEST',
  GET_ACCOUNT_ASSETS_SUCCESS: 'GET_ACCOUNT_ASSETS_SUCCESS',
  GET_ACCOUNT_ASSETS_FAILURE: 'GET_ACCOUNT_ASSETS_FAILURE',
  TRANSFER_ASSET_REQUEST: 'TRANSFER_ASSET_REQUEST',
  TRANSFER_ASSET_SUCCESS: 'TRANSFER_ASSET_SUCCESS',
  TRANSFER_ASSET_FAILURE: 'TRANSFER_ASSET_FAILURE'
}

function initialState () {
  return {
    accountId: '',
    nodeIp: irohaUtil.getStoredNodeIp(),
    accountInfo: {},
    rawAssetTransactions: {},
    assets: [],
    connectionError: null
  }
}

function transformTransactions (transactions) {
  if (!transactions) return []

  const transformed = []

  transactions.forEach(t => {
    const { commandsList, createdTime } = t.payload

    commandsList.forEach(c => {
      if (!c.transferAsset) return

      const {
        amount,
        destAccountId,
        srcAccountId,
        description
      } = c.transferAsset

      transformed.push({
        from: srcAccountId === state.accountId ? 'you' : srcAccountId,
        to: destAccountId === state.accountId ? 'you' : destAccountId,
        amount: amountToString(amount),
        date: createdTime,
        message: description,
        // TODO: set appropreate tx status ('accepted', 'rejected', 'canceled')
        status: 'accepted'
      })
    })
  })

  /*
   * As actions.getAccountTransactions() does, we fetch account's txs
   * by multiple getAccount*Asset*Transactions calls.
   *
   * Also, getAccount*Asset*Transactions returns txs each of which includes
   * one or more command(s), which possibly includes also commands issued
   * against different asset.
   *
   * Therefore, when merging transactions for multiple assets, duplication
   * possibly occurs.
   * e.g.
   *    accountAssetTransactions_of_asset_A = [
   *      { commands: [command_for_asset_A_1, command_for_asset_B_1] },
   *      { commands: [command_for_asset_A_2] }
   *    ]
   *    accountAssetTransactions_of_asset_B = [
   *      { commands: [command_for_asset_A_1, command_for_asset_B_1] }
   *    ]
   *    // -> command_for_asset_A_1 and B_1 duplicates!
   *
   * To avoid it, we uniq the transactions.
   */
  return _(transformed)
    .chain()
    .uniqWith(_.isEqual)
    .sortBy('date')
    .reverse()
    .value()
}

const state = initialState()

const getters = {
  wallets (state) {
    return state.assets.map(a => {
      // TODO: remove it after irohaUtil.getAccountAssets is updated
      const DUMMY_ASSET = DUMMY_ASSETS.find(d => {
        return (d.name.toLowerCase() === a.accountAsset.assetId.split('#')[0])
      })

      return {
        id: a.accountAsset.assetId.replace(/#/g, '$'),
        assetId: a.accountAsset.assetId,

        // TODO: change these to use API, not dummy
        name: DUMMY_ASSET.name,
        asset: DUMMY_ASSET.asset,
        color: DUMMY_ASSET.color,
        address: DUMMY_ASSET.address,

        amount: amountToString(a.accountAsset.balance),
        precision: a.accountAsset.balance.precision
      }
    })
  },

  getTransactionsByAssetId: (state) => (assetId) => {
    return transformTransactions(state.rawAssetTransactions[assetId])
  }
}

/**
 * Store a connection error so the top component can handle it.
 * @param {Object} state
 * @param {Error} err
 */
function handleError (state, err) {
  switch (err.code) {
    case grpc.status.UNAVAILABLE:
    case grpc.status.CANCELLED:
      state.connectionError = err
      break

    default:
      state.connectionError = null
  }
}

const mutations = {
  [types.RESET] (state) {
    const s = initialState()

    Object.keys(s).forEach(key => {
      state[key] = s[key]
    })
  },

  [types.LOGIN_REQUEST] (state) {},

  [types.LOGIN_SUCCESS] (state, account) {
    state.accountId = account.accountId
  },

  [types.LOGIN_FAILURE] (state, err) {
    handleError(state, err)
  },

  [types.LOGOUT_REQUEST] (state) {},

  [types.LOGOUT_SUCCESS] (state) {},

  [types.LOGOUT_FAILURE] (state, err) {
    handleError(state, err)
  },

  [types.GET_ACCOUNT_ASSET_TRANSACTIONS_REQUEST] (state) {},

  [types.GET_ACCOUNT_ASSET_TRANSACTIONS_SUCCESS] (state, { assetId, transactions }) {
    Vue.set(state.rawAssetTransactions, assetId, transactions)
  },

  [types.GET_ACCOUNT_ASSET_TRANSACTIONS_FAILURE] (state, err) {
    handleError(state, err)
  },

  [types.GET_ACCOUNT_ASSETS_REQUEST] (state) {},

  [types.GET_ACCOUNT_ASSETS_SUCCESS] (state, assets) {
    state.assets = assets
  },

  [types.GET_ACCOUNT_ASSETS_FAILURE] (state, err) {
    handleError(state, err)
  },

  [types.TRANSFER_ASSET_REQUEST] (state) {},

  [types.TRANSFER_ASSET_SUCCESS] (state) {},

  [types.TRANSFER_ASSET_FAILURE] (state, err) {
    handleError(state, err)
  }
}

const actions = {
  login ({ commit }, { username, privateKey, nodeIp }) {
    commit(types.LOGIN_REQUEST)

    return irohaUtil.login(username, privateKey, nodeIp)
      .then(account => commit(types.LOGIN_SUCCESS, account))
      .catch(err => {
        commit(types.LOGIN_FAILURE, err)
        throw err
      })
  },

  logout ({ commit }) {
    commit(types.LOGOUT_REQUEST)

    return irohaUtil.logout()
      .then(() => {
        commit(types.RESET)
        commit(types.LOGOUT_SUCCESS)
      })
      .catch(err => {
        commit(types.LOGOUT_FAILURE, err)
        throw err
      })
  },

  getAccountAssetTransactions ({ commit, state }, { assetId }) {
    commit(types.GET_ACCOUNT_ASSET_TRANSACTIONS_REQUEST)

    return irohaUtil.getAccountAssetTransactions(state.accountId, assetId)
      .then(responses => {
        commit(types.GET_ACCOUNT_ASSET_TRANSACTIONS_SUCCESS, {
          assetId: assetId,
          transactions: responses
        })
      })
      .catch(err => {
        commit(types.GET_ACCOUNT_ASSET_TRANSACTIONS_FAILURE, err)
        throw err
      })
  },

  getAccountAssets ({ commit, state }) {
    commit(types.GET_ACCOUNT_ASSETS_REQUEST)

    // TODO: fix it after irohaUtil.getAccountAssets is updated
    const assetIds = DUMMY_ASSET_IDS
    const gettingAccountAssets = assetIds.map(assetId => {
      return irohaUtil.getAccountAssets(state.accountId, assetId)
    })

    return Promise.all(gettingAccountAssets)
      .then(responses => {
        commit(types.GET_ACCOUNT_ASSETS_SUCCESS, _.flatten(responses))
      })
      .catch(err => {
        commit(types.GET_ACCOUNT_ASSETS_FAILURE, err)
        throw err
      })
  },

  transferAsset ({ commit, state }, { assetId, to, description = '', amount }) {
    commit(types.TRANSFER_ASSET_REQUEST)

    return irohaUtil.transferAsset(state.accountId, to, assetId, description, amount)
      .then(() => {
        commit(types.TRANSFER_ASSET_SUCCESS)
      })
      .catch(err => {
        commit(types.TRANSFER_ASSET_FAILURE, err)
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
