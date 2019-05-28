import axios from 'axios'

const PROTOCOL = location.protocol

const getFullBillingData = (url) => {
  return axios({
    baseURL: `${PROTOCOL}//${url}`,
    url: `/cache/get/billing`
  })
    .then(({ data }) => data)
}

const getBillingData = (url, domain, asset, billingType) => {
  return axios({
    baseURL: `${PROTOCOL}//${url}`,
    url: `/cache/get/billing/${domain}/${asset}/${billingType}`
  })
    .then(({ data }) => data)
}

export default {
  getBillingData,
  getFullBillingData
}
