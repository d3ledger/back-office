import { derivePublicKey } from 'ed25519.js'
import gt from 'lodash/fp/gt'
import lte from 'lodash/fp/lte'

import { SearchTypes } from '@/data/consts'

const getPrecision = (v) => (v.split('.')[1] || []).length

const errorMessages = {
  _userName: 'Username should match [a-z_0-9]{1,32}',
  _userDomain: 'Username should match [a-z_0-9]{1,32}@[a-z_0-9]{1,9}',
  _userExist: 'This username not exist',

  _keyPattern: 'Please provide correct private key',
  _keyDuplication: 'This key already used',
  _nodeIp: 'Please provide correct IP address',

  _address: 'Please provide correct address',

  _asset: 'Please select asset',
  _amount: 'Please provide correct amount',

  _explorerQuery: 'Query is incorrect'
}

/**
 * If validation function returns false it means that field is not valid
 * else field is valid
 */

export const _keyPattern = (value) => {
  const pattern = /^[A-Fa-f0-9]{64}$/
  if (value.length === 0) return true
  if (!pattern.test(value)) return false
  return true
}

export const _keyDuplication = (keys) => (value) => {
  let publicKey
  try {
    publicKey = derivePublicKey(Buffer.from(value, 'hex'))
  } catch (error) {
    console.error('Error: Invalid private key')
    return false
  }
  if (keys.includes(publicKey)) {
    return false
  }
  return true
}

export const _nodeIp = (url) => {
  let tempAddress = url.slice()
  if (url.includes('http://')) tempAddress = tempAddress.substr(7)
  if (url.includes('https://')) tempAddress = tempAddress.substr(8)
  const validateAddress = /^([a-z0-9\-.]*)\.(([a-z]{2,4})|([0-9]{1,3}\.([0-9]{1,3})\.([0-9]{1,3})))|(:[0-9]{1,5})$/.test(tempAddress)
  if (!validateAddress) return false
  return true
}

export const _user = {
  name: (name) => {
    const pattern = /^[a-z_0-9]{1,32}$/
    if (!pattern.test(name)) return false
    return true
  },
  nameDomain: (name) => {
    const pattern = /^[a-z_0-9]{1,32}@[a-z_0-9]{1,9}$/
    if (!pattern.test(name)) return false
    return true
  },
  nameExist: async (name) => {
    return true
  }
}

export const _wallet = {
  address: (address) => {
    const validateBTC = /^[123][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address)
    const validateETH = /^0x[a-fA-F0-9]{40}$/.test(address)
    if (!validateBTC && !validateETH) return false
    return true
  },
  asset: (asset) => (amount) => {
    if (!asset) return false
    return true
  }
}

export const _amount = (wallet) => (amount) => {
  if (isNaN(Number(amount))) return false
  else if (!/^(?![0.]+$)\d+(\.\d+)?$/.test(amount)) return false
  else if (amount !== null && gt(getPrecision(amount))(wallet.precision)) return false
  else if (amount !== null && amount.length === 0) return false
  else if (gt(Number(amount))(Number(wallet.amount))) return false
  else if (lte(Number(amount))(0)) return false
  return true
}

export const _explorerQuery = (type) => (query) => {
  if (type === SearchTypes.ACCOUNT) {
    return _user.nameDomain(query)
  } else if (type === SearchTypes.BLOCK) {
    const parsed = parseInt(query)
    return Number.isInteger(parsed) && parsed.toString().length === query.length
  } else if (type === SearchTypes.TRANSACTION) {
    return true
  }
  return true
}

export const errorHandler = {
  methods: {
    _isValid: (f, key) => {
      if (!f || !f.$model) return
      if (key) return f.$dirty && f.$model[key].length && !f.$error
      return f.$dirty && f.$model.length && !f.$error
    },
    _isError: (model) => model.$error,
    _showError: (model) => {
      const fields = Object.keys(model).filter(k => k.includes('_') && !model[k])
      if (fields.length) return errorMessages[fields[0]]
    }
  }
}
