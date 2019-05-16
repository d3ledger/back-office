import Vue from 'vue'
import map from 'lodash/fp/map'
import flatMap from 'lodash/fp/flatMap'
import concat from 'lodash/fp/concat'
import fromPairs from 'lodash/fp/fromPairs'
import flow from 'lodash/fp/flow'
import find from 'lodash/fp/find'
import cloneDeep from 'lodash/fp/cloneDeep'
import flatten from 'lodash/fp/flatten'
import { grpc } from 'grpc-web-client'
import irohaUtil from '@util/iroha'
import notaryUtil from '@util/notary-util'
import { getTransferAssetsFrom, getSettlementsFrom, findBatchFromRaw } from '@util/store-util'
import { derivePublicKey } from 'ed25519.js'
import { WalletTypes } from '@/data/consts'

// TODO: Move it into notary's API so we have the same list
const ASSETS = require('@util/crypto-list.json')

const types = flow(
  flatMap(x => [x + '_REQUEST', x + '_SUCCESS', x + '_FAILURE']),
  concat([
    'RESET',
    'SET_NOTARY_IP'
  ]),
  map(x => [x, x]),
  fromPairs
)([
  'SIGNUP',
  'LOGIN',
  'LOGOUT',
  'UPDATE_ACCOUNT',
  'GET_ACCOUNT_TRANSACTIONS',
  'GET_ACCOUNT_ASSET_TRANSACTIONS',
  'GET_ACCOUNT_ASSET_TRANSACTIONS_NP',
  'GET_ACCOUNT_ASSETS',
  'GET_ACCOUNT_ROLES',
  'GET_ALL_ASSET_TRANSACTIONS',
  'GET_ACCOUNT_SIGNATORIES',
  'GET_ALL_UNSIGNED_TRANSACTIONS',
  'GET_PENDING_TRANSACTIONS',
  'ADD_ACCOUNT_SIGNATORY',
  'REMOVE_ACCOUNT_SIGNATORY',
  'TRANSFER_ASSET',
  'CREATE_SETTLEMENT',
  'ACCEPT_SETTLEMENT',
  'REJECT_SETTLEMENT',
  'SIGN_PENDING',
  'EDIT_ACCOUNT_QUORUM',
  'GET_ACCOUNT_QUORUM',
  'GET_ACCOUNT_LIMITS',
  'SUBSCRIBE_PUSH_NOTIFICATIONS',
  'UNSUBSCRIBE_PUSH_NOTIFICATIONS',
  'SET_WHITELIST',
  'SET_TRANSFER_FEE',
  'GET_TRANSFER_FEE'
])

function initialState () {
  return {
    accountId: '',
    nodeIp: irohaUtil.getStoredNodeIp(),
    notaryIp: notaryUtil.baseURL,
    accountInfo: {},
    accountQuorum: 0,
    accountSignatories: [],
    accountLimits: [],
    accountRoles: [],
    assetTransactions: {},
    rawUnsignedTransactions: [],
    rawTransactions: [],
    assets: [],
    connectionError: null,
    acceptSettlementLoading: false,
    rejectSettlementLoading: false,
    transferFee: {}
  }
}

const state = initialState()

const getters = {
  wallets (state) {
    return state.assets.map(a => {
      // TODO: it is to get asset's properties (e.g. color) which cannot be fetched from API.
      const assetName = a.assetId.split('#')[0].toLowerCase()
      const ASSET = ASSETS.find(d =>
        d.name.toLowerCase() === assetName || d.asset.toLowerCase() === assetName)

      return {
        id: a.assetId.replace(/#/g, '$'),
        assetId: a.assetId,
        domain: a.assetId.split('#')[1],

        name: ASSET.name,
        asset: ASSET.asset,
        color: ASSET.color,

        amount: a.balance,
        precision: ASSET.precision
      }
    })
  },

  availableAssets (state) {
    return ASSETS
      .map(t => {
        const isERC20 = !t.asset.match(/^(BTC|XOR|ETH)$/)
        if (isERC20) {
          return {
            id: `${t.name}$d3`,
            assetId: `${t.name}#d3`,
            feeId: `${t.name}_d3`,
            domain: 'd3',

            name: t.name,
            asset: t.asset
          }
        } else {
          const name = t.name.toLowerCase()
          let domain = ''
          switch (t.asset) {
            case 'ETH':
              domain = 'ethereum'
              break
            case 'BTC':
              domain = 'bitcoin'
              break
            case 'XOR':
              domain = 'sora'
              break
            default:
              throw new Error('Undefined asset! Please check availableAssets method!')
          }
          return {
            id: `${name}$${domain}`,
            assetId: `${name}#${domain}`,
            feeId: `${name}_${domain}`,
            domain: domain,

            name: t.name,
            asset: t.asset
          }
        }
      })
  },

  getTransactionsByAssetId: (state) => (assetId) => {
    const resolvedSettlements = getters.resolvedSettlements(state)
    return state.assetTransactions[assetId] ? getTransferAssetsFrom(
      state.assetTransactions[assetId].transactionsList,
      state.accountId,
      resolvedSettlements
    ) : []
  },

  getPaginationMetaByAssetId: (state) => (assetId) => {
    return state.assetTransactions[assetId]
  },

  allAssetsTransactions () {
    const txs = Object.values(state.assetTransactions)
      .map(a => a.transactionsList)
    return flatten(txs)
  },

  allPendingTransactions: (state) => {
    let pendingTransactionsCopy = cloneDeep(state.rawUnsignedTransactions)
    return !Array.isArray(pendingTransactionsCopy) ? getTransferAssetsFrom(
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
    let allAssetsTransactionsCopy = getters.allAssetsTransactions()
    return getSettlementsFrom(
      allAssetsTransactionsCopy,
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

  hasEthWallet (state, getters) {
    return getters.wallets.some(w => w.domain === 'ethereum')
  },

  hasBtcWallet (state, getters) {
    return getters.wallets.some(w => w.domain === 'bitcoin')
  },

  ethWhiteListAddresses (state, getters) {
    const wallet = find('eth_whitelist', state.accountInfo)
    const whitelist = wallet ? JSON.parse(wallet.eth_whitelist) : []

    if (whitelist.length > 0 && getters.ethWhiteListAddressesAll.length === 0) {
      return whitelist
    }

    return getters.ethWhiteListAddressesAll
      .filter(item => parseInt(item[1]) * 1000 < Date.now())
      .map(item => item[0])
  },

  ethWhiteListAddressesAll (state) {
    const brvsWhitelist = state.accountInfo['brvs@brvs'] ? state.accountInfo['brvs@brvs'].eth_whitelist : null
    if (brvsWhitelist) {
      const brvsWhitelistParsed = JSON.parse(brvsWhitelist)
      return Object.entries(brvsWhitelistParsed)
    } else {
      const wallet = find('eth_whitelist', state.accountInfo)
      return wallet ? JSON.parse(wallet.eth_whitelist) : []
    }
  },

  btcWhiteListAddresses (state, getters) {
    return getters.btcWhiteListAddressesAll
      .filter(item => parseInt(item[1]) * 1000 < Date.now())
      .map(item => item[0])
  },

  btcWhiteListAddressesAll (state) {
    const brvsWhitelist = state.accountInfo['brvs@brvs'] ? state.accountInfo['brvs@brvs'].btc_whitelist : null
    if (brvsWhitelist) {
      const brvsWhitelistParsed = JSON.parse(brvsWhitelist)
      return Object.entries(brvsWhitelistParsed)
    } else {
      const wallet = find('btc_whitelist', state.accountInfo)
      return wallet ? JSON.parse(wallet.btc_whitelist) : []
    }
  },

  accountQuorum (state) {
    const quorum = find('user_quorum', state.accountInfo)
    return quorum ? parseInt(quorum.user_quorum) : state.accountQuorum
  },

  irohaQuorum (state, getters) {
    return state.accountInfo['brvs@brvs'] ? getters.accountQuorum * 2 : getters.accountQuorum
  },

  accountSignatories (state) {
    if (state.accountInfo['brvs@brvs']) {
      return state.accountSignatories.filter((item, key) => key % 2 === 1)
    } else {
      return state.accountSignatories
    }
  },

  accountLimits (state) {
    return state.accountLimits
  },

  rejectSettlementLoading (state) {
    return state.rejectSettlementLoading
  },

  acceptSettlementLoading (state) {
    return state.acceptSettlementLoading
  },

  accountId (state) {
    return state.accountId
  },

  accountRoles (state) {
    return state.accountRoles
  },

  subscribed (state) {
    const subscription = find('push_subscription', state.accountInfo)
    return subscription && subscription.push_subscription.length > 0
  },

  transferFee (state) {
    return state.transferFee
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

  [types.SIGNUP_SUCCESS] (state, params) {
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
    const txs = {
      ...transactions,
      loadedAmount: 100
    }
    Vue.set(state.assetTransactions, assetId, txs)
  },

  [types.GET_ACCOUNT_ASSET_TRANSACTIONS_FAILURE] (state, err) {
    handleError(state, err)
  },

  [types.GET_ACCOUNT_ASSET_TRANSACTIONS_NP_REQUEST] (state) {},

  [types.GET_ACCOUNT_ASSET_TRANSACTIONS_NP_SUCCESS] (state, { assetId, transactions }) {
    const txs = {
      allTransactionsSize: transactions.allTransactionsSize,
      nextTxHash: transactions.nextTxHash,
      loadedAmount: state.assetTransactions[assetId].loadedAmount + 100,
      transactionsList: [
        ...state.assetTransactions[assetId].transactionsList,
        ...transactions.transactionsList
      ]
    }
    Vue.set(state.assetTransactions, assetId, txs)
  },

  [types.GET_ACCOUNT_ASSET_TRANSACTIONS_NP_FAILURE] (state, err) {
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

  [types.ACCEPT_SETTLEMENT_REQUEST] (state) {
    state.acceptSettlementLoading = true
  },

  [types.ACCEPT_SETTLEMENT_SUCCESS] (state) {
    state.acceptSettlementLoading = false
  },

  [types.ACCEPT_SETTLEMENT_FAILURE] (state, err) {
    state.acceptSettlementLoading = false
    handleError(state, err)
  },

  [types.REJECT_SETTLEMENT_REQUEST] (state) {
    state.rejectSettlementLoading = true
  },

  [types.REJECT_SETTLEMENT_SUCCESS] (state) {
    state.rejectSettlementLoading = false
  },

  [types.REJECT_SETTLEMENT_FAILURE] (state, err) {
    state.rejectSettlementLoading = false
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
  },

  [types.GET_ACCOUNT_LIMITS_REQUEST] (state) {},

  [types.GET_ACCOUNT_LIMITS_SUCCESS] (state, jsonData) {
    const parsedJson = JSON.parse(jsonData)
    const accountInfo = parsedJson[state.accountId]
    const limits = accountInfo
      ? Object.keys(accountInfo)
        .filter(key => key.includes('limit_') && accountInfo[key])
        .map(key => JSON.parse(accountInfo[key]))
        .map(limit => {
          const wallet = getters.wallets(state)
            .find(w => w.assetId === limit.assetId)
          return {
            ...limit,
            wallet: {
              name: wallet.name,
              asset: wallet.asset
            }
          }
        })
      : []
    state.accountLimits = limits
  },

  [types.GET_ACCOUNT_LIMITS_FAILURE] (state, err) {
    handleError(state, err)
  },

  [types.GET_ACCOUNT_ROLES_REQUEST] (state) {},

  [types.GET_ACCOUNT_ROLES_SUCCESS] (state, response) {
    state.accountRoles = response.array[1]
  },

  [types.GET_ACCOUNT_ROLES_FAILURE] (state, err) {
    handleError(state, err)
  },

  [types.SUBSCRIBE_PUSH_NOTIFICATIONS_REQUEST] (state) {},

  [types.SUBSCRIBE_PUSH_NOTIFICATIONS_SUCCESS] (state) {},

  [types.SUBSCRIBE_PUSH_NOTIFICATIONS_FAILURE] (state, err) {
    handleError(state, err)
  },

  [types.UNSUBSCRIBE_PUSH_NOTIFICATIONS_REQUEST] (state) {},

  [types.UNSUBSCRIBE_PUSH_NOTIFICATIONS_SUCCESS] (state) { },

  [types.UNSUBSCRIBE_PUSH_NOTIFICATIONS_FAILURE] (state, err) {
    handleError(state, err)
  },

  [types.SET_WHITELIST_REQUEST] (state) {},

  [types.SET_WHITELIST_SUCCESS] (state) { },

  [types.SET_WHITELIST_FAILURE] (state, err) {
    handleError(state, err)
  },

  [types.SET_TRANSFER_FEE_SUCCESS] () {},

  [types.SET_TRANSFER_FEE_REQUEST] () {},

  [types.SET_TRANSFER_FEE_FAILURE] () {},

  [types.GET_TRANSFER_FEE_REQUEST] () {},

  [types.GET_TRANSFER_FEE_SUCCESS] (state, response) {
    state.transferFee = response['admin@notary']
  },

  [types.GET_TRANSFER_FEE_FAILURE] () {}
}

const actions = {
  setNotaryIp ({ commit }, { ip }) {
    commit(types.SET_NOTARY_IP, ip)
  },

  signup ({ commit }, { username }) {
    commit(types.SIGNUP_REQUEST)

    const { publicKey, privateKey } = irohaUtil.generateKeypair()

    return notaryUtil.signup(username, publicKey)
      .then(() => commit(types.SIGNUP_SUCCESS, { username, publicKey, privateKey }))
      .then(() => ({ username, privateKey }))
      .catch(err => {
        commit(types.SIGNUP_FAILURE, err)
        throw err
      })
  },

  addNetwork ({ commit, state }, { privateKeys }) {
    commit(types.SIGNUP_REQUEST)
    const username = state.accountId.split('@')[0]
    const privateKey = privateKeys[0]
    const publicKey = derivePublicKey(Buffer.from(privateKey, 'hex')).toString('hex')

    return notaryUtil.signup(username, [], publicKey)
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

  updateAccount ({ commit, state }) {
    commit(types.UPDATE_ACCOUNT_REQUEST)

    return irohaUtil.getAccount({
      accountId: state.accountId
    })
      .then((account) => {
        commit(types.UPDATE_ACCOUNT_SUCCESS, { account })
      })
      .catch(err => {
        commit(types.UPDATE_ACCOUNT_FAILURE, err)
        throw err
      })
  },

  getAccountAssetTransactions ({ commit, state }, { assetId }) {
    commit(types.GET_ACCOUNT_ASSET_TRANSACTIONS_REQUEST)

    return irohaUtil.getAccountAssetTransactions({
      accountId: state.accountId,
      assetId,
      pageSize: 100,
      firstTxHash: undefined
    })
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

  getAccountAssetTransactionsNextPage ({ commit, state }, { page, assetId }) {
    const loadedAmount = state.assetTransactions[assetId].loadedAmount
    const hash = state.assetTransactions[assetId].nextTxHash

    if (loadedAmount < page * 10) {
      commit(types.GET_ACCOUNT_ASSET_TRANSACTIONS_NP_REQUEST)
      return irohaUtil.getAccountAssetTransactions({
        accountId: state.accountId,
        assetId,
        pageSize: 100,
        firstTxHash: hash.length ? hash : undefined
      })
        .then(responses => {
          commit(types.GET_ACCOUNT_ASSET_TRANSACTIONS_NP_SUCCESS, {
            assetId: assetId,
            transactions: responses
          })
        })
        .catch(err => {
          commit(types.GET_ACCOUNT_ASSET_TRANSACTIONS_NP_FAILURE, err)
          throw err
        })
    }
  },

  getAccountAssets ({ commit, state }) {
    commit(types.GET_ACCOUNT_ASSETS_REQUEST)

    return irohaUtil.getAccountAssets({
      accountId: state.accountId
    })
      .then(assets => {
        commit(types.GET_ACCOUNT_ASSETS_SUCCESS, assets)
      })
      .catch(err => {
        commit(types.GET_ACCOUNT_ASSETS_FAILURE, err)
        throw err
      })
  },

  getAccountTransactions ({ commit, state }) {
    commit(types.GET_ACCOUNT_TRANSACTIONS_REQUEST)

    return irohaUtil.getAccountTransactions({
      accountId: state.accountId,
      pageSize: 100,
      firstTxHash: undefined
    })
      .then(transactions => {
        commit(types.GET_ACCOUNT_TRANSACTIONS_SUCCESS, transactions)
      })
      .catch(err => {
        commit(types.GET_ACCOUNT_TRANSACTIONS_FAILURE, err)
        throw err
      })
  },

  getAllUnsignedTransactions ({ commit }) {
    commit(types.GET_ALL_UNSIGNED_TRANSACTIONS_REQUEST)

    return irohaUtil.getRawPendingTransactions()
      .then(transactions => {
        commit(types.GET_ALL_UNSIGNED_TRANSACTIONS_SUCCESS, transactions)
      })
      .catch(err => {
        commit(types.GET_ALL_UNSIGNED_TRANSACTIONS_FAILURE, err)
        throw err
      })
  },

  getAllAssetsTransactions ({ commit, dispatch, state }) {
    commit(types.GET_ALL_ASSET_TRANSACTIONS_REQUEST)
    return new Promise(async (resolve, reject) => {
      for (let { assetId } of state.assets) {
        dispatch('getAccountAssetTransactions', { assetId })
          .catch(err => reject(err))
      }
      resolve()
    })
      .then(() => {
        commit(types.GET_ALL_ASSET_TRANSACTIONS_SUCCESS)
      })
      .catch((err) => {
        commit(types.GET_ALL_ASSET_TRANSACTIONS_FAILURE, err)
        throw err
      })
  },

  transferAsset ({ commit, state, getters }, { privateKeys, assetId, to, description = '', amount }) {
    commit(types.TRANSFER_ASSET_REQUEST)

    return irohaUtil.transferAsset(privateKeys, getters.irohaQuorum, {
      srcAccountId: state.accountId,
      destAccountId: to,
      assetId,
      description,
      amount
    })
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

    return irohaUtil.signPendingTransaction(privateKeys, state.rawUnsignedTransactions.getTransactionsList()[txStoreId])
      .then(() => {
        commit(types.SIGN_PENDING_SUCCESS)
      })
      .catch(err => {
        commit(types.SIGN_PENDING_FAILURE, err)
        throw err
      })
  },

  createSettlement (
    { commit, state, getters },
    { privateKeys, to, offerAssetId, offerAmount, requestAssetId, requestAmount, description = '' }
  ) {
    commit(types.CREATE_SETTLEMENT_REQUEST)

    return irohaUtil.createSettlement(
      privateKeys,
      state.accountId,
      getters.irohaQuorum,
      offerAssetId,
      offerAmount,
      description,
      to,
      2,
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

  rejectSettlement ({ commit, state, getters }, { privateKeys, settlementBatch }) {
    commit(types.REJECT_SETTLEMENT_REQUEST)
    const batch = findBatchFromRaw(state.rawUnsignedTransactions, settlementBatch)
    const fake = new Array(getters.accountQuorum)
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

  addSignatory ({ commit, state, getters }, privateKeys) {
    commit(types.ADD_ACCOUNT_SIGNATORY_REQUEST)

    const { privateKey } = irohaUtil.generateKeypair()
    const publicKey = derivePublicKey(Buffer.from(privateKey, 'hex')).toString('hex')
    return irohaUtil.addSignatory(privateKeys, getters.irohaQuorum, {
      accountId: state.accountId,
      publicKey
    })
      .then(() => commit(types.ADD_ACCOUNT_SIGNATORY_SUCCESS))
      .then(() => ({ username: state.accountId, privateKey }))
      .catch(err => {
        commit(types.ADD_ACCOUNT_SIGNATORY_FAILURE, err)
        throw err
      })
  },

  removeSignatory ({ commit, state, getters }, { privateKeys, publicKey }) {
    commit(types.REMOVE_ACCOUNT_SIGNATORY_REQUEST)
    return irohaUtil.removeSignatory(privateKeys, getters.irohaQuorum, {
      accountId: state.accountId,
      publicKey
    })
      .then(() => commit(types.REMOVE_ACCOUNT_SIGNATORY_SUCCESS))
      .catch(err => {
        commit(types.REMOVE_ACCOUNT_SIGNATORY_FAILURE, err)
        throw err
      })
  },

  getSignatories ({ commit, state }) {
    commit(types.GET_ACCOUNT_SIGNATORIES_REQUEST)
    return irohaUtil.getSignatories({
      accountId: state.accountId
    })
      .then((keys) => commit(types.GET_ACCOUNT_SIGNATORIES_SUCCESS, keys))
      .catch(err => {
        commit(types.GET_ACCOUNT_SIGNATORIES_FAILURE, err)
        throw err
      })
  },

  editAccountQuorum ({ commit, state, getters }, { privateKeys, quorum }) {
    commit(types.EDIT_ACCOUNT_QUORUM_REQUEST)
    return irohaUtil.setAccountQuorum(privateKeys, getters.irohaQuorum, {
      accountId: state.accountId,
      quorum
    })
      .then(() => commit(types.EDIT_ACCOUNT_QUORUM_SUCCESS))
      .catch(err => {
        commit(types.EDIT_ACCOUNT_QUORUM_FAILURE, err)
        throw err
      })
  },

  getAccountQuorum ({ commit, state }) {
    commit(types.GET_ACCOUNT_QUORUM_REQUEST)
    return irohaUtil.getAccount({
      accountId: state.accountId
    })
      .then((account) => {
        commit(types.GET_ACCOUNT_QUORUM_SUCCESS, account)
      })
      .catch(err => {
        commit(types.GET_ACCOUNT_QUORUM_FAILURE, err)
        throw err
      })
  },

  getAccountLimits ({ commit, state }) {
    commit(types.GET_ACCOUNT_LIMITS_REQUEST)
    return irohaUtil.getAccount({
      accountId: state.accountId
    })
      .then((account) => {
        commit(types.GET_ACCOUNT_LIMITS_SUCCESS, account.jsonData)
      })
      .catch(err => {
        commit(types.GET_ACCOUNT_LIMITS_FAILURE, err)
        throw err
      })
  },

  getAccountRoles ({ commit, state }) {
    commit(types.GET_ACCOUNT_ROLES_REQUEST)
    return irohaUtil.getRawAccount({
      accountId: state.accountId
    })
      .then((response) => {
        commit(types.GET_ACCOUNT_ROLES_SUCCESS, response)
      })
      .catch(err => {
        commit(types.GET_ACCOUNT_ROLES_FAILURE, err)
        throw err
      })
  },

  subscribePushNotifications ({ commit, state, dispatch, getters }, { privateKeys, settings }) {
    commit(types.SUBSCRIBE_PUSH_NOTIFICATIONS_REQUEST)
    return irohaUtil.setAccountDetail(privateKeys, getters.irohaQuorum, {
      accountId: state.accountId,
      key: `push_subscription`,
      // eslint-disable-next-line
      value: JSON.stringify(settings).replace(/"/g, '\\\"')
    })
      .then(() => {
        commit(types.SUBSCRIBE_PUSH_NOTIFICATIONS_SUCCESS)
        dispatch('updateAccount')
      })
      .catch(err => {
        commit(types.SUBSCRIBE_PUSH_NOTIFICATIONS_FAILURE)
        throw err
      })
  },

  unsubscribePushNotifications ({ commit, state, dispatch, getters }, { privateKeys }) {
    commit(types.UNSUBSCRIBE_PUSH_NOTIFICATIONS_REQUEST)

    return irohaUtil.setAccountDetail(privateKeys, getters.irohaQuorum, {
      accountId: state.accountId,
      key: `push_subscription`,
      value: ''
    })
      .then(() => {
        commit(types.UNSUBSCRIBE_PUSH_NOTIFICATIONS_SUCCESS)
        dispatch('updateAccount')
      })
      .catch(err => {
        commit(types.UNSUBSCRIBE_PUSH_NOTIFICATIONS_FAILURE)
        throw err
      })
  },

  setWhiteList ({ commit, state, dispatch, getters }, { privateKeys, whitelist, type }) {
    const key = type === WalletTypes.ETH ? 'eth_whitelist' : 'btc_whitelist'

    commit(types.SET_WHITELIST_REQUEST)
    return irohaUtil.setAccountDetail(privateKeys, getters.irohaQuorum, {
      accountId: state.accountId,
      key,
      // eslint-disable-next-line
      value: JSON.stringify(whitelist).replace(/"/g, '\\\"')
    })
      .then(() => {
        dispatch('updateAccount')

        commit(types.SET_WHITELIST_SUCCESS)
      })
      .catch(err => {
        commit(types.SET_WHITELIST_FAILURE)
        throw err
      })
  },

  setTransferFee ({commit, state, dispatch, getters}, {privateKeys, asset, fee}) {
    commit(types.SET_TRANSFER_FEE_REQUEST)
    console.log(asset, fee, state.accountId, privateKeys, getters.irohaQuorum)
    return irohaUtil.setAccountDetail(privateKeys, getters.irohaQuorum, {
      accountId: 'transfer_billing@d3',
      key: asset.toLowerCase(),
      // eslint-disable-next-line
      value: fee
    })
      .then(() => {
        dispatch('updateAccount')

        commit(types.SET_TRANSFER_FEE_SUCCESS)
      })
      .catch(err => {
        commit(types.SET_TRANSFER_FEE_FAILURE)
        throw err
      })
  },

  getTransferFee ({commit, state, dispatch, getters}) {
    commit(types.GET_TRANSFER_FEE_REQUEST)

    return irohaUtil.getAccountDetail({
      accountId: 'transfer_billing@d3'
    })
      .then((result) => {
        dispatch('updateAccount')

        commit(types.GET_TRANSFER_FEE_SUCCESS, result)
      })
      .catch(err => {
        commit(types.GET_TRANSFER_FEE_FAILURE)
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
