/*
 * Copyright D3 Ledger, Inc. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import axios from 'axios'

const API_URL = process.env.VUE_APP_CRYPTO_API_URL || 'https://min-api.cryptocompare.com/'

class CryptoService {
  constructor (url) {
    const service = axios.create({
      baseURL: url
    })
    this.service = service
  }

  // API always response with 200 status, so catch can not handle it
  checkForErrors (response) {
    const data = response.data
    const error = 'Error'
    if (data.Response === error) {
      return Promise.reject(
        new Error(
          data.Message
        )
      )
    }
    return response
  }

  get (path, params) {
    return this.service.get(path, params)
      .then(this.checkForErrors)
      .then(response => response.data)
  }
}

const CRYPTO_SERVICE = new CryptoService(API_URL)

const loadHistoryByLabels = (currencies, settings, options = {}) => {
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
  const search = dateFilter[options.filter]
  const endpoint = 'data/' + (search ? search.url : 'histoday')
  const history = currencies.map(crypto => {
    return CRYPTO_SERVICE
      .get(endpoint, {
        params: {
          fsym: crypto.asset,
          tsym: currentFiat,
          limit: options.limit || search.time,
          toTs: options.toTs
        }
      })
  })
  return Promise.all(history)
    .then(h => h.map((response, index) => {
      return {
        data: response.Data,
        asset: currencies[index].asset
      }
    }))
    .catch(err => {
      throw err
    })
}

const loadPriceByFilter = ({ crypto, filter, to }, settings) => {
  const fsym = crypto
  const tsym = to || settings.fiat
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
  return CRYPTO_SERVICE
    .get(`data/${search.url}`, {
      params: {
        fsym,
        tsym,
        limit: search.time
      }
    })
}

const loadVolumeByFilter = ({ crypto, filter }) => {
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
      url: 'histohour',
      time: 1
    }
  }
  const search = dateFilter[filter]
  return CRYPTO_SERVICE
    .get(`data/exchange/${search.url}`, {
      params: {
        tsym: crypto,
        limit: search.time
      }
    })
}

const loadFullData = (asset, currencies) => {
  const currentFiat = currencies.fiat
  const currentCrypto = currencies.crypto
  return CRYPTO_SERVICE
    .get('data/pricemultifull', {
      params: {
        fsyms: asset,
        tsyms: `${currentFiat},${currentCrypto}`
      }
    })
}

const loadPriceForAssets = (assets) => {
  return CRYPTO_SERVICE
    .get('data/price', {
      params: {
        fsym: assets.from,
        tsyms: assets.to
      }
    })
}

export default {
  loadHistoryByLabels,
  loadPriceByFilter,
  loadVolumeByFilter,
  loadFullData,
  loadPriceForAssets
}
