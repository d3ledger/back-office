import Vue from 'vue'
import _ from 'lodash'
import cryptoCompareUtil from 'util/cryptoApi-axios-util'

const types = _([
  'GET_CRYPTO_FULL_DATA'
]).chain()
  .flatMap(x => [x + '_REQUEST', x + '_SUCCESS', x + '_FAILURE'])
  .concat([
    'RESET'
  ])
  .map(x => [x, x])
  .fromPairs()
  .value()

function initialState () {
  return {
    cryptoInfo: {
      current: {
        rur: 0,
        rur_change: 0,
        crypto: 0,
        crypto_change: 0
      },
      market: {
        cap: {
          rur: 0,
          crypto: 0
        },
        volume: {
          rur: 0,
          crypto: 0
        },
        supply: 0
      },
      isLoading: false
    },
    connectionError: null
  }
}

const state = initialState()

const getters = {
  cryptoInfo (state) {
    return state.cryptoInfo
  }
}

/**
 * Store a connection error so the top component can handle it.
 * @param {Object} state
 * @param {Error} err
 */
function handleError (state, err) {
  state.connectionError = err
}

const mutations = {
  [types.RESET] (state) {
    const s = initialState()
    Object.keys(s).forEach(key => {
      state[key] = s[key]
    })
  },

  [types.GET_CRYPTO_FULL_DATA_REQUEST] (state) {
    Vue.set(state.cryptoInfo, 'isLoading', true)
  },

  [types.GET_CRYPTO_FULL_DATA_SUCCESS] (state, { RAW }) {
    const compareToRUB = Object.values(RAW)[0].RUB
    const compareToCrypto = Object.values(RAW)[0].BTC
    Vue.set(state, 'cryptoInfo', {
      current: {
        rur: compareToRUB.PRICE,
        rur_change: compareToRUB.CHANGEDAY,
        crypto: compareToCrypto.PRICE,
        crypto_change: compareToCrypto.CHANGEPCTDAY
      },
      market: {
        cap: {
          rur: compareToRUB.MKTCAP,
          crypto: compareToRUB.SUPPLY
        },
        volume: {
          rur: compareToRUB.TOTALVOLUME24HTO,
          crypto: compareToRUB.TOTALVOLUME24H
        },
        supply: compareToRUB.SUPPLY
      },
      isLoading: false
    })
  },

  [types.GET_CRYPTO_FULL_DATA_FAILURE] (state, err) {
    Vue.set(state.cryptoInfo, 'isLoading', false)
    handleError(state, err)
  }
}

const actions = {
  getCryptoFullData ({ commit }, { asset }) {
    commit(types.GET_CRYPTO_FULL_DATA_REQUEST)
    cryptoCompareUtil.loadFullData(asset)
      .then(data => commit(types.GET_CRYPTO_FULL_DATA_SUCCESS, data))
      .catch(err => {
        commit(types.GET_CRYPTO_FULL_DATA_FAILURE, err)
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
