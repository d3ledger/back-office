/*
 * Copyright D3 Ledger, Inc. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import axios from 'axios'
import querystring from 'querystring'

// TODO: Need to create file where we can store such variables
const PROTOCOL = location.protocol

const checkAccountExists = (url, accountId) => {
  const formattedString = querystring.stringify({ accountId })

  return axios({
    url: `/iroha/account/exists?${formattedString}`,
    baseURL: `${PROTOCOL}//${url}`
  })
    .then(({ data }) => data)
    .catch(err => err)
}

const getAccountQuorum = (url, accountId) => {
  const formattedString = querystring.stringify(accountId)

  return axios({
    url: `/iroha/account/quorum?${formattedString}`,
    baseURL: `${PROTOCOL}//${url}`
  })
    .then(({ data }) => data)
    .catch(err => err)
}

const getAllAssets = (url) => {
  return axios({
    url: '/iroha/asset/getAll',
    baseURL: `${PROTOCOL}//${url}`
  })
    .then(({ data }) => data)
    .catch(err => err)
}

export default {
  checkAccountExists,
  getAccountQuorum,
  getAllAssets
}
