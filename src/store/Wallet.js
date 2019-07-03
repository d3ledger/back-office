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
import collectorUtil from '@util/collector-util'

const types = flow(
  flatMap(x => [x + '_REQUEST', x + '_SUCCESS', x + '_FAILURE']),
  concat([
    'RESET'
  ]),
  map(x => [x, x]),
  fromPairs
)([
  'GET_CRYPTO_FULL_DATA',
  'GET_ASSET_PRECISION'
])

function initialState () {
  return {
    cryptoInfo: {
      current: {
        fiat: 0,
        fiat_change: 0,
        crypto: 0,
        crypto_change: 0
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
    currentWallet: {
      precision: 0
    },
    connectionError: null
  }
}

const state = initialState()

const getters = {
  cryptoInfo (state) {
    return state.cryptoInfo
  },
  currentWalletPrecision (state) {
    return state.currentWallet.precision
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
      currencies
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
        crypto_change: changePctCrypto
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
  },

  [types.GET_ASSET_PRECISION_REQUEST] (state, assetId) {},
  [types.GET_ASSET_PRECISION_SUCCESS] (state, { itIs }) {
    Vue.set(state.currentWallet, 'precision', itIs)
  },
  [types.GET_ASSET_PRECISION_FAILURE] (state) {}
}

const actions = {
  getCryptoFullData ({ commit, getters }, { filter, asset }) {
    commit(types.GET_CRYPTO_FULL_DATA_REQUEST)

    const currencies = getters.settingsView

    return Promise.all([
      cryptoCompareUtil.loadPriceByFilter({ filter, crypto: asset, to: currencies.fiat }, currencies),
      cryptoCompareUtil.loadPriceByFilter({ filter, crypto: asset, to: currencies.crypto }, currencies),
      cryptoCompareUtil.loadVolumeByFilter({ filter, crypto: asset, to: currencies.fiat }),
      cryptoCompareUtil.loadFullData(asset, currencies)
    ])
      .then(([historicalDataFiat, historicalDataCrypto, volumeData, priceData]) => {
        commit(types.GET_CRYPTO_FULL_DATA_SUCCESS, {
          historicalDataFiat,
          historicalDataCrypto,
          volumeData,
          priceData,
          currencies
        })
      })
      .catch(err => {
        commit(types.GET_CRYPTO_FULL_DATA_FAILURE, err)
        throw err
      })
  },

  getAssetPrecision ({ commit, getters }, assetId) {
    commit(types.GET_ASSET_PRECISION_REQUEST, assetId)
    const dataCollectorUrl = getters.servicesIPs['data-collector-service']
    return collectorUtil.getAssetPrecision(
      dataCollectorUrl.value,
      assetId
    )
      .then(res => commit(types.GET_ASSET_PRECISION_SUCCESS, res))
      .catch(err => {
        commit(types.GET_ASSET_PRECISION_FAILURE, err)
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
