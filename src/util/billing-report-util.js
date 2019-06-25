/*
 * Copyright D3 Ledger, Inc. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import axios from 'axios'
import querystring from 'querystring'

// TODO: Need to create file where we can store such variables
const PROTOCOL = location.protocol

const getCustodyUserReport = (url, params) => {
  const formattedString = querystring.stringify(params)

  return axios({
    url: `/report/billing/custody/customer?${formattedString}`,
    baseURL: `${PROTOCOL}//${url}`
  })
    .then(({ data }) => data)
    .catch(err => err)
}

const getTransferUserReport = (url, params) => {
  const formattedString = querystring.stringify(params)

  return axios({
    url: `/report/billing/transferAsset/account?${formattedString}`,
    baseURL: `${PROTOCOL}//${url}`
  })
    .then(({ data }) => data)
    .catch(err => err)
}

const getExchangeUserReport = (url, params) => {
  const formattedString = querystring.stringify(params)

  return axios({
    url: `/report/billing/exchange/customer?${formattedString}`,
    baseURL: `${PROTOCOL}//${url}`
  })
    .then(({ data }) => data)
    .catch(err => err)
}

export default {
  getCustodyUserReport,
  getTransferUserReport,
  getExchangeUserReport
}
