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
    'RESET'
  ]),
  map(x => [x, x]),
  fromPairs
)([
  'GET_CRYPTO_FULL_DATA'
])

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

  [types.GET_CRYPTO_FULL_DATA_SUCCESS] (state, { historicalDataFiat, historicalDataCrypto, priceData, currencies }) {
    // process priceData
    const RAW = Object.values(priceData.RAW)[0]
    const compareToRUB = RAW[currencies.fiat]
    const compareToCrypto = RAW[currencies.crypto]

    const priceFiat = compareToRUB.PRICE
    const priceCrypto = compareToCrypto.PRICE
    const marketcapFiat = compareToRUB.MKTCAP
    const marketcapCrypto = compareToRUB.SUPPLY
    // TODO: show the total volume over the specified range
    const volumeFiat = compareToRUB.TOTALVOLUME24HTO
    const volumeCrypto = compareToRUB.TOTALVOLUME24H
    const circulatingSupply = compareToRUB.SUPPLY

    // process historicalDataFiat
    const getInfo = ({ Data }) => {
      const closeOfTheFirstSpan = Data.filter(x => x.close !== 0)[0].close
      const closeOfTheLastSpan = Data[Data.length - 1].close
      const change = closeOfTheLastSpan - closeOfTheFirstSpan
      const changePct = (change / closeOfTheFirstSpan) * 100

      return [change, changePct]
    }
    const [changeFiat] = getInfo(historicalDataFiat)
    const [, changePctCrypto] = getInfo(historicalDataCrypto)

    Vue.set(state, 'cryptoInfo', {
      current: {
        rur: priceFiat,
        rur_change: changeFiat,
        crypto: priceCrypto,
        crypto_change: changePctCrypto
      },
      market: {
        cap: {
          rur: marketcapFiat,
          crypto: marketcapCrypto
        },
        volume: {
          rur: volumeFiat,
          crypto: volumeCrypto
        },
        supply: circulatingSupply
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
  getCryptoFullData ({ commit, getters }, { filter, asset }) {
    commit(types.GET_CRYPTO_FULL_DATA_REQUEST)

    const currencies = getters.settingsView

    return Promise.all([
      cryptoCompareUtil.loadPriceByFilter({ filter, crypto: asset, to: currencies.fiat }, currencies),
      cryptoCompareUtil.loadPriceByFilter({ filter, crypto: asset, to: currencies.crypto }, currencies),
      cryptoCompareUtil.loadFullData(asset, currencies)
    ])
      .then(([historicalDataFiat, historicalDataCrypto, priceData]) => {
        commit(types.GET_CRYPTO_FULL_DATA_SUCCESS, { historicalDataFiat, historicalDataCrypto, priceData, currencies })
      })
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
