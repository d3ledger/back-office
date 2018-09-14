import { txHelper } from 'iroha-helpers'
import { CommandServiceClient } from 'iroha-helpers/lib/proto/endpoint_pb_service'
import { TxStatus, TxStatusRequest } from 'iroha-helpers/lib/proto/endpoint_pb'
import {
  cache,
  getProtoEnumName,
  DEFAULT_TIMEOUT_LIMIT
} from './util'

import Debug from 'debug'
const debug = Debug('iroha-util')

/**
 * wrapper function of commands
 * @param {Array.<String>} privateKeys array of private keys
 * @param {Object} tx transaction
 * @param {Number} timeoutLimit
 */
function command (
  privateKeys = [''],
  tx,
  quorum = 1,
  timeoutLimit = DEFAULT_TIMEOUT_LIMIT
) {
  let txClient, txHash

  return new Promise((resolve, reject) => {
    let txToSend = txHelper.addMeta(tx, {
      creatorAccountId: cache.username,
      quorum
    })

    txToSend = signWithArrayOfKeys(txToSend, privateKeys)
    txHash = txHelper.hash(txToSend)

    txClient = new CommandServiceClient(
      cache.nodeIp
    )

    debug('submitting transaction...')
    debug('peer ip:', cache.nodeIp)
    debug('parameters:', JSON.stringify(txToSend.getPayload(), null, '  '))
    debug('txhash:', Buffer.from(txHash).toString('hex'))
    debug('')

    const timer = setTimeout(() => {
      txClient.$channel.close()
      reject(new Error('please check IP address OR your internet connection'))
    }, timeoutLimit)

    txClient.torii(txToSend, (err, data) => {
      clearTimeout(timer)

      if (err) {
        return reject(err)
      }

      debug('submitted transaction successfully!')
      resolve()
    })
  })
    .then(() => {
      debug('opening transaction status stream...')

      return new Promise((resolve, reject) => {
        let statuses = []

        let request = new TxStatusRequest()
        request.setTxHash(txHash)

        let stream = txClient.statusStream(request)
        stream.on('data', function (response) {
          statuses.push(response)
        })

        stream.on('end', function (end) {
          // Throw error if Iroha closed connection without sending status responses
          if (statuses.length === 0) return reject(new Error('Problems with notary service. Please try again later.'))

          const last = statuses[statuses.length - 1].getTxStatus()

          const lastStatusName = getProtoEnumName(
            TxStatus,
            'iroha.protocol.TxStatus',
            last
          )

          if (lastStatusName !== 'COMMITTED') {
            return reject(new Error(`Your transaction wasn't commited: expected=COMMITED, actual=${lastStatusName}`))
          }

          resolve()
        })
      })
    })
}

/**
 * createAccount
 * {@link https://iroha.readthedocs.io/en/latest/api/commands.html#cresate-account createAccount - Iroha docs}
 * @param {Array.<String>} privateKeys
 * @param {String} accountName
 * @param {String} domainId
 * @param {String} publicKey
 * @param {Number} accountQuorum
 */
function createAccount (privateKeys, accountName, domainId, publicKey, accountQuorum) {
  debug('starting createAccount...')

  return command(
    privateKeys,
    txHelper.addCommand(txHelper.emptyTransaction(), 'createAccount', { accountName, domainId, publicKey }),
    accountQuorum
  )
}

/**
 * createAsset
 * {@link https://iroha.readthedocs.io/en/latest/api/commands.html#create-asset createAsset - Iroha docs}
 * @param {Array.<String>} privateKeys
 * @param {String} assetName
 * @param {String} domainI
 * @param {Number} precision
 * @param {Number} accountQuorum
 */
function createAsset (privateKeys, assetName, domainId, precision, accountQuorum) {
  debug('starting createAsset...')

  return command(
    privateKeys,
    txHelper.addCommand(txHelper.emptyTransaction(), 'createAsset', { assetName, domainId, precision }),
    accountQuorum
  )
}

/**
 * addAssetQuantity
 * {@link https://iroha.readthedocs.io/en/latest/api/commands.html#add-asset-quantity addAssetQuantity - Iroha docs}
 * @param {Array.<String>} privateKeys
 * @param {String} accountId
 * @param {String} assetId
 * @param {String} amount
 * @param {Number} accountQuorum
 */
function addAssetQuantity (privateKeys, assetId, amount, accountQuorum) {
  debug('starting addAssetQuantity...')

  return command(
    privateKeys,
    txHelper.addCommand(txHelper.emptyTransaction(), 'addAssetQuantity', { assetId, amount }),
    accountQuorum
  )
}

/**
 * setAccountDetail
 * {@link https://iroha.readthedocs.io/en/latest/api/commands.html#set-account-detail setAccountDetail - Iroha docs}
 * @param {Array.<String>} privateKeys
 * @param {String} accountId
 * @param {String} key
 * @param {String} value
 * @param {Number} accountQuorum
 */
function setAccountDetail (privateKeys, accountId, key, value, accountQuorum) {
  debug('starting setAccountDetail...')

  return command(
    privateKeys,
    txHelper.addCommand(txHelper.emptyTransaction(), 'setAccountDetail', { accountId, key, value }),
    accountQuorum
  )
}

/**
 * setAccountQuorum
 * {@link https://iroha.readthedocs.io/en/latest/api/commands.html#set-account-quorum setAccountQuorum - Iroha docs}
 * @param {Array.<String>} privateKeys
 * @param {String} accountId
 * @param {Number} quorum
 * @param {Number} accountQuorum
 */
function setAccountQuorum (privateKeys, accountId, quorum, accountQuorum) {
  debug('starting setAccountQuorum...')

  return command(
    privateKeys,
    txHelper.addCommand(txHelper.emptyTransaction(), 'setAccountQuorum', { accountId, quorum }),
    accountQuorum
  )
}

/**
 * transferAsset
 * {@link https://iroha.readthedocs.io/en/latest/api/commands.html#transfer-asset transferAsset - Iroha docs}
 * @param {Array.<Object>} privateKeys
 * @param {String} srcAccountId
 * @param {String} destAccountId
 * @param {String} assetId
 * @param {String} description
 * @param {String} amount
 * @param {Number} accountQuorum
 */
function transferAsset (privateKeys, srcAccountId, destAccountId, assetId, description, amount, accountQuorum) {
  debug('starting transferAsset...')

  return command(
    privateKeys,
    txHelper.addCommand(txHelper.emptyTransaction(), 'transferAsset', { srcAccountId, destAccountId, assetId, description, amount }),
    accountQuorum
  )
}

/**
 * addSignatory
 * {@link https://iroha.readthedocs.io/en/latest/api/commands.html#add-signatory addSignatory - Iroha docs}
 * @param {Array.<String>} privateKeys
 * @param {String} accountId
 * @param {String} publicKey
 * @param {Number} accountQuorum
 */
function addSignatory (privateKeys, accountId, publicKey, accountQuorum) {
  debug('starting addSignatory...')

  return command(
    privateKeys,
    txHelper.addCommand(txHelper.emptyTransaction(), 'addSignatory', { accountId, publicKey }),
    accountQuorum
  )
}

/**
 * Create settlement: an exchange request
 * @param {Array.<String>} senderPrivateKeys
 * @param {String} senderAccountId
 * @param {Number} senderQuorum
 * @param {String} senderAssetId
 * @param {String} senderAmount
 * @param {String} description
 * @param {String} receiverAccountId
 * @param {Number} receiverQuorum
 * @param {String} receiverAssetId
 * @param {String} receiverAmount
 * @param {Number} timeoutLimit
 */
function createSettlement (senderPrivateKeys, senderAccountId = cache.username, senderQuorum = 1, senderAssetId, senderAmount, description, receiverAccountId, receiverQuorum = 1, receiverAssetId, receiverAmount, timeoutLimit = DEFAULT_TIMEOUT_LIMIT) {
  debug('starting createSettlement...')

  let txClient

  let senderTx = txHelper.addCommand(txHelper.emptyTransaction(), 'transferAsset', { srcAccountId: senderAccountId, destAccountId: receiverAccountId, assetId: senderAssetId, description, amount: senderAmount })
  senderTx = txHelper.addMeta(senderTx, { creatorAccountId: senderAccountId, senderQuorum })

  let receiverTx = txHelper.addCommand(txHelper.emptyTransaction(), 'transferAsset', { srcAccountId: receiverAccountId, destAccountId: senderAccountId, assetId: receiverAssetId, description, amount: receiverAmount })
  receiverTx = txHelper.addMeta(receiverTx, { creatorAccountId: receiverAccountId, receiverQuorum })

  const batchArray = txHelper.addBatchMeta([senderTx, receiverTx], 0)

  batchArray[0] = signWithArrayOfKeys(batchArray[0], senderPrivateKeys)

  const senderTxHash = txHelper.hash(batchArray[0])
  const receiverTxHash = txHelper.hash(batchArray[1])

  const batch = txHelper.createTxListFromArray(batchArray)

  return new Promise((resolve, reject) => {
    debug('submitting transaction...')
    debug('peer ip:', cache.nodeIp)
    debug('parameters sender:', JSON.stringify(senderTx.getPayload(), null, '  '))
    debug('parameters receiver:', JSON.stringify(receiverTx.getPayload(), null, '  '))
    debug('senderTxHash:', Buffer.from(senderTxHash).toString('hex'))
    debug('receiverTxHash:', Buffer.from(receiverTxHash).toString('hex'))
    debug('')

    txClient = new CommandServiceClient(
      cache.nodeIp
    )

    const timer = setTimeout(() => {
      txClient.$channel.close()
      reject(new Error('please check IP address OR your internet connection'))
    }, timeoutLimit)

    txClient.listTorii(batch, (err, data) => {
      clearTimeout(timer)

      if (err) {
        return reject(err)
      }

      debug('submitted transaction successfully!')
      resolve()
    })
  })
    .then(() => {
      return new Promise((resolve, reject) => {
        debug('opening transaction status stream...')

        // Status requests promises
        let requests = [senderTxHash, receiverTxHash].map(hash => new Promise((resolve, reject) => {
          let statuses = []

          let request = new TxStatusRequest()
          request.setTxHash(hash)

          let stream = txClient.statusStream(request)
          stream.on('data', function (response) {
            statuses.push(response)
          })

          stream.on('end', function (end) {
            statuses.length > 0 ? resolve(statuses[statuses.length - 1].getTxStatus()) : resolve(null)
          })
        }))

        Promise.all(requests).then(values => {
          let statuses = values.map(x => x !== null ? getProtoEnumName(
            TxStatus,
            'iroha.protocol.TxStatus',
            x
          ) : null)

          statuses.every(x => x === 'MST_PENDING') ? resolve() : reject(new Error(`Your transaction wasn't commited: expected=MST_PENDING, MST_PENDING actual=${statuses[0]}, ${statuses[1]}`))
        })
      })
    })
}

function signWithArrayOfKeys (tx, privateKeys) {
  privateKeys.forEach(key => {
    tx = txHelper.sign(tx, key)
  })
  return tx
}

export {
  createAccount,
  createAsset,
  transferAsset,
  addSignatory,
  addAssetQuantity,
  createSettlement,
  setAccountDetail,
  setAccountQuorum
}
