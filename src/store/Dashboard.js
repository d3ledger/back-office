import Vue from 'vue'
import map from 'lodash/fp/map'
import flatMap from 'lodash/fp/flatMap'
import filter from 'lodash/fp/filter'
import concat from 'lodash/fp/concat'
import fromPairs from 'lodash/fp/fromPairs'
import flow from 'lodash/fp/flow'
import last from 'lodash/fp/last'
import nth from 'lodash/fp/nth'
import cryptoCompareUtil from '@util/cryptoApi-axios-util'

const types = flow(
  flatMap(x => [x + '_REQUEST', x + '_SUCCESS', x + '_FAILURE']),
  concat([
    'RESET',
    'GET_PORTFOLIO_FULL_PRICE',
    'GET_PORTFOLIO_PRICE_LIST',
    'GET_PORTFOLIO_PRICE_PERCENTAGE',
    'SELECT_CHART_FILTER',
    'SELECT_CHART_CRYPTO'
  ]),
  map(x => [x, x]),
  fromPairs
)([
  'LOAD_DASHBOARD',
  'GET_PRICE_BY_FILTER',
  'GET_PORTFOLIO_HISTORY'
])

const convertData = (obj, wallets) => {
  const getEqTime = (t) => {
    return flow(
      filter(c => c.data.length),
      map(c => ({
        asset: c.asset,
        value: c.data.find(d => d.time === t)
      }))
    )(obj)
  }
  const getSum = (d) => {
    return d.reduce((p, n) => {
      const crypto = wallets.find(c => c.asset === n.asset)
      return p + (n.value.close * crypto.amount)
    }, 0)
  }
  const timeKey = obj.find(c => {
    return c.data.length && c.data[0].time
  })
  return flow(
    map('time'),
    map(t => {
      const d = getEqTime(t)
      const s = getSum(d)
      return {
        time: t,
        sum: s,
        data: d
      }
    })
  )(timeKey.data)
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
      crypto: null,
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
    const today = last(state.portfolio.assetsHistory).sum
    const prevDay = nth(-2)(state.portfolio.assetsHistory).sum
    Vue.set(state.portfolio, 'assetsFullPrice', {
      value: today.toFixed(2),
      diff: (today - prevDay).toFixed(2),
      percent: (100 - ((prevDay * 100) / today)).toFixed(2)
    })
  },

  [types.GET_PORTFOLIO_PRICE_PERCENTAGE] (state, wallets) {
    const today = last(state.portfolio.assetsHistory)
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
    const today = last(state.portfolio.assetsHistory)
    const prevDay = nth(-2)(state.portfolio.assetsHistory)
    const toZero = (v) => isNaN(v) ? 0 : v
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
        percent: toZero(100 - ((amountPrevDay * 100) / amountToday))
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
        if (getters.wallets.length) {
          await dispatch('getPortfolioHistory')
          await dispatch('getPriceByFilter', getters.portfolioChart)
        }
      })
      .then(() => commit(types.LOAD_DASHBOARD_SUCCESS))
      .catch((err) => {
        commit(types.LOAD_DASHBOARD_FAILURE, err)
        throw err
      })
  },
  async getPortfolioHistory ({ commit, getters }) {
    commit(types.GET_PORTFOLIO_HISTORY_REQUEST)
    await cryptoCompareUtil.loadHistoryByLabels(getters.wallets, getters.settingsView)
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
    const crypto = (getters.wallets.length && !data.crypto) ? getters.wallets[0].asset : data.crypto
    if (crypto) {
      commit(types.SELECT_CHART_CRYPTO, crypto)
    }
    if (data.filter) {
      commit(types.SELECT_CHART_FILTER, data.filter)
    }

    const filter = getters.portfolioChart
    commit(types.GET_PRICE_BY_FILTER_REQUEST)
    await cryptoCompareUtil.loadPriceByFilter(filter, getters.settingsView)
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
