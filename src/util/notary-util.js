/*
 * Copyright D3 Ledger, Inc. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import axios from 'axios'
import { ETH_NOTARY_URL, BTC_NOTARY_URL } from '@/data/urls'

let axiosNotary = axios.create({
  baseURL: ETH_NOTARY_URL
})

const signup = axios => (name, whitelist, publicKey) => {
  // Unfortunately, server awaits for formData, and it is the only way to provide it.
  let postData = new FormData()
  postData.append('name', name)
  postData.append('whitelist', whitelist)
  postData.append('pubkey', publicKey)

  return axios
    .post('users', postData)
    .then(({ data }) => ({ response: data }))
}

const getFreeEthRelaysNumber = () => {
  return axios
    .get(`${ETH_NOTARY_URL}/free-addresses/number`)
    .then(({ data }) => data)
}

const getFreeBtcRelaysNumber = () => {
  return axios
    .get(`${BTC_NOTARY_URL}/free-addresses/number`)
    .then(({ data }) => data)
}

const getNodeAddresses = () => {
  return axios
    .get('/nodes.json')
    .then(({ data }) => data)
}

const getRegistrationAddresses = () => {
  return axios
    .get('/registrations.json')
    .then(({ data }) => data)
}

export default {
  get baseURL () { return axiosNotary.defaults.baseURL },
  set baseURL (baseURL) { axiosNotary.defaults.baseURL = baseURL },
  signup: signup(axiosNotary),
  getFreeEthRelaysNumber,
  getFreeBtcRelaysNumber,

  getNodeAddresses,
  getRegistrationAddresses
}
