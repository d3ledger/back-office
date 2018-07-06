import _ from 'lodash'
import axios from '@util/cryptoApi-axios-util'

const types = _([
  'GET_MULTIPLE_PRICE',
  'GET_PRICE_BY_FILTER'
]).chain()
  .flatMap(x => [x + '_REQUEST', x + '_SUCCESS', x + '_FAILURE'])
  .concat([
    'RESET',
    'PORTFOLIO_FULL_PRICE',
    'PORTFOLIO_CRYPTO_PRICE',
    'SELECT_CHART_FILTER',
    'SELECT_CHART_CRYPTO'
  ])
  .map(x => [x, x])
  .fromPairs()
  .value()

function initialState () {
  return {
    currentPriceList: [],
    portfolioPrice: 0,
    portfolioPercent: [],
    portfolioChart: {
      filter: 'ALL',
      crypto: 'BTC',
      data: []
    },
    connectionError: null
  }
}

const state = initialState()

const getters = {
  portfolioPrice (state) {
    return state.portfolioPrice
  },
  portfolioPercent (state) {
    return state.portfolioPercent
  },
  portfolioChart (state) {
    return state.portfolioChart
  },
  connectionError (state) {
    return state.connectionError
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

  [types.GET_MULTIPLE_PRICE_REQUEST] (state) {},

  [types.GET_MULTIPLE_PRICE_SUCCESS] (state, { prices }) {
    state.currentPriceList = prices
  },

  [types.GET_MULTIPLE_PRICE_FAILURE] (state, err) {
    handleError(state, err)
  },

  [types.PORTFOLIO_FULL_PRICE] (state, price) {
    state.portfolioPrice = price
  },

  [types.PORTFOLIO_CRYPTO_PRICE] (state, price) {
    state.portfolioPercent = price
  },

  [types.GET_PRICE_BY_FILTER_REQUEST] (state) {},

  [types.GET_PRICE_BY_FILTER_SUCCESS] (state, data) {
    state.portfolioChart.data = data
  },

  [types.GET_PRICE_BY_FILTER_FAILURE] (state, err) {
    handleError(state, err)
  },

  [types.SELECT_CHART_FILTER] (state, filter) {
    state.portfolioChart.filter = filter
  },

  [types.SELECT_CHART_CRYPTO] (state, crypto) {
    state.portfolioChart.crypto = crypto
  }
}

const actions = {
  getMultuplePrice ({ commit, dispatch, getters }) {
    dispatch('getAccountAssets').then(() => {
      commit(types.GET_MULTIPLE_PRICE_REQUEST)
      axios.loadPricesByLabels(getters.wallets)
        .then(prices => {
          commit(types.GET_MULTIPLE_PRICE_SUCCESS, prices)
          dispatch('calculatePortfolio', prices)
          dispatch('calculatePercentPortfolio', prices)
        })
        .catch(err => commit(types.GET_MULTIPLE_PRICE_FAILURE, err))
    })
  },
  getPriceByFilter ({ commit, getters }, data) {
    if (data.crypto) {
      commit(types.SELECT_CHART_CRYPTO, data.crypto)
    }
    if (data.filter) {
      commit(types.SELECT_CHART_FILTER, data.filter)
    }
    const filter = getters.portfolioChart
    commit(types.GET_PRICE_BY_FILTER_REQUEST)
    axios.loadPriceByFilter(filter)
      .then(({ Data }) => commit(types.GET_PRICE_BY_FILTER_SUCCESS, Data))
      .catch(err => commit(types.GET_PRICE_BY_FILTER_FAILURE, err))
  },
  calculatePortfolio ({ commit, getters }, { prices }) {
    let price = 0
    getters.wallets.forEach(crypto => {
      // TODO: To be removed. This is used for checking fake crypto currencies.
      if (_.has(prices, crypto.asset)) {
        price += prices[crypto.asset].RUB * crypto.amount
      }
    })
    commit('PORTFOLIO_FULL_PRICE', Number(price.toFixed(2)))
  },
  calculatePercentPortfolio ({ commit, getters }, { prices }) {
    const price = getters.portfolioPrice
    const currencies = []
    getters.wallets.forEach(crypto => {
      // TODO: To be removed. This is used for checking fake crypto currencies.
      if (_.has(prices, crypto.asset)) {
        const cryptoPrice = prices[crypto.asset].RUB * crypto.amount
        currencies.push({
          asset: crypto.asset,
          color: crypto.color,
          name: crypto.name,
          price: cryptoPrice,
          percent: (cryptoPrice * 100) / price
        })
      }
    })
    commit('PORTFOLIO_CRYPTO_PRICE', currencies)
  }
}

export default {
  types,
  state,
  getters,
  mutations,
  actions
}
