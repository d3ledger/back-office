import axios from 'axios'

const API_URL = process.env.CRYPTO_API_URL || 'https://min-api.cryptocompare.com/'

let axiosAPI = axios.create({
  baseURL: API_URL
})

const loadPricesByLabels = axios => currencies => {
  const assets = currencies.map(crypto => crypto.asset).toString()
  return axios
    .get('data/pricemulti', {
      params: {
        fsyms: assets,
        tsyms: 'RUB'
      }
    })
    .then(({ data }) => ({ prices: data }))
    .catch(error => ({ error }))
}

const loadPriceByFilter = axios => ({ crypto, filter }) => {
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
        tsym: 'RUB',
        limit: search.time
      }
    })
    .then(({ data }) => data)
    .catch(error => ({ error }))
}

const loadFullData = axios => asset => {
  return axios
    .get('data/pricemultifull', {
      params: {
        fsyms: asset,
        tsyms: 'RUB'
      }
    })
    .then(({ data }) => data)
    .catch(error => ({ error }))
}

export default {
  loadPricesByLabels: loadPricesByLabels(axiosAPI),
  loadPriceByFilter: loadPriceByFilter(axiosAPI),
  loadFullData: loadFullData(axiosAPI)
}
