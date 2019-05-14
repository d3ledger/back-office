import axios from 'axios'

const getConfiguration = () => {
  return axios
    .get('/config.json')
    .then(({ data }) => data)
    .catch(err => console.log(err))
}

export default {
  getConfiguration
}
