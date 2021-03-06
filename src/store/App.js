/*
 * Copyright D3 Ledger, Inc. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import Vue from 'vue'
import map from 'lodash/fp/map'
import flatMap from 'lodash/fp/flatMap'
import concat from 'lodash/fp/concat'
import fromPairs from 'lodash/fp/fromPairs'
import flow from 'lodash/fp/flow'
import cryptoCompareUtil from '@util/crypto-util'
import { getParsedItem, setStringifyItem } from '@util/storage-util'
import notaryUtil from '@util/notary-util'
import configUtil from '@util/config-util'

const types = flow(
  flatMap(x => [x + '_REQUEST', x + '_SUCCESS', x + '_FAILURE']),
  concat([
    'APPROVAL_DIALOG_OPEN',
    'APPROVAL_DIALOG_CLOSE',
    'EXCHANGE_DIALOG_OPEN',
    'EXCHANGE_DIALOG_CLOSE',
    'SET_EXCHANGE_DIALOG_OFFER_ASSET',
    'SET_EXCHANGE_DIALOG_REQUEST_ASSET',
    'LOAD_WALLETS_SORT_CRITERION',
    'UPDATE_WALLETS_SORT_CRITERION',
    'LOAD_DASHBOARD_SORT_CRITERION',
    'UPDATE_DASHBOARD_SORT_CRITERION'
  ]),
  map(x => [x, x]),
  fromPairs
)([
  'GET_OFFER_TO_REQUEST_PRICE',
  'GET_FREE_ETH_RELAYS',
  'GET_FREE_BTC_RELAYS',

  'LOAD_CONFIGURATION_FILE'
])

function initialState () {
  return {
    approvalDialog: {
      isVisible: false,
      signatures: [],
      resolvePrompting: null,
      rejectPrompting: null,
      requiredMinAmount: 1
    },
    exchangeDialog: {
      isVisible: false,
      offerAsset: null,
      requestAsset: null,
      price: null
    },
    connectionError: null,
    walletsSortCriterion: null,
    dashboardSortCriterion: null,
    freeEthRelaysNumber: 0,
    freeBtcRelaysNumber: 0,
    nodeIPs: [],
    registrationIPs: [],
    btcRegistrationIp: null,
    ethRegistrationIp: null,
    services: null
  }
}

function handleError (state, err) {
  state.connectionError = err
}

const state = initialState()

const mutations = {
  [types.APPROVAL_DIALOG_OPEN] (state, { resolvePrompting, rejectPrompting, signatures, requiredMinAmount }) {
    Vue.set(state, 'approvalDialog', {
      isVisible: true,
      resolvePrompting,
      rejectPrompting,
      signatures,
      requiredMinAmount
    })
  },
  [types.APPROVAL_DIALOG_CLOSE] (state, privateKeys) {
    Vue.set(state.approvalDialog, 'isVisible', false)
    Vue.set(state.approvalDialog, 'signatures', [])
    state.approvalDialog.resolvePrompting(privateKeys)
  },
  [types.EXCHANGE_DIALOG_OPEN] (state, asset) {
    const offerAsset = asset || null
    Vue.set(state, 'exchangeDialog', {
      isVisible: true,
      offerAsset
    })
  },
  [types.EXCHANGE_DIALOG_CLOSE] (state) {
    Vue.set(state, 'exchangeDialog', {
      isVisible: false,
      offerAsset: null,
      requestAsset: null,
      price: null
    })
  },
  [types.SET_EXCHANGE_DIALOG_OFFER_ASSET] (state, offerAsset) {
    Vue.set(state.exchangeDialog, 'offerAsset', offerAsset)
  },
  [types.SET_EXCHANGE_DIALOG_REQUEST_ASSET] (state, requestAsset) {
    Vue.set(state.exchangeDialog, 'requestAsset', requestAsset)
  },
  [types.GET_OFFER_TO_REQUEST_PRICE_REQUEST] (state) {},

  [types.GET_OFFER_TO_REQUEST_PRICE_SUCCESS] (state, price) {
    Vue.set(state.exchangeDialog, 'price', price)
  },
  [types.GET_OFFER_TO_REQUEST_PRICE_FAILURE] (state, err) {
    handleError(state, err)
  },
  [types.LOAD_WALLETS_SORT_CRITERION] (state, criterion) {
    state.walletsSortCriterion = criterion
  },
  [types.UPDATE_WALLETS_SORT_CRITERION] (state, criterion) {
    state.walletsSortCriterion = criterion
  },
  [types.LOAD_DASHBOARD_SORT_CRITERION] (state, criterion) {
    state.dashboardSortCriterion = criterion
  },
  [types.UPDATE_DASHBOARD_SORT_CRITERION] (state, criterion) {
    state.dashboardSortCriterion = criterion
  },

  [types.GET_FREE_ETH_RELAYS_REQUEST] (state) {},

  [types.GET_FREE_ETH_RELAYS_SUCCESS] (state, relays) {
    state.freeEthRelaysNumber = relays
  },

  [types.GET_FREE_ETH_RELAYS_FAILURE] (state, err) {
    handleError(state, err)
  },

  [types.GET_FREE_BTC_RELAYS_REQUEST] (state) {},

  [types.GET_FREE_BTC_RELAYS_SUCCESS] (state, relays) {
    state.freeBtcRelaysNumber = relays
  },

  [types.GET_FREE_BTC_RELAYS_FAILURE] (state, err) {
    handleError(state, err)
  },

  [types.LOAD_CONFIGURATION_FILE_REQUEST] (state) {},
  [types.LOAD_CONFIGURATION_FILE_SUCCESS] (state, config) {
    state.nodeIPs = config.nodes
    state.registrationIPs = config.registrations

    state.btcRegistrationIp = config.relays.BTC.value
    state.ethRegistrationIp = config.relays.ETH.value

    state.services = config.services
  },
  [types.LOAD_CONFIGURATION_FILE_FAILURE] (state, err) {
    handleError(state, err)
  }
}

const actions = {
  /*
   * openApprovalDialog returns a Promise and closeApprovalDialog resolves it.
   * This allows the caller to simply chain postprocesses like this:
   * ```
   *  openApprovalDialog().then(input => ...)
   * ```
   *
   * It does a hacky way of exporting resolve/reject outside Promise in order to
   * resolve the Promise at closeApprovalDialog.
   * c.f. https://stackoverflow.com/questions/26150232/resolve-javascript-promise-outside-function-scope
   */
  openApprovalDialog ({ commit }, { signatures = [], requiredMinAmount = 1 } = {}) {
    let resolvePrompting, rejectPrompting
    const prompting = new Promise((resolve, reject) => {
      resolvePrompting = resolve
      rejectPrompting = reject
    })

    commit(types.APPROVAL_DIALOG_OPEN, {
      resolvePrompting,
      rejectPrompting,
      signatures,
      requiredMinAmount
    })

    return prompting
  },
  closeApprovalDialog ({ commit }, privateKeys) {
    commit(types.APPROVAL_DIALOG_CLOSE, privateKeys)
  },
  openExchangeDialog ({ commit }, offerAsset) {
    commit(types.EXCHANGE_DIALOG_OPEN, offerAsset)
  },
  closeExchangeDialog ({ commit }) {
    commit(types.EXCHANGE_DIALOG_CLOSE)
  },
  getOfferToRequestPrice ({ commit, getters }) {
    const offerAsset = getters.exchangeDialogOfferAsset
    const requestAsset = getters.exchangeDialogRequestAsset
    if (offerAsset && requestAsset) {
      cryptoCompareUtil.loadPriceForAssets({
        from: offerAsset,
        to: requestAsset
      })
        .then(data => commit(types.GET_OFFER_TO_REQUEST_PRICE_SUCCESS, data[requestAsset]))
        .catch(err => {
          commit(types.GET_OFFER_TO_REQUEST_PRICE_FAILURE, err)
          throw err
        })
    }
  },
  loadWalletsSortCriterion ({ commit }) {
    const criterion = getParsedItem('walletsSortCriterion')

    if (criterion) {
      commit(types.LOAD_WALLETS_SORT_CRITERION, criterion)
    }
  },
  updateWalletsSortCriterion ({ commit }, criterion) {
    setStringifyItem('walletsSortCriterion', criterion)
    commit(types.UPDATE_WALLETS_SORT_CRITERION, criterion)
  },
  loadDashboardSortCriterion ({ commit }) {
    const criterion = getParsedItem('dashboardSortCriterion')

    if (criterion) {
      commit(types.LOAD_DASHBOARD_SORT_CRITERION, criterion)
    }
  },
  updateDashboardSortCriterion ({ commit }, criterion) {
    setStringifyItem('dashboardSortCriterion', criterion)
    commit(types.UPDATE_DASHBOARD_SORT_CRITERION, criterion)
  },

  getFreeEthRelaysNumber ({ commit, state }) {
    commit(types.GET_FREE_ETH_RELAYS_REQUEST)

    return notaryUtil.getFreeRelaysNumber(state.ethRegistrationIp)
      .then(relays => {
        commit(types.GET_FREE_ETH_RELAYS_SUCCESS, relays)
      })
      .catch(err => {
        commit(types.GET_FREE_ETH_RELAYS_FAILURE, err)
        throw err
      })
  },

  getFreeBtcRelaysNumber ({ commit, state }) {
    commit(types.GET_FREE_BTC_RELAYS_REQUEST)

    return notaryUtil.getFreeRelaysNumber(state.btcRegistrationIp)
      .then(relays => {
        commit(types.GET_FREE_BTC_RELAYS_SUCCESS, relays)
      })
      .catch(err => {
        commit(types.GET_FREE_BTC_RELAYS_FAILURE, err)
        throw err
      })
  },

  loadConfiguration ({ commit }) {
    commit(types.LOAD_CONFIGURATION_FILE_REQUEST)

    return configUtil.getConfiguration()
      .then(config => commit(types.LOAD_CONFIGURATION_FILE_SUCCESS, config))
      .catch(err => {
        commit(types.LOAD_CONFIGURATION_FILE_FAILURE)
        throw err
      })
  }
}

const getters = {
  approvalDialogVisible () {
    return state.approvalDialog.isVisible
  },
  approvalDialogSignatures () {
    return state.approvalDialog.signatures
  },
  approvalDialogMinAmountKeys () {
    return state.approvalDialog.requiredMinAmount
  },
  exchangeDialogVisible () {
    return state.exchangeDialog.isVisible
  },
  exchangeDialogOfferAsset () {
    return state.exchangeDialog.offerAsset
  },
  exchangeDialogRequestAsset () {
    return state.exchangeDialog.requestAsset
  },
  exchangeDialogPrice () {
    return state.exchangeDialog.price
  },
  walletsSortCriterion (state) {
    return state.walletsSortCriterion
  },
  dashboardSortCriterion (state) {
    return state.dashboardSortCriterion
  },
  freeEthRelaysNumber (state) {
    return state.freeEthRelaysNumber
  },
  freeBtcRelaysNumber (state) {
    return state.freeBtcRelaysNumber
  },
  nodeIPs (state) {
    return state.nodeIPs
  },
  registrationIPs (state) {
    return state.registrationIPs
  },
  btcRegistrationIp (state) {
    return state.btcRegistrationIp
  },
  ethRegistrationIp (state) {
    return state.ethRegistrationIp
  },
  servicesIPs (state) {
    return state.services
  }
}

export default {
  types,
  state,
  getters,
  mutations,
  actions
}
