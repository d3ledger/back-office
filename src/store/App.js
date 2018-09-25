import Vue from 'vue'
import map from 'lodash/fp/map'
import flatMap from 'lodash/fp/flatMap'
import concat from 'lodash/fp/concat'
import fromPairs from 'lodash/fp/fromPairs'
import flow from 'lodash/fp/flow'
import cryptoCompareUtil from '@util/cryptoApi-axios-util'
import { getParsedItem, setStringifyItem } from '@util/storage-util'

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
  'GET_OFFER_TO_REQUEST_PRICE'
])

function initialState () {
  return {
    approvalDialog: {
      isVisible: false,
      resolvePrompting: null,
      rejectPrompting: null
    },
    exchangeDialog: {
      isVisible: false,
      offerAsset: null,
      requestAsset: null,
      price: null
    },
    connectionError: null,
    walletsSortCriterion: null,
    dashboardSortCriterion: null
  }
}

function handleError (state, err) {
  state.connectionError = err
}

const state = initialState()

const mutations = {
  [types.APPROVAL_DIALOG_OPEN] (state, { resolvePrompting, rejectPrompting }) {
    Vue.set(state, 'approvalDialog', {
      isVisible: true,
      resolvePrompting,
      rejectPrompting
    })
  },
  [types.APPROVAL_DIALOG_CLOSE] (state, privateKeys) {
    Vue.set(state.approvalDialog, 'isVisible', false)
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
  openApprovalDialog ({ commit }) {
    let resolvePrompting, rejectPrompting
    const prompting = new Promise((resolve, reject) => {
      resolvePrompting = resolve
      rejectPrompting = reject
    })

    commit(types.APPROVAL_DIALOG_OPEN, { resolvePrompting, rejectPrompting })

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
  }
}

const getters = {
  approvalDialogVisible () {
    return state.approvalDialog.isVisible
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
  }
}

export default {
  types,
  state,
  getters,
  mutations,
  actions
}
