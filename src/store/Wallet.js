import Vue from 'vue'
import map from 'lodash/fp/map'
import flatMap from 'lodash/fp/flatMap'
import concat from 'lodash/fp/concat'
import fromPairs from 'lodash/fp/fromPairs'
import flow from 'lodash/fp/flow'
import cryptoCompareUtil from '@util/cryptoApi-axios-util'
import feeUtil from '@util/fee-util'

const types = flow(
  flatMap(x => [x + '_REQUEST', x + '_SUCCESS', x + '_FAILURE']),
  concat([
    'RESET'
  ]),
  map(x => [x, x]),
  fromPairs
)([
  'GET_CRYPTO_FULL_DATA',
  'GET_BILLING_DATA'
])

function initialState () {
  return {
    cryptoInfo: {
      current: {
        fiat: 0,
        fiat_change: 0,
        crypto: 0,
        crypto_change: 0,
        fee: 0
      },
      market: {
        cap: {
          fiat: 0,
          crypto: 0
        },
        volume: {
          fiat: 0,
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

  [types.GET_CRYPTO_FULL_DATA_SUCCESS] (
    state,
    {
      historicalDataFiat,
      historicalDataCrypto,
      volumeData,
      priceData,
      currencies,
      billingData,
      asset
    }
  ) {
    // process priceData
    const RAW = Object.values(priceData.RAW)[0]
    const compareToFiat = RAW[currencies.fiat]
    const compareToCrypto = RAW[currencies.crypto]

    const priceFiat = compareToFiat.PRICE
    const priceCrypto = compareToCrypto.PRICE
    const marketcapFiat = compareToFiat.MKTCAP
    const marketcapCrypto = compareToFiat.SUPPLY
    const circulatingSupply = compareToFiat.SUPPLY

    // process historicalData
    const getChangeInfo = ({ Data }) => {
      const closeOfTheFirstSpan = Data.filter(x => Number.isFinite(x.close) && x.close > 0)[0].close
      const closeOfTheLastSpan = Data[Data.length - 1].close
      const change = closeOfTheLastSpan - closeOfTheFirstSpan
      const changePct = (change / closeOfTheFirstSpan) * 100

      return [change, changePct]
    }
    const [changeFiat] = getChangeInfo(historicalDataFiat)
    const [, changePctCrypto] = getChangeInfo(historicalDataCrypto)

    // process volumeData
    const volumeCrypto = volumeData.Data
      .filter(({ volume }) => Number.isFinite(volume) && volume < Number.MAX_SAFE_INTEGER)
      .reduce((sum, { volume }) => sum + volume, 0)
    const volumeFiat = priceFiat * volumeCrypto

    Vue.set(state, 'cryptoInfo', {
      current: {
        fiat: priceFiat,
        fiat_change: changeFiat,
        crypto: priceCrypto,
        crypto_change: changePctCrypto,
        fee: {
          transfer: billingData && billingData.transfer.d3[asset] ? billingData.transfer.d3[asset].feeFraction : 0,
          withdrawal: billingData && billingData.withdrawal.d3[asset] ? billingData.withdrawal.d3[asset].feeFraction : 0,
          exchange: billingData && billingData.exchange.d3[asset] ? billingData.exchange.d3[asset].feeFraction : 0
        }
      },
      market: {
        cap: {
          fiat: marketcapFiat,
          crypto: marketcapCrypto
        },
        volume: {
          fiat: volumeFiat,
          crypto: volumeCrypto
        },
        supply: circulatingSupply
      },
      isLoading: false
    })
  },

  [types.GET_CRYPTO_FULL_DATA_FAILURE] (state, err) {
    Vue.set(state, 'cryptoInfo', initialState().cryptoInfo)
    handleError(state, err)
  }
}

const actions = {
  getCryptoFullData ({ commit, getters }, { filter, asset, billingId }) {
    commit(types.GET_CRYPTO_FULL_DATA_REQUEST)

    const currencies = getters.settingsView
    const dataCollectorUrl = getters.servicesIPs['data-collector-service']

    return Promise.all([
      cryptoCompareUtil.loadPriceByFilter({ filter, crypto: asset, to: currencies.fiat }, currencies),
      cryptoCompareUtil.loadPriceByFilter({ filter, crypto: asset, to: currencies.crypto }, currencies),
      cryptoCompareUtil.loadVolumeByFilter({ filter, crypto: asset, to: currencies.fiat }),
      cryptoCompareUtil.loadFullData(asset, currencies),
      feeUtil.getFullBillingData(dataCollectorUrl)
    ])
      .then(([historicalDataFiat, historicalDataCrypto, volumeData, priceData, billingData]) => {
        commit(types.GET_CRYPTO_FULL_DATA_SUCCESS, {
          historicalDataFiat,
          historicalDataCrypto,
          volumeData,
          priceData,
          currencies,
          billingData,
          asset
        })
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
