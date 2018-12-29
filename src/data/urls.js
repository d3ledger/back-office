import listOfNodes from './nodes.json'
export const ETH_NOTARY_URL = process.env.VUE_APP_ETH_NOTARY_URL || 'http://localhost:8083'
export const BTC_NOTARY_URL = process.env.VUE_APP_BTC_NOTARY_URL || 'http://localhost:8084'
export const IROHA_URL = process.env.VUE_APP_IROHA_URL

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

if (IROHA_URL) {
  listOfNodes.unshift({
    'value': IROHA_URL,
    'label': 'Default Node'
  })
}

export { listOfNodes }
