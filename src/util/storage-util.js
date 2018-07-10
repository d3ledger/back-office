import _ from 'lodash'

const localStorage = global.localStorage || {
  setItem () {},
  getItem () {},
  removeItem () {}
}

const getItem = (key) => {
  return localStorage.getItem(key)
}

const setItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

const getParsedItem = (key) => {
  return JSON.parse(localStorage.getItem(key))
}

const setParsedItem = (key, value) => {
  const path = key.split('.')
  const i = getParsedItem(path[0])
  const v = _.set(i, path.slice(1), value)
  setItem(path[0], v)
}

export {
  getItem,
  setItem,
  getParsedItem,
  setParsedItem
}
