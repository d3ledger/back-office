import Vue from 'vue'
import map from 'lodash/fp/map'
import flatMap from 'lodash/fp/flatMap'
import concat from 'lodash/fp/concat'
import fromPairs from 'lodash/fp/fromPairs'
import flow from 'lodash/fp/flow'
import cryptoCompareUtil from '@util/cryptoApi-axios-util'

const types = flow(
  flatMap(x => [x + '_REQUEST', x + '_SUCCESS', x + '_FAILURE']),
  concat([
    'APPROVAL_DIALOG_OPEN',
    'APPROVAL_DIALOG_CLOSE',
    'EXCHANGE_DIALOG_OPEN',
    'EXCHANGE_DIALOG_CLOSE',
    'SET_EXCHANGE_DIALOG_OFFER_ASSET',
    'SET_EXCHANGE_DIALOG_REQUEST_ASSET'
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
    connectionError: null
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
  [types.APPROVAL_DIALOG_CLOSE] (state, privateKey) {
    Vue.set(state.approvalDialog, 'isVisible', false)
    state.approvalDialog.resolvePrompting(privateKey)
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
  closeApprovalDialog ({ commit }, privateKey) {
    commit(types.APPROVAL_DIALOG_CLOSE, privateKey)
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
  }
}

export default {
  types,
  state,
  getters,
  mutations,
  actions
}
