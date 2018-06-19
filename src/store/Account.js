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
  SIGNUP_REQUEST: 'SIGNUP_REQUEST',
  SIGNUP_SUCCESS: 'SIGNUP_SUCCESS',
  SIGNUP_FAILURE: 'SIGNUP_FAILURE',
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
    notaryIp: notaryUtil.baseURL,
    accountInfo: {},
    accountQuorum: 0,
    accountSignatories: [],
    rawAssetTransactions: {},
    rawUnsignedTransactions: [],
    rawTransactions: [],
    rawPendingTransactions: null,
    assets: [],
    connectionError: null
  }
}

const state = initialState()

const getters = {
  wallets (state) {
    return state.assets.map(a => {
      // TODO: it is to get asset's properties (e.g. color) which cannot be fetched from API.
      const ASSET = ASSETS.find(d => {
        return (d.name.toLowerCase() === a.assetId.split('#')[0].toLowerCase() || d.asset.toLowerCase() === a.assetId.split('#')[0].toLowerCase())
      })

      return {
        id: a.assetId.replace(/#/g, '$'),
        assetId: a.assetId,
        domain: a.assetId.split('#')[1],

        name: ASSET.name,
        asset: ASSET.asset,
        color: ASSET.color,

        amount: a.balance,
        precision: a.balance.split('.')[1] ? a.balance.split('.')[1].length : 0
      }
    })
  },

  getTransactionsByAssetId: (state) => (assetId) => {
    const resolvedSettlements = getters.resolvedSettlements(state)
    return getTransferAssetsFrom(
      state.rawAssetTransactions[assetId],
      state.accountId,
      resolvedSettlements
    )
  },

  allAssetTransactions () {
    return flatten(Object.values(state.rawAssetTransactions))
  },

  allPendingTransactions: (state) => {
    let pendingTransactionsCopy = cloneDeep(state.rawPendingTransactions)
    return pendingTransactionsCopy ? getTransferAssetsFrom(
      pendingTransactionsCopy.toObject().transactionsList,
      state.accountId
    ).filter(tx => tx.from === 'you') : []
  },

  waitingSettlements () {
    let rawUnsignedTransactionsCopy = cloneDeep(state.rawUnsignedTransactions)
    return !Array.isArray(rawUnsignedTransactionsCopy) ? getSettlementsFrom(
      rawUnsignedTransactionsCopy.toObject().transactionsList,
      state.accountId
    ) : []
  },

  incomingSettlements () {
    return getters.waitingSettlements().filter(pair => {
      return pair.to.signatures.length > 0
    })
  },

  outgoingSettlements () {
    return getters.waitingSettlements().filter(pair => {
      return pair.from.signatures.length > 0
    })
  },

  resolvedSettlements (state) {
    let allAssetTransactionsCopy = getters.allAssetTransactions()
    return getSettlementsFrom(
      allAssetTransactionsCopy,
      state.accountId
    )
  },

  walletType (state) {
    const walletType = []
    if (find('ethereum_wallet', state.accountInfo)) {
      walletType.push(WalletTypes.ETH)
    }

    if (find('bitcoin', state.accountInfo)) {
      walletType.push(WalletTypes.BTC)
    }

    return walletType
  },

  ethWalletAddress (state) {
    const ethWallet = find('ethereum_wallet', state.accountInfo)

    return ethWallet ? ethWallet.ethereum_wallet : null
  },

  btcWalletAddress (state) {
    const btcWallet = find('bitcoin', state.accountInfo)

    return btcWallet ? btcWallet.bitcoin : null
  },

  withdrawWalletAddresses (state) {
    const wallet = find('eth_whitelist', state.accountInfo)
    return wallet ? wallet.eth_whitelist.split(',').map(w => w.trim()) : []
  },

  accountQuorum (state) {
    return state.accountQuorum
  },

  accountSignatories (state) {
    return state.accountSignatories.map((s) => Buffer.from(s, 'base64').toString('hex'))
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
  [types.SET_NOTARY_IP] (state, ip) {
    notaryUtil.baseURL = ip
    state.notaryIp = ip
  },

  [types.RESET] (state) {
    const s = initialState()

    Object.keys(s).forEach(key => {
      state[key] = s[key]
    })
  },

  [types.SIGNUP_REQUEST] (state) {},

  [types.SIGNUP_SUCCESS] (state, account) {
    state.accountId = account.accountId
  },

  [types.SIGNUP_FAILURE] (state, err) {
    handleError(state, err)
  },

  [types.LOGIN_REQUEST] (state) {},

  [types.LOGIN_SUCCESS] (state, account) {
    state.accountId = account.accountId
    state.accountInfo = JSON.parse(account.jsonData)
    state.accountQuorum = account.quorum
  },

  [types.LOGIN_FAILURE] (state, err) {
    handleError(state, err)
  },

  [types.LOGOUT_REQUEST] (state) {},

  [types.LOGOUT_SUCCESS] (state) {},

  [types.LOGOUT_FAILURE] (state, err) {
    handleError(state, err)
  },

  [types.UPDATE_ACCOUNT_REQUEST] (state) {},

  [types.UPDATE_ACCOUNT_SUCCESS] (state, { account }) {
    state.accountId = account.accountId
    state.accountInfo = JSON.parse(account.jsonData)
    state.accountQuorum = account.quorum
  },

  [types.UPDATE_ACCOUNT_FAILURE] (state, err) {
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

  [types.GET_ACCOUNT_TRANSACTIONS_REQUEST] (state) {},

  [types.GET_ACCOUNT_TRANSACTIONS_SUCCESS] (state, transactions) {
    state.rawTransactions = transactions
  },

  [types.GET_ACCOUNT_TRANSACTIONS_FAILURE] (state, err) {
    handleError(state, err)
  },

  [types.GET_ACCOUNT_SIGNATORIES_REQUEST] (state) {},

  [types.GET_ACCOUNT_SIGNATORIES_SUCCESS] (state, signatories) {
    state.accountSignatories = signatories
  },

  [types.GET_ACCOUNT_SIGNATORIES_FAILURE] (state, err) {
    handleError(state, err)
  },

  [types.GET_ALL_UNSIGNED_TRANSACTIONS_REQUEST] (state) {},

  [types.GET_ALL_UNSIGNED_TRANSACTIONS_SUCCESS] (state, transactions) {
    state.rawUnsignedTransactions = transactions
  },

  [types.GET_ALL_UNSIGNED_TRANSACTIONS_FAILURE] (state, err) {
    handleError(state, err)
  },

  [types.GET_PENDING_TRANSACTIONS_REQUEST] (state) {},

  [types.GET_PENDING_TRANSACTIONS_SUCCESS] (state, transactions) {
    state.rawPendingTransactions = transactions
  },

  [types.GET_PENDING_TRANSACTIONS_FAILURE] (state, err) {
    handleError(state, err)
  },

  [types.TRANSFER_ASSET_REQUEST] (state) {},

  [types.TRANSFER_ASSET_SUCCESS] (state) {},

  [types.TRANSFER_ASSET_FAILURE] (state, err) {
    handleError(state, err)
  },

  [types.SIGN_PENDING_REQUEST] (state) {},

  [types.SIGN_PENDING_SUCCESS] (state) {},

  [types.SIGN_PENDING_FAILURE] (state, err) {
    handleError(state, err)
  },

  [types.CREATE_SETTLEMENT_REQUEST] (state) {},

  [types.CREATE_SETTLEMENT_SUCCESS] (state) {},

  [types.CREATE_SETTLEMENT_FAILURE] (state, err) {
    handleError(state, err)
  },

  [types.ACCEPT_SETTLEMENT_REQUEST] (state) {},

  [types.ACCEPT_SETTLEMENT_SUCCESS] (state) {},

  [types.ACCEPT_SETTLEMENT_FAILURE] (state, err) {
    handleError(state, err)
  },

  [types.REJECT_SETTLEMENT_REQUEST] (state) {},

  [types.REJECT_SETTLEMENT_SUCCESS] (state) {},

  [types.REJECT_SETTLEMENT_FAILURE] (state, err) {
    handleError(state, err)
  },

  [types.GET_ALL_ASSET_TRANSACTIONS_REQUEST] (state) {},

  [types.GET_ALL_ASSET_TRANSACTIONS_SUCCESS] (state) {},

  [types.GET_ALL_ASSET_TRANSACTIONS_FAILURE] (state, err) {
    handleError(state, err)
  },

  [types.ADD_ACCOUNT_SIGNATORY_REQUEST] (state) {},

  [types.ADD_ACCOUNT_SIGNATORY_SUCCESS] (state) {},

  [types.ADD_ACCOUNT_SIGNATORY_FAILURE] (state, err) {
    handleError(state, err)
  },

  [types.REMOVE_ACCOUNT_SIGNATORY_REQUEST] (state) {},

  [types.REMOVE_ACCOUNT_SIGNATORY_SUCCESS] (state) {},

  [types.REMOVE_ACCOUNT_SIGNATORY_FAILURE] (state, err) {
    handleError(state, err)
  },

  [types.EDIT_ACCOUNT_QUORUM_REQUEST] (state) {},

  [types.EDIT_ACCOUNT_QUORUM_SUCCESS] (state) {},

  [types.EDIT_ACCOUNT_QUORUM_FAILURE] (state, err) {
    handleError(state, err)
  },

  [types.GET_ACCOUNT_QUORUM_REQUEST] (state) {},

  [types.GET_ACCOUNT_QUORUM_SUCCESS] (state, { quorum }) {
    state.accountQuorum = quorum
  },

  [types.GET_ACCOUNT_QUORUM_FAILURE] (state, err) {
    handleError(state, err)
  }
}

const actions = {
  signup ({ commit }, { username }) {
    commit(types.SIGNUP_REQUEST)

    const { publicKey, privateKey } = irohaUtil.generateKeypair()

    // TODO: POST data to registration API
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('signing up...')
        console.log('username:', username)
        console.log('publicKey:', publicKey)

        resolve()
      }, 1000)
    })
      .then(() => commit(types.SIGNUP_SUCCESS, { username, publicKey, privateKey }))
      .then(() => ({ username, privateKey }))
      .catch(err => {
        commit(types.SIGNUP_FAILURE, err)
        throw err
      })
  },

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

    return irohaUtil.getAccountAssets(state.accountId)
      .then(assets => {
        commit(types.GET_ACCOUNT_ASSETS_SUCCESS, assets)
      })
      .catch(err => {
        commit(types.GET_ACCOUNT_ASSETS_FAILURE, err)
        throw err
      })
  },

  transferAsset ({ commit, state }, { assetId, to, description = '', amount }) {
    commit(types.TRANSFER_ASSET_REQUEST)

    return irohaUtil.transferAsset(privateKeys, state.accountId, to, assetId, description, amount, state.accountQuorum)
      .then(() => {
        commit(types.TRANSFER_ASSET_SUCCESS)
      })
      .catch(err => {
        commit(types.TRANSFER_ASSET_FAILURE, err)
        throw err
      })
  },

  signPendingTransaction ({ commit, state }, { privateKeys, txStoreId }) {
    commit(types.SIGN_PENDING_REQUEST)

    return irohaUtil.signPendingTransaction(privateKeys, state.rawPendingTransactions.getTransactionsList()[txStoreId])
      .then(() => {
        commit(types.SIGN_PENDING_SUCCESS)
      })
      .catch(err => {
        commit(types.SIGN_PENDING_FAILURE, err)
        throw err
      })
  },

  createSettlement (
    { commit, state },
    { privateKeys, to, offerAssetId, offerAmount, requestAssetId, requestAmount, description = '' }
  ) {
    commit(types.CREATE_SETTLEMENT_REQUEST)

    return irohaUtil.createSettlement(
      privateKeys,
      state.accountId,
      state.accountQuorum,
      offerAssetId,
      offerAmount,
      description,
      to,
      1,
      requestAssetId,
      requestAmount
    )
      .then(() => {
        commit(types.CREATE_SETTLEMENT_SUCCESS)
      })
      .catch(err => {
        commit(types.CREATE_SETTLEMENT_FAILURE, err)
        throw err
      })
  },

  acceptSettlement ({ commit, state }, { privateKeys, settlementBatch }) {
    commit(types.ACCEPT_SETTLEMENT_REQUEST)
    const batch = findBatchFromRaw(state.rawUnsignedTransactions, settlementBatch)
    return irohaUtil.acceptSettlement(privateKeys, batch)
      .then(() => {
        commit(types.ACCEPT_SETTLEMENT_SUCCESS)
      })
      .catch(err => {
        commit(types.ACCEPT_SETTLEMENT_FAILURE, err)
        throw err
      })
  },

  rejectSettlement ({ commit, state }, { privateKeys, settlementBatch }) {
    commit(types.REJECT_SETTLEMENT_REQUEST)
    const batch = findBatchFromRaw(state.rawUnsignedTransactions, settlementBatch)
    const fake = new Array(state.accountQuorum)
      .fill('1234567890123456789012345678901234567890123456789012345678901234')
    return irohaUtil.rejectSettlement(fake, batch)
      .then(() => {
        commit(types.REJECT_SETTLEMENT_SUCCESS)
      })
      .catch(err => {
        commit(types.REJECT_SETTLEMENT_FAILURE, err)
        throw err
      })
  },

  addSignatory ({ commit, state }, privateKeys) {
    commit(types.ADD_ACCOUNT_SIGNATORY_REQUEST)

    const { privateKey } = irohaUtil.generateKeypair()
    const publicKeyBuffer = derivePublicKey(Buffer.from(privateKey, 'hex'))
    return irohaUtil.addSignatory(privateKeys, state.accountId, publicKeyBuffer, state.accountQuorum)
      .then(() => commit(types.ADD_ACCOUNT_SIGNATORY_SUCCESS))
      .then(() => ({ username: state.accountId, privateKey }))
      .catch(err => {
        commit(types.ADD_ACCOUNT_SIGNATORY_FAILURE, err)
        throw err
      })
  },

  removeSignatory ({ commit, state }, { privateKeys, publicKey }) {
    commit(types.REMOVE_ACCOUNT_SIGNATORY_REQUEST)
    return irohaUtil.removeSignatory(privateKeys, state.accountId, publicKey, state.accountQuorum)
      .then(() => commit(types.REMOVE_ACCOUNT_SIGNATORY_SUCCESS))
      .catch(err => {
        commit(types.REMOVE_ACCOUNT_SIGNATORY_FAILURE, err)
        throw err
      })
  },

  getSignatories ({ commit, state }) {
    commit(types.GET_ACCOUNT_SIGNATORIES_REQUEST)
    return irohaUtil.getSignatories(state.accountId)
      .then((keys) => commit(types.GET_ACCOUNT_SIGNATORIES_SUCCESS, keys))
      .catch(err => {
        commit(types.GET_ACCOUNT_SIGNATORIES_FAILURE, err)
        throw err
      })
  },

  editAccountQuorum ({ commit, state }, { privateKeys, quorum }) {
    commit(types.EDIT_ACCOUNT_QUORUM_REQUEST)
    return irohaUtil.setAccountQuorum(privateKeys, state.accountId, quorum, state.accountQuorum)
      .then(() => commit(types.EDIT_ACCOUNT_QUORUM_SUCCESS))
      .catch(err => {
        commit(types.EDIT_ACCOUNT_QUORUM_FAILURE, err)
        throw err
      })
  },

  getAccountQuorum ({ commit, state }) {
    commit(types.GET_ACCOUNT_QUORUM_REQUEST)
    return irohaUtil.getAccount(state.accountId)
      .then((account) => commit(types.GET_ACCOUNT_QUORUM_SUCCESS, account))
      .catch(err => {
        commit(types.GET_ACCOUNT_QUORUM_FAILURE, err)
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
