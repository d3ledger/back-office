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

export default {
  loadPricesByLabels: loadPricesByLabels(axiosAPI)
}
