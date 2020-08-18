/*
 * Copyright D3 Ledger, Inc. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import axios from 'axios'

// const PROTOCOL = location.protocol
const PROTOCOL = 'https://'

const getFullBillingData = (url) => {
  return axios({
    baseURL: `${PROTOCOL}//${url}`,
    url: `/cache/get/billing`
  })
    .then(({ data }) => data)
}

const getBillingData = (url, domain, asset, billingType) => {
  let [assetId, assetDomain] = asset.split('#')
  return axios({
    baseURL: `${PROTOCOL}//${url}`,
    url: `/cache/get/billing/${domain}/${assetId}/${assetDomain}/${billingType}`
  })
    .then(({ data }) => data)
}

export default {
  getBillingData,
  getFullBillingData
}
