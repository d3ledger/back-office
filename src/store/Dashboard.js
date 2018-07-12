import Vue from 'vue'
import _ from 'lodash'
import cryptoCompareUtil from 'util/cryptoApi-axios-util'

const types = _([
  'LOAD_DASHBOARD',
  'GET_PRICE_BY_FILTER',
  'GET_PORTFOLIO_HISTORY'
]).chain()
  .flatMap(x => [x + '_REQUEST', x + '_SUCCESS', x + '_FAILURE'])
  .concat([
    'RESET',
    'GET_PORTFOLIO_FULL_PRICE',
    'GET_PORTFOLIO_PRICE_LIST',
    'GET_PORTFOLIO_PRICE_PERCENTAGE',
    'SELECT_CHART_FILTER',
    'SELECT_CHART_CRYPTO'
  ])
  .map(x => [x, x])
  .fromPairs()
  .value()

const convertData = (obj, wallets) => {
  const getEqTime = (t) => {
    return _(obj)
      .filter(c => c.data.length)
      .map(c => ({
        asset: c.asset,
        value: _.find(c.data, d => d.time === t)
      }))
      .value()
  }
  const getSum = (d) => {
    return d.reduce((p, n) => {
      const crypto = wallets.find(c => c.asset === n.asset)
      return p + (n.value.close * crypto.amount)
    }, 0)
  }
  return _(obj[0].data)
    .map('time')
    .map(t => {
      const d = getEqTime(t)
      const s = getSum(d)
      return {
        time: t,
        sum: s,
        data: d
      }
    })
    .value()
}

function initialState () {
  return {
    portfolio: {
      assetsFullPrice: {
        diff: 0,
        value: 0,
        percent: 0
      },
      assetsPercentage: [],
      assetsHistory: []
    },
    assetList: [],
    assetChart: {
      filter: '1Y',
      crypto: 'BTC',
      data: []
    },
    isLoading: false,
    connectionError: null
  }
}

const state = initialState()

const getters = {
  portfolioPrice (state) {
    return state.portfolio.assetsFullPrice
  },
  portfolioPercent (state) {
    return state.portfolio.assetsPercentage
  },
  portfolioChart (state) {
    return state.assetChart
  },
  portfolioHistory (state) {
    return state.portfolio.assetsHistory
  },
  portfolioList (state) {
    return state.assetList
  },
  connectionError (state) {
    return state.connectionError
  },
  dashboardLoading (state) {
    return state.isLoading
  }
}

/**
 * Store a connection error so the top component can handle it.
 * @param {Object} state
 * @param {Error} err
 */
function handleError (state, err) {
  console.error(err)
  state.connectionError = err
}

const mutations = {
  [types.RESET] (state) {
    const s = initialState()
    Object.keys(s).forEach(key => {
      state[key] = s[key]
    })
  },

  [types.GET_PORTFOLIO_FULL_PRICE] (state, { value, diff, percent }) {
    Vue.set(state.portfolio, 'assetsFullPrice', {
      diff: diff.toFixed(2),
      value: value.toFixed(2),
      percent: percent.toFixed(2)
    })
  },

  [types.GET_PORTFOLIO_PRICE_PERCENTAGE] (state, percent) {
    Vue.set(state.portfolio, 'assetsPercentage', percent)
  },

  [types.GET_PORTFOLIO_PRICE_LIST] (state, list) {
    state.assetList = list
  },

  [types.GET_PRICE_BY_FILTER_REQUEST] (state) {},

  [types.GET_PRICE_BY_FILTER_SUCCESS] (state, data) {
    Vue.set(state.assetChart, 'data', data)
  },

  [types.GET_PRICE_BY_FILTER_FAILURE] (state, err) {
    handleError(state, err)
  },

  [types.GET_PORTFOLIO_HISTORY_REQUEST] (state) {},

  [types.GET_PORTFOLIO_HISTORY_SUCCESS] (state, data) {
    Vue.set(state.portfolio, 'assetsHistory', data)
  },

  [types.GET_PORTFOLIO_HISTORY_FAILURE] (state, err) {
    handleError(state, err)
  },

  [types.SELECT_CHART_FILTER] (state, filter) {
    Vue.set(state.assetChart, 'filter', filter)
  },

  [types.SELECT_CHART_CRYPTO] (state, crypto) {
    Vue.set(state.assetChart, 'crypto', crypto)
  },

  [types.LOAD_DASHBOARD_REQUEST] (state) {
    state.isLoading = true
  },

  [types.LOAD_DASHBOARD_SUCCESS] (state) {
    state.isLoading = false
  },

  [types.LOAD_DASHBOARD_FAILURE] (state, err) {
    state.isLoading = false
    handleError(state, err)
  }
}

const actions = {
  loadDashboard ({ dispatch, commit, getters }) {
    commit(types.LOAD_DASHBOARD_REQUEST)
    dispatch('getAccountAssets')
      .then(() => {
        dispatch('getPortfolioHistory')
        dispatch('getPriceByFilter', getters.portfolioChart)
      })
      .then(() => commit(types.LOAD_DASHBOARD_SUCCESS))
      .catch((err) => commit(types.LOAD_DASHBOARD_FAILURE, err))
  },
  getPortfolioHistory ({ commit, dispatch, getters }) {
    commit(types.GET_PORTFOLIO_HISTORY_REQUEST)
    cryptoCompareUtil.loadHistoryByLabels(getters.wallets)
      .then(history => {
        commit(types.GET_PORTFOLIO_HISTORY_SUCCESS, convertData(history, getters.wallets))
        dispatch('calculatePortfolio')
        dispatch('calculatePercentPortfolio')
        dispatch('calculatePriceChange')
      })
      .catch(err => commit(types.GET_PORTFOLIO_HISTORY_FAILURE, err))
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
    cryptoCompareUtil.loadPriceByFilter(filter)
      .then(({ Data }) => commit(types.GET_PRICE_BY_FILTER_SUCCESS, Data))
      .catch(err => commit(types.GET_PRICE_BY_FILTER_FAILURE, err))
  },
  calculatePortfolio ({ commit, getters }) {
    const today = _.last(getters.portfolioHistory).sum
    const prevDay = _.nth(getters.portfolioHistory, -2).sum
    const portfolio = {
      value: today,
      diff: today - prevDay,
      percent: 100 - ((prevDay * 100) / today)
    }
    commit(types.GET_PORTFOLIO_FULL_PRICE, portfolio)
  },
  calculatePercentPortfolio ({ commit, getters }) {
    const today = _.last(getters.portfolioHistory)
    const currencies = []
    today.data.map(crypto => {
      const walletAsset = getters.wallets.find(w => w.asset === crypto.asset)
      currencies.push({
        asset: crypto.asset,
        color: walletAsset.color,
        price: crypto.value.close,
        percent: (crypto.value.close * walletAsset.amount * 100) / today.sum
      })
    })
    commit(types.GET_PORTFOLIO_PRICE_PERCENTAGE, currencies)
  },
  calculatePriceChange ({ commit, getters }) {
    const today = _.last(getters.portfolioHistory)
    const prevDay = _.nth(getters.portfolioHistory, -2)
    const currencies = []
    today.data.map(crypto => {
      const walletAsset = getters.wallets.find(w => w.asset === crypto.asset)
      const prevDayAsset = prevDay.data.find(c => c.asset === crypto.asset)
      const amountToday = walletAsset.amount * crypto.value.close
      const amountPrevDay = walletAsset.amount * prevDayAsset.value.close
      currencies.push({
        asset: crypto.asset,
        name: walletAsset.name,
        price: amountToday,
        diff: amountToday - amountPrevDay,
        percent: 100 - ((amountPrevDay * 100) / amountToday)
      })
    })
    commit(types.GET_PORTFOLIO_PRICE_LIST, currencies)
  }
}

export default {
  types,
  state,
  getters,
  mutations,
  actions
}
