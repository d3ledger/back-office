const types = {
  APPROVAL_DIALOG_OPEN: 'APPROVAL_DIALOG_OPEN',
  APPROVAL_DIALOG_CLOSE: 'APPROVAL_DIALOG_CLOSE'
}

function initialState () {
  return {
    approvalDialogVisible: false,
    resolvePrompting: null,
    rejectPrompting: null
  }
}

const state = initialState()

const mutations = {
  [types.APPROVAL_DIALOG_OPEN] (state, { resolvePrompting, rejectPrompting }) {
    state.approvalDialogVisible = true
    state.resolvePrompting = resolvePrompting
    state.rejectPrompting = rejectPrompting
  },
  [types.APPROVAL_DIALOG_CLOSE] (state, privateKey) {
    state.approvalDialogVisible = false
    state.resolvePrompting(privateKey)
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
  }
}

const getters = {}

export default {
  types,
  state,
  getters,
  mutations,
  actions
}
