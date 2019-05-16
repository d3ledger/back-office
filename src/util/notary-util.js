import axios from 'axios'

const PROTOCOL = location.protocol

const axiosNotaryRegistration = axios.create({
  baseURL: ''
})

const signup = axios => (name, publicKey) => {
  // Unfortunately, server awaits for formData, and it is the only way to provide it.
  let postData = new FormData()
  postData.append('name', name)
  postData.append('pubkey', publicKey)

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
