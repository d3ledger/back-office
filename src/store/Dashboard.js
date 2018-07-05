import _ from 'lodash'
import grpc from 'grpc'
import axios from '@util/cryptoApi-axios-util'

const types = _([
  'GET_MULTIPLE_PRICE'
]).chain()
  .flatMap(x => [x + '_REQUEST', x + '_SUCCESS', x + '_FAILURE'])
  .concat([
    'RESET',
    'PORTFOLIO_FULL_PRICE',
    'PORTFOLIO_PERCENT_CRYPTO'
  ])
  .map(x => [x, x])
  .fromPairs()
  .value()

function initialState () {
  return {
    currentPriceList: [],
    portfolioPrice: 0,
    portfolioPercent: {}
  }
}

const state = initialState()

const getters = {
  portfolioPrice (state) {
    return state.portfolioPrice
  },
  portfolioPercent (state) {
    return state.portfolioPercent
  }
}

/**
 * Store a connection error so the top component can handle it.
 * @param {Object} state
 * @param {Error} err
 */
function handleError (state, err) {
  switch (err.code) {
    case grpc.status.UNAVAILABLE:
    case grpc.status.CANCELLED:
      state.connectionError = err
      break

    default:
      state.connectionError = null
  }
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
    console.log(err)
    handleError(state, err)
  },

  [types.PORTFOLIO_FULL_PRICE] (state, price) {
    state.portfolioPrice = price
  },

  [types.PORTFOLIO_PERCENT_CRYPTO] (state, percent) {
    state.portfolioPercent = percent
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
    let currencies = []
    getters.wallets.forEach(crypto => {
      if (_.has(prices, crypto.asset)) {
        currencies.push({
          asset: crypto.asset,
          color: crypto.color,
          value: (prices[crypto.asset].RUB * crypto.amount * 100) / price
        })
      }
    })
    console.log(currencies)
    commit('PORTFOLIO_PERCENT_CRYPTO', currencies)
  }
}

export default {
  types,
  state,
  getters,
  mutations,
  actions
}
