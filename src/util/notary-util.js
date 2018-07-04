import axios from 'axios'

const API_URL = process.env.NOTARY_API_URL || 'http://localhost:8083/'

let axiosNotary = axios.create({
  baseURL: API_URL
})

const signup = axios => (name, publicKey) =>
  axios
    .post('users', {
      name,
      pubkey: publicKey
    })
    .then(({ data }) => ({ response: data }))
    .catch(error => ({ error }))

export default {
  signup: signup(axiosNotary)
}
