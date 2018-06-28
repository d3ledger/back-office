const types = {
  APPROVAL_DIALOG_OPEN: 'APPROVAL_DIALOG_OPEN',
  APPROVAL_DIALOG_CLOSE: 'APPROVAL_DIALOG_CLOSE'
}

function initialState () {
  return {
    approvalDialogVisible: false
  }
}

const state = initialState()

const mutations = {
  [types.APPROVAL_DIALOG_OPEN] (state) {
    state.approvalDialogVisible = true
  },
  [types.APPROVAL_DIALOG_CLOSE] (state) {
    state.approvalDialogVisible = false
  }
}

const actions = {
  openApprovalDialog ({ commit }) {
    commit(types.APPROVAL_DIALOG_OPEN)
  },
  closeApprovalDialog ({ commit }) {
    commit(types.APPROVAL_DIALOG_CLOSE)
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
