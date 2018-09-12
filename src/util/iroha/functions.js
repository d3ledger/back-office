import { cryptoHelper } from 'iroha-helpers'
import { getAccount } from './queries'
import { cache } from './util'
import Debug from 'debug'
const debug = Debug('iroha-util')

const localStorage = global.localStorage || {
  setItem () {},
  getItem () {},
  removeItem () {}
}

/**
 * login
 * @param {String} username
 * @param {String} privateKey length is 64
 * @param {String} nodeIp
 */
function login (username, privateKey, nodeIp) {
  debug('starting login...')

  if (privateKey.length !== 64) {
    return Promise.reject(new Error('privateKey should have length of 64'))
  }

  cache.username = username
  cache.key = privateKey
  cache.nodeIp = nodeIp

  localStorage.setItem('iroha-wallet:nodeIp', nodeIp)

  return getAccount(username)
    .then(account => {
      debug('login succeeded!')
      return account
    })
    .catch(err => {
      debug('login failed')
      throw err
    })
}

function logout () {
  cache.username = null
  cache.key = null
  cache.nodeIp = null

  return Promise.resolve()
}

function getStoredNodeIp () {
  return localStorage.getItem('iroha-wallet:nodeIp') || ''
}

function clearStorage () {
  localStorage.removeItem('iroha-wallet:nodeIp')
}

function isLoggedIn () {
  return !!cache.username
}

// generate new keypair
const generateKeypair = cryptoHelper.generateKeyPair

// TODO: implement it
function acceptSettlement () {
  debug('starting acceptSettlement...')

  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), 500)
  })
}

// TODO: implement it
function rejectSettlement () {
  debug('starting rejectSettlement...')

  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), 500)
  })
}

export {
  login,
  logout,
  isLoggedIn,
  clearStorage,
  getStoredNodeIp,
  generateKeypair,
  acceptSettlement,
  rejectSettlement
}