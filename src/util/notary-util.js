import axios from 'axios'

const NOTARY_URL = process.env.VUE_APP_NOTARY_URL || 'http://localhost:8083/'

let axiosNotary = axios.create({
  baseURL: NOTARY_URL
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

export default {
  get baseURL () { return axiosNotary.defaults.baseURL },
  set baseURL (baseURL) { axiosNotary.defaults.baseURL = baseURL },
  signup: signup(axiosNotary)
}
