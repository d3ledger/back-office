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

const getFreeEthRelaysNumber = axios => () => {
  return axios
    .get(`${ETH_NOTARY_URL}/free-addresses/number`)
    .then(({ data }) => ({ response: data }))
}

const getFreeBtcRelaysNumber = axios => () => {
  return axios
    .get(`${BTC_NOTARY_URL}/free-addresses/number`)
    .then(({ data }) => ({ response: data }))
}

export default {
  get baseURL () { return axiosNotary.defaults.baseURL },
  set baseURL (baseURL) { axiosNotary.defaults.baseURL = baseURL },
  signup: signup(axiosNotary),
  getFreeEthRelaysNumber,
  getFreeBtcRelaysNumber
}
