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
    'SELECT_CHART_CRYPTO',
    'SELECT_PORTFOLIO_FILTER'
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
        percent: 0,
        time: 0
      },
      assetsPercentage: [],
      assetsHistory: [],
      isLoading: false,
      filter: '1W'
    },
    assetList: [],
    assetChart: {
      filter: '1M',
      crypto: null,
      data: [],
      isLoading: false
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
  portfolioFilter (state) {
    return state.portfolio.filter
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
  portfolioHistoryIsLoading (state) {
    return state.portfolio.isLoading
  },
  connectionError (state) {
    return state.connectionError
  },
  isDashboardLoading (state) {
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
    const today = last(state.portfolio.assetsHistory)
    const prevDay = nth(-2)(state.portfolio.assetsHistory).sum
    const current = state.portfolio.assetsFullPrice

    if (current.time <= today.time) {
      Vue.set(state.portfolio, 'assetsFullPrice', {
        value: today.sum.toFixed(2),
        diff: (today.sum - prevDay).toFixed(2),
        percent: (100 - ((prevDay * 100) / today.sum)).toFixed(2),
        time: today.time
      })
    } else {
      Vue.set(state.portfolio, 'assetsFullPrice', {
        value: current.value,
        diff: (current.value - prevDay).toFixed(2),
        percent: (100 - ((prevDay * 100) / current.value)).toFixed(2),
        time: current.time
      })
    }
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

  [types.GET_PRICE_BY_FILTER_REQUEST] (state) {
    Vue.set(state.assetChart, 'isLoading', true)
  },

  [types.GET_PRICE_BY_FILTER_SUCCESS] (state, data) {
    Vue.set(state.assetChart, 'data', data)
    Vue.set(state.assetChart, 'isLoading', false)
  },

  [types.GET_PRICE_BY_FILTER_FAILURE] (state, err) {
    Vue.set(state.assetChart, 'isLoading', false)
    handleError(state, err)
  },

  [types.GET_PORTFOLIO_HISTORY_REQUEST] (state) {
    Vue.set(state.portfolio, 'isLoading', true)
  },

  [types.GET_PORTFOLIO_HISTORY_SUCCESS] (state, data) {
    Vue.set(state.portfolio, 'assetsHistory', data)
    Vue.set(state.portfolio, 'isLoading', false)
  },

  [types.GET_PORTFOLIO_HISTORY_FAILURE] (state, err) {
    Vue.set(state.portfolio, 'isLoading', false)
    handleError(state, err)
  },

  [types.SELECT_PORTFOLIO_FILTER] (state, filter) {
    Vue.set(state.portfolio, 'filter', filter)
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
        if (!getters.wallets.length) return

        await dispatch('getPortfolioHistory', { filter: getters.portfolioFilter })

        commit(types.GET_PORTFOLIO_FULL_PRICE)
        commit(types.GET_PORTFOLIO_PRICE_PERCENTAGE, getters.wallets)
        commit(types.GET_PORTFOLIO_PRICE_LIST, getters.wallets)

        await dispatch('getPriceByFilter', getters.portfolioChart)
      })
      .then(() => commit(types.LOAD_DASHBOARD_SUCCESS))
      .catch((err) => {
        commit(types.LOAD_DASHBOARD_FAILURE, err)
        throw err
      })
  },
  async getPortfolioHistory ({ commit, getters }, { filter }) {
    commit(types.SELECT_PORTFOLIO_FILTER, filter)
    commit(types.GET_PORTFOLIO_HISTORY_REQUEST)

    await cryptoCompareUtil.loadHistoryByLabels(getters.wallets, getters.settingsView, { filter })
      .then(history => {
        commit(types.GET_PORTFOLIO_HISTORY_SUCCESS, convertData(history, getters.wallets))
        commit(types.GET_PORTFOLIO_FULL_PRICE)
      })
      .catch(err => {
        commit(types.GET_PORTFOLIO_HISTORY_FAILURE, err)
        throw err
      })
  },
  async getPriceByFilter ({ commit, getters }, data) {
    const wallets = getters.wallets
      .filter(w => Number(w.amount) !== 0)
      .filter(w => getters.portfolioList.find(p => p.asset === w.asset))

    const crypto = (wallets.length && !data.crypto) ? getters.portfolioChart.crypto || wallets[0].asset : data.crypto
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
