import axios from 'axios'
// import { ETH_NOTARY_URL, BTC_NOTARY_URL } from '@/data/urls'

const axiosNotaryRegistration = axios.create({
  baseURL: ''
})

const axiosETH = axios.create({
  baseURL: ''
})

const axiosBTC = axios.create({
  baseURL: ''
})

const signup = axios => (name, whitelist, publicKey) => {
  // Unfortunately, server awaits for formData, and it is the only way to provide it.
  let postData = new FormData()
  postData.append('name', name)
  postData.append('pubkey', publicKey)
  postData.append('whitelist', whitelist)

  return axios
    .post('users', postData)
    .then(({ data }) => ({ response: data }))
}

const getFreeEthRelaysNumber = () => {
  return axiosETH
    .get('/free-addresses/number')
    .then(({ data }) => data)
}

const getFreeBtcRelaysNumber = () => {
  return axiosBTC
    .get('/free-addresses/number')
    .then(({ data }) => data)
}

const getRelaysAddresses = () => {
  return axios
    .get('/relays.json')
    .then(({ data }) => {
      const { ETH, BTC } = data
      if (ETH.value) {
        axiosETH.defaults.baseURL = data.ETH.value
      }
      if (BTC.value) {
        axiosBTC.defaults.baseURL = data.BTC.value
      }
      return data
    })
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
  get baseURL () { return axiosNotaryRegistration.defaults.baseURL },
  set baseURL (baseURL) { axiosNotaryRegistration.defaults.baseURL = baseURL },
  signup: signup(axiosNotaryRegistration),
  getFreeEthRelaysNumber,
  getFreeBtcRelaysNumber,

  getRelaysAddresses,
  getNodeAddresses,
  getRegistrationAddresses
}
