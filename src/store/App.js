import Vue from 'vue'

const types = {
  APPROVAL_DIALOG_OPEN: 'APPROVAL_DIALOG_OPEN',
  APPROVAL_DIALOG_CLOSE: 'APPROVAL_DIALOG_CLOSE',
  EXCHANGE_DIALOG_OPEN: 'EXCHANGE_DIALOG_OPEN',
  EXCHANGE_DIALOG_CLOSE: 'EXCHANGE_DIALOG_CLOSE',
  SET_EXCHANGE_DIALOG_OFFER_ASSET: 'SET_EXCHANGE_DIALOG_OFFER_ASSET'
}

function initialState () {
  return {
    approvalDialog: {
      isVisible: false,
      resolvePrompting: null,
      rejectPrompting: null
    },
    exchangeDialog: {
      isVisible: false,
      offerAsset: null
    }
  }
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
      offerAsset: null
    })
  },
  [types.SET_EXCHANGE_DIALOG_OFFER_ASSET] (state, offerAsset) {
    Vue.set(state.exchangeDialog, 'offerAsset', offerAsset)
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
  }
}

export default {
  types,
  state,
  getters,
  mutations,
  actions
}
