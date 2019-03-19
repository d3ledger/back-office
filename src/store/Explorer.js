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
  'SEARCH_TRANSACTIONS'
])

function initialState () {
  return {
    searchedTransactions: [],
    filteredTransactions: [],
    filterIsActive: false
  }
}

const state = initialState()

const getters = {
  searchedTransactions (state) {
    return state.searchedTransactions
  },
  filteredTransactions (state) {
    return state.filteredTransactions
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
  [types.SEARCH_TRANSACTIONS_REQUEST] (state, result) {
    state.searchedTransactions = result.transactions
  },

  [types.SEARCH_TRANSACTIONS_SUCCESS] (state) {},

  [types.SEARCH_TRANSACTIONS_FAILURE] (state, err) {
    handleError(state, err)
  }
}

const actions = {
  getAccountAssetTransactions ({ commit, state }, { transactionIds }) {
    commit(types.SEARCH_TRANSACTIONS_REQUEST)

    return irohaUtil.getTransactions({
      transactionIds
    })
      .then(responses => {
        commit(types.SEARCH_TRANSACTIONS_SUCCESS, {
          transactions: responses
        })
      })
      .catch(err => {
        commit(types.SEARCH_TRANSACTIONS_FAILURE, err)
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
