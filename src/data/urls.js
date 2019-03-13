export const ETH_NOTARY_URL = process.env.VUE_APP_ETH_NOTARY_URL || 'http://localhost:8083'
export const BTC_NOTARY_URL = process.env.VUE_APP_BTC_NOTARY_URL || 'http://localhost:8086'
export const IROHA_REGISTRATION_URL = process.env.VUE_APP_IROHA_REGISTRATION_URL || 'http://localhost:8085'

export const registrationIPs = [
  {
    'value': ETH_NOTARY_URL,
    'label': 'Ethereum registration'
  },
  {
    'value': BTC_NOTARY_URL,
    'label': 'Bitcoin registartion'
  },
  {
    'value': IROHA_REGISTRATION_URL,
    'label': 'Iroha registartion'
  }
]
