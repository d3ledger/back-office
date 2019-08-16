/*
 * Copyright D3 Ledger, Inc. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import axios from 'axios'

const PROTOCOL = location.protocol

const axiosNotaryRegistration = axios.create({
  baseURL: ''
})

const signup = axios => (username, publicKey) => {
  // Unfortunately, server awaits for formData, and it is the only way to provide it.
  let postData = new FormData()

  const [name, domain] = username.split('@')

  postData.append('name', name)
  postData.append('pubkey', publicKey)
  postData.append('domain', domain)

  return axios
    .post('users', postData)
    .then(({ data }) => ({ response: data }))
}

const getFreeRelaysNumber = (url) => {
  return axios({
    url: '/free-addresses/number',
    baseURL: `${PROTOCOL}//${url}`
  })
    .then(({ data }) => data)
}

export default {
  get baseURL () { return axiosNotaryRegistration.defaults.baseURL },
  set baseURL (baseURL) {
    axiosNotaryRegistration.defaults.baseURL = `${PROTOCOL}//${baseURL}`
  },
  signup: signup(axiosNotaryRegistration),
  getFreeRelaysNumber
}
