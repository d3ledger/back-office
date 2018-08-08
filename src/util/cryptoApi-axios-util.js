import axios from 'axios'

const API_URL = process.env.VUE_APP_CRYPTO_API_URL || 'https://min-api.cryptocompare.com/'

let axiosAPI = axios.create({
  baseURL: API_URL
})

const loadHistoryByLabels = axios => (currencies, settings, options = {}) => {
  const currentFiat = settings.fiat
  const history = currencies.map(crypto => {
    return axios
      .get('data/histoday', {
        params: {
          fsym: crypto.asset,
          tsym: currentFiat,
          limit: options.limit || 30,
          toTs: options.toTs
        }
      })
  })
  return Promise.all(history)
    .then(h => h.map(({ data }, index) => {
      return {
        data: data.Data,
        asset: currencies[index].asset
      }
    }))
}

const loadPriceByFilter = axios => ({ crypto, filter }, settings) => {
  const currentFiat = settings.fiat
  const dateFilter = {
    'ALL': {
      url: 'histoday',
      time: 730
    },
    '1Y': {
      url: 'histoday',
      time: 365
    },
    '1M': {
      url: 'histoday',
      time: 30
    },
    '1W': {
      url: 'histoday',
      time: 7
    },
    '1D': {
      url: 'histohour',
      time: 24
    },
    '1H': {
      url: 'histominute',
      time: 60
    }
  }
  const search = dateFilter[filter]
  return axios
    .get(`data/${search.url}`, {
      params: {
        fsym: crypto,
        tsym: currentFiat,
        limit: search.time
      }
    })
    .then(({ data }) => data)
    .catch(error => ({ error }))
}

const loadFullData = axios => (asset, currencies) => {
  const currentFiat = currencies.fiat
  const currentCrypto = currencies.crypto
  return axios
    .get('data/pricemultifull', {
      params: {
        fsyms: asset,
        tsyms: `${currentFiat},${currentCrypto}`
      }
    })
    .then(({ data }) => data)
    .catch(error => ({ error }))
}

export default {
  loadHistoryByLabels: loadHistoryByLabels(axiosAPI),
  loadPriceByFilter: loadPriceByFilter(axiosAPI),
  loadFullData: loadFullData(axiosAPI)
}
