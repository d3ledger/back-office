/*
 * Copyright D3 Ledger, Inc. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import axios from 'axios'

const getConfiguration = () => {
  return axios
    .get('/config.json')
    .then(({ data }) => data)
    .catch(err => console.error(err))
}

export default {
  getConfiguration
}
