import axios from 'axios'

const NOTARY_URL = process.env.NOTARY_URL || 'http://localhost:8083/'

let axiosNotary = axios.create({
  baseURL: NOTARY_URL
})

const signup = axios => (name, publicKey) => {
  // Unfortunately, server awaits for formData, and it is the only way to provide it.
  let postData = new FormData()
  postData.append('name', name)
  postData.append('pubkey', publicKey)

  return axios
    .post('users', postData)
    .then(({ data }) => ({ response: data }))
    .catch(error => ({ error }))
}

export default {
  signup: signup(axiosNotary)
}
