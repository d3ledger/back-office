import { derivePublicKey } from 'ed25519.js'
import gt from 'lodash/fp/gt'
import lte from 'lodash/fp/lte'

const getPrecision = (v) => (v.split('.')[1] || []).length

/**
 * If validation function returns false it means that field is not valid
 * else field is valid
 */

export const _keyPattern = (value) => {
  const pattern = /^[A-Fa-f0-9]{64}$/
  if (!pattern.test(value)) return false
  return true
}

export const _keyDuplication = (keys) => (value) => {
  console.log('keyd', value, keys)
  if (keys.includes(derivePublicKey(Buffer.from(value, 'hex')).toString('hex'))) {
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

export const _username = (name) => {
  const pattern = /^[a-z_0-9]{1,32}$/
  if (!pattern.test(name)) return false
  return true
}

export const _usernameWithDomain = (value) => {
  const pattern = /^[a-z_0-9]{1,32}@[a-z_0-9]{1,9}$/
  if (!pattern.test(value)) return false
  return true
}

export const _walletAddress = (address) => {
  const validateBTC = /^[123][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address)
  const validateETH = /^0x[a-fA-F0-9]{40}$/.test(address)
  if (!validateBTC && !validateETH) return false
  return true
}

export const _amount = (wallet, asset) => (amount) => {
  if (!asset) return false
  else if (isNaN(Number(amount))) return false
  else if (!/^(?![0.]+$)\d+(\.\d+)?$/.test(amount)) return false
  else if (amount !== null && gt(getPrecision(amount))(wallet.precision)) return false
  else if (amount !== null && amount.length === 0) return false
  else if (gt(Number(amount))(Number(wallet.amount))) return false
  else if (lte(Number(amount))(0)) return false
  return true
}

export const errorHandler = {
  methods: {
    _isValid: (f, key) => {
      if (!f || !f.$model) return
      if (key) return f.$dirty && f.$model[key].length && !f.$error
      return f.$dirty && f.$model.length && !f.$error
    },
    _isError: (model) => model.$error
  }
}
