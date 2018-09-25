import Vue from 'vue'
import map from 'lodash/fp/map'
import fromPairs from 'lodash/fp/fromPairs'
import flow from 'lodash/fp/flow'
import omit from 'lodash/fp/omit'
import isEqual from 'lodash/fp/isEqual'
import { getParsedItem, setParsedItem, setStringifyItem } from '@util/storage-util'

const types = flow(
  map(x => [x, x]),
  fromPairs
)([
  'LOAD_SETTINGS',
  'UPDATE_SETTINGS_VIEW_FIAT',
  'UPDATE_SETTINGS_VIEW_CRYPTO',
  'UPDATE_SETTINGS_VIEW_TIMEZONE'
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
  }
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
  }
}

export default {
  types,
  state,
  getters,
  mutations,
  actions
}
