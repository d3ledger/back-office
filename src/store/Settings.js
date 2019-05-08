import Vue from 'vue'
import map from 'lodash/fp/map'
import fromPairs from 'lodash/fp/fromPairs'
import flow from 'lodash/fp/flow'
import omit from 'lodash/fp/omit'
import isEqual from 'lodash/fp/isEqual'
import flatMap from 'lodash/fp/flatMap'
import concat from 'lodash/fp/concat'
import { getParsedItem, setParsedItem, setStringifyItem } from '@util/storage-util'
import irohaUtil from '@util/iroha'

const types = flow(
  flatMap(x => [x + '_REQUEST', x + '_SUCCESS', x + '_FAILURE']),
  concat([
    'LOAD_SETTINGS',
    'UPDATE_SETTINGS_VIEW_FIAT',
    'UPDATE_SETTINGS_VIEW_CRYPTO',
    'UPDATE_SETTINGS_VIEW_TIMEZONE'
  ]),
  map(x => [x, x]),
  fromPairs
)([
  'ADD_ASSET_LIMIT',
  'REMOVE_ASSET_LIMIT'
])

function initialState () {
  return {
    default: {
      fiatCurrencies: ['RUB', 'USD', 'EUR'],
      cryptoCurrencies: ['BTC', 'ETH', 'XRP']
    },
    view: {
      fiat: 'RUB',
      crypto: 'BTC',
      timezone: 'Europe/Moscow'
    }
  }
}

const state = initialState()

const getters = {
  settingsView (state) {
    return state.view
  },
  settingsFiatCurrencies (state) {
    return state.default.fiatCurrencies
  },
  settingsCryptoCurrencies (state) {
    return state.default.cryptoCurrencies
  }
}

const mutations = {
  [types.LOAD_SETTINGS] (state, storage) {
    if (!isEqual(state, storage)) {
      Object.keys(state).map(key => {
        if (key !== 'default') {
          state[key] = storage[key]
        }
      })
    }
  },

  [types.UPDATE_SETTINGS_VIEW_FIAT] (state, fiat) {
    Vue.set(state.view, 'fiat', fiat)
  },

  [types.UPDATE_SETTINGS_VIEW_CRYPTO] (state, crypto) {
    Vue.set(state.view, 'crypto', crypto)
  },

  [types.UPDATE_SETTINGS_VIEW_TIMEZONE] (state, timezone) {
    Vue.set(state.view, 'timezone', timezone)
  },

  [types.ADD_ASSET_LIMIT_SUCCESS] () {},

  [types.ADD_ASSET_LIMIT_REQUEST] () {},

  [types.ADD_ASSET_LIMIT_FAILURE] () {},

  [types.REMOVE_ASSET_LIMIT_SUCCESS] () {},

  [types.REMOVE_ASSET_LIMIT_REQUEST] () {},

  [types.REMOVE_ASSET_LIMIT_FAILURE] () {}
}

const actions = {
  loadSettings ({ commit, state }) {
    const storage = getParsedItem('settings')
    if (storage) {
      commit(types.LOAD_SETTINGS, storage)
    } else {
      setStringifyItem('settings', omit('default')(state))
    }
  },
  updateSettingsViewFiat ({ commit }, fiat) {
    setParsedItem('settings.view.fiat', fiat)
    commit(types.UPDATE_SETTINGS_VIEW_FIAT, fiat)
  },
  updateSettingsViewCrypto ({ commit }, crypto) {
    setParsedItem('settings.view.crypto', crypto)
    commit(types.UPDATE_SETTINGS_VIEW_CRYPTO, crypto)
  },
  updateSettingsViewTime ({ commit }, timezone) {
    setParsedItem('settings.view.timezone', timezone)
    commit(types.UPDATE_SETTINGS_VIEW_TIMEZONE, timezone)
  },
  addAssetLimit ({ commit, getters }, { privateKeys, limit }) {
    commit(types.ADD_ASSET_LIMIT_REQUEST)
    const _assetId = limit.assetId.replace('#', '_')
    const value = {
      assetId: limit.assetId,
      amount: limit.amount,
      interval_type: limit.interval_type,
      interval_value: limit.interval_value,
      lastTransactionDate: 0,
      totalAmountInterval: 0
    }
    return irohaUtil.setAccountDetail(privateKeys, getters.quorum, {
      accountId: getters.accountId,
      key: `limit_${_assetId}`,
      // Iroha don't allow quotes in strings
      // eslint-disable-next-line
      value: JSON.stringify(value).replace(/"/g, '\\\"')
    })
      .then(() => commit(types.ADD_ASSET_LIMIT_SUCCESS))
      .catch(err => {
        commit(types.ADD_ASSET_LIMIT_FAILURE)
        throw err
      })
  },
  removeAssetLimit ({ commit, getters }, { privateKeys, limit }) {
    commit(types.REMOVE_ASSET_LIMIT_REQUEST)
    const _assetId = limit.assetId.replace('#', '_')
    return irohaUtil.setAccountDetail(privateKeys, getters.quorum, {
      accountId: getters.accountId,
      key: `limit_${_assetId}`,
      value: ''
    })
      .then(() => commit(types.REMOVE_ASSET_LIMIT_SUCCESS))
      .catch(err => {
        commit(types.REMOVE_ASSET_LIMIT_FAILURE)
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
