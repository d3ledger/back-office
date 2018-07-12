import _ from 'lodash'
import { getParsedItem, setParsedItem, setItem } from 'util/storage-util'

const types = _([
  'LOAD_SETTINGS',
  'UPDATE_SETTINGS_VIEW_FIAT',
  'UPDATE_SETTINGS_VIEW_CRYPTO',
  'UPDATE_SETTINGS_VIEW_TIMEZONE'
]).map(x => [x, x])
  .fromPairs()
  .value()

function initialState () {
  return {
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
  }
}

const mutations = {
  [types.LOAD_SETTINGS] (state, storage) {
    if (!_.isEqual(state, storage)) {
      Object.keys(state).map(key => {
        state[key] = storage[key]
      })
    }
  },

  [types.UPDATE_SETTINGS_VIEW_FIAT] (state, fiat) {
    state.view.fiat = fiat
  },

  [types.UPDATE_SETTINGS_VIEW_CRYPTO] (state, crypto) {
    state.view.crypto = crypto
  },

  [types.UPDATE_SETTINGS_VIEW_TIMEZONE] (state, timezone) {
    state.view.timezone = timezone
  }
}

const actions = {
  loadSettings ({ commit, state }) {
    const storage = getParsedItem('settings')
    if (storage) {
      commit(types.LOAD_SETTINGS, storage)
    } else {
      setItem('settings', state)
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
