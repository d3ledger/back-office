import axios from 'axios'

const getConfiguration = () => {
  return axios
    .get('/config.json')
    .then(({ data }) => data)
    .catch(err => console.error(err))
}

export default {
  getConfiguration
}
