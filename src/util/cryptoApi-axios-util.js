import axios from 'axios'
import { getParsedItem } from 'util/storage-util'

const API_URL = process.env.CRYPTO_API_URL || 'https://min-api.cryptocompare.com/'

let axiosAPI = axios.create({
  baseURL: API_URL
})

const loadPricesByLabels = axios => currencies => {
  const assets = currencies.map(crypto => crypto.asset).toString()
  const currentFiat = getParsedItem('settings').view.fiat
  return axios
    .get('data/pricemulti', {
      params: {
        fsyms: assets,
        tsyms: currentFiat
      }
    })
    .then(({ data }) => ({ prices: data }))
    .catch(error => ({ error }))
}

const loadHistoryByLabels = axios => currencies => {
  const currentFiat = getParsedItem('settings').view.fiat
  const history = currencies.map(crypto => {
    return axios
      .get('data/histoday', {
        params: {
          fsym: crypto.asset,
          tsym: currentFiat,
          limit: 30
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

const loadPriceByFilter = axios => ({ crypto, filter }) => {
  const currentFiat = getParsedItem('settings').view.fiat
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

const loadFullData = axios => asset => {
  const settings = getParsedItem('settings').view
  const currentFiat = settings.fiat
  const currentCrypto = settings.crypto
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
  loadPricesByLabels: loadPricesByLabels(axiosAPI),
  loadHistoryByLabels: loadHistoryByLabels(axiosAPI),
  loadPriceByFilter: loadPriceByFilter(axiosAPI),
  loadFullData: loadFullData(axiosAPI)
}
