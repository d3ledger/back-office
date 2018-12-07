export const ETH_NOTARY_URL = process.env.VUE_APP_ETH_NOTARY_URL || 'http://localhost:8083'
export const BTC_NOTARY_URL = process.env.VUE_APP_BTC_NOTARY_URL || 'http://localhost:8084'

export const registrationIPs = [
  {
    'value': ETH_NOTARY_URL,
    'label': 'Etherium registration'
  },
  {
    'value': BTC_NOTARY_URL,
    'label': 'Bitcoin registartion'
  }
]
