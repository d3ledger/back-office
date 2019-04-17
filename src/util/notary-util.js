import axios from 'axios'
// import { ETH_NOTARY_URL, BTC_NOTARY_URL } from '@/data/urls'

const axiosNotaryRegistration = axios.create({
  baseURL: ''
})

const axiosNotaryETH = axios.create({
  baseURL: ''
})

const axiosNotaryBTC = axios.create({
  baseURL: ''
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
  return axiosNotaryETH
    .get('/free-addresses/number')
    .then(({ data }) => data)
}

const getFreeBtcRelaysNumber = () => {
  return axiosNotaryBTC
    .get('/free-addresses/number')
    .then(({ data }) => data)
}

const getRelaysAddresses = () => {
  return axios
    .get('/relays.json')
    .then(({ data }) => {
      const { ETH, BTC } = data
      if (ETH.value) {
        axiosNotaryETH.defaults.baseURL = data.ETH.value
      }
      if (BTC.value) {
        axiosNotaryBTC.defaults.baseURL = data.BTC.value
      }
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
