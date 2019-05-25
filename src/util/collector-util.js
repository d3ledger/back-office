import axios from 'axios'

// TODO: Need to create file where we can store such variables
const PROTOCOL = location.protocol

const getAllAssets = (url) => {
  return axios({
    url: '/iroha/asset/getAll',
    baseURL: `${PROTOCOL}//${url}`
  })
    .then(({ data }) => data)
    .catch(err => console.error(err))
}

export default {
  getAllAssets
}
