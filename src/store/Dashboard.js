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
  const timeKey = _.findKey(obj, (c) => {
    return c.data.length > 0 && c.data[0].time
  })
  return _(obj[timeKey].data)
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
  state.connectionError = err
}

const mutations = {
  [types.RESET] (state) {
    const s = initialState()
    Object.keys(s).forEach(key => {
      state[key] = s[key]
    })
  },

  [types.GET_PORTFOLIO_FULL_PRICE] (state) {
    const today = _.last(state.portfolio.assetsHistory).sum
    const prevDay = _.nth(state.portfolio.assetsHistory, -2).sum
    Vue.set(state.portfolio, 'assetsFullPrice', {
      value: today.toFixed(2),
      diff: (today - prevDay).toFixed(2),
      percent: (100 - ((prevDay * 100) / today)).toFixed(2)
    })
  },

  [types.GET_PORTFOLIO_PRICE_PERCENTAGE] (state, wallets) {
    const today = _.last(state.portfolio.assetsHistory)
    const currencies = []
    today.data.map(crypto => {
      const walletAsset = wallets.find(w => w.asset === crypto.asset)
      currencies.push({
        asset: crypto.asset,
        color: walletAsset.color,
        price: crypto.value.close,
        percent: (crypto.value.close * walletAsset.amount * 100) / today.sum
      })
    })
    Vue.set(state.portfolio, 'assetsPercentage', currencies)
  },

  [types.GET_PORTFOLIO_PRICE_LIST] (state, wallets) {
    const today = _.last(state.portfolio.assetsHistory)
    const prevDay = _.nth(state.portfolio.assetsHistory, -2)
    const currencies = []
    today.data.map(crypto => {
      const walletAsset = wallets.find(w => w.asset === crypto.asset)
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
    state.assetList = currencies
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
      .then(async () => {
        await dispatch('getPortfolioHistory')
        await dispatch('getPriceByFilter', getters.portfolioChart)
      })
      .then(() => commit(types.LOAD_DASHBOARD_SUCCESS))
      .catch((err) => {
        commit(types.LOAD_DASHBOARD_FAILURE, err)
        throw err
      })
  },
  async getPortfolioHistory ({ commit, getters }) {
    commit(types.GET_PORTFOLIO_HISTORY_REQUEST)
    await cryptoCompareUtil.loadHistoryByLabels(getters.wallets)
      .then(history => {
        commit(types.GET_PORTFOLIO_HISTORY_SUCCESS, convertData(history, getters.wallets))
      })
      .catch(err => {
        commit(types.GET_PORTFOLIO_HISTORY_FAILURE, err)
        throw err
      })
      .then(() => {
        commit('GET_PORTFOLIO_FULL_PRICE')
        commit('GET_PORTFOLIO_PRICE_PERCENTAGE', getters.wallets)
        commit('GET_PORTFOLIO_PRICE_LIST', getters.wallets)
      })
  },
  async getPriceByFilter ({ commit, getters }, data) {
    if (data.crypto) {
      commit(types.SELECT_CHART_CRYPTO, data.crypto)
    }
    if (data.filter) {
      commit(types.SELECT_CHART_FILTER, data.filter)
    }
    const filter = getters.portfolioChart
    commit(types.GET_PRICE_BY_FILTER_REQUEST)
    await cryptoCompareUtil.loadPriceByFilter(filter)
      .then(({ Data }) => commit(types.GET_PRICE_BY_FILTER_SUCCESS, Data))
      .catch(err => {
        commit(types.GET_PRICE_BY_FILTER_FAILURE, err)
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
