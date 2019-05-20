import {
  commands,
  signWithArrayOfKeys,
  sendTransactions,
  txHelper
} from 'iroha-helpers'
import {
  newCommandService,
  newCommandServiceOptions
} from './util'
import cloneDeep from 'lodash/fp/cloneDeep'

const DEFAULT_TIMEOUT_LIMIT = 5000

// /**
//  * signPendingTransaction: sign transaction with more keys and send.
//  * @param {Array.<String>} privateKeys
//  * @param {Object} transaction
//  */
function signPendingTransaction (privateKeys = [], transaction, timeoutLimit = DEFAULT_TIMEOUT_LIMIT) {
  /*
    * TODO: Remove clearSignaturesList() after
    * https://soramitsu.atlassian.net/browse/IR-1680 is completed
    * Now we should remove signatures because otherwise the transaction
    * won't get to MST processor and will be immediately commited
  */
  let txToSend = cloneDeep(transaction)
  txToSend.clearSignaturesList()

  txToSend = signWithArrayOfKeys(txToSend, privateKeys)

  let txClient = newCommandService()

  return sendTransactions([txToSend], txClient, timeoutLimit)
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
function createSettlement (senderPrivateKeys, senderAccountId, senderQuorum = 1, senderAssetId, senderAmount, description, receiverAccountId, receiverQuorum = 1, receiverAssetId, receiverAmount, timeoutLimit = DEFAULT_TIMEOUT_LIMIT) {
  let txClient = newCommandService()

  let senderTx = txHelper.addCommand(txHelper.emptyTransaction(), 'transferAsset', { srcAccountId: senderAccountId, destAccountId: receiverAccountId, assetId: senderAssetId, description, amount: senderAmount })
  senderTx = txHelper.addMeta(senderTx, { creatorAccountId: senderAccountId, quorum: senderQuorum })

  let receiverTx = txHelper.addCommand(txHelper.emptyTransaction(), 'transferAsset', { srcAccountId: receiverAccountId, destAccountId: senderAccountId, assetId: receiverAssetId, description, amount: receiverAmount })
  receiverTx = txHelper.addMeta(receiverTx, { creatorAccountId: receiverAccountId, quorum: receiverQuorum })

  const batchArray = txHelper.addBatchMeta([senderTx, receiverTx], 0)
  batchArray[0] = signWithArrayOfKeys(batchArray[0], senderPrivateKeys)

  return sendTransactions(batchArray, txClient, timeoutLimit)
}

function acceptSettlement (privateKeys, batchArray, timeoutLimit = DEFAULT_TIMEOUT_LIMIT) {
  if (!batchArray.length) return

  let txClient = newCommandService()

  const indexOfUnsigned = cloneDeep(batchArray)
    .map(tx => tx.toObject())
    .findIndex(tx => {
      return !tx.signaturesList.length
    })

  const indexOfSigned = cloneDeep(batchArray)
    .map(tx => tx.toObject())
    .findIndex(tx => tx.signaturesList.length)

  batchArray[indexOfSigned].clearSignaturesList()

  batchArray[indexOfUnsigned] = signWithArrayOfKeys(batchArray[1], privateKeys)

  return sendTransactions(batchArray, txClient, timeoutLimit, [
    'COMMITED',
    'COMMITED'
  ])
}

function rejectSettlement (privateKeys, batchArray, timeoutLimit = DEFAULT_TIMEOUT_LIMIT) {
  if (!batchArray.length) return

  let txClient = newCommandService()

  const indexOfUnsigned = cloneDeep(batchArray)
    .map(tx => tx.toObject())
    .findIndex(tx => !tx.signaturesList.length)
  const indexOfSigned = cloneDeep(batchArray)
    .map(tx => tx.toObject())
    .findIndex(tx => tx.signaturesList.length)

  batchArray[indexOfSigned].clearSignaturesList()

  batchArray[indexOfUnsigned] = signWithArrayOfKeys(batchArray[1], privateKeys)
  return sendTransactions(batchArray, txClient, timeoutLimit, [
    'ENOUGH_SIGNATURES_COLLECTED',
    'STATEFUL_VALIDATION_FAILED'
  ])
}

const createAccount = (privateKeys, quorum, {
  accountName,
  domainId,
  publicKey
}) => commands.createAccount(
  newCommandServiceOptions(privateKeys, quorum), {
    accountName,
    domainId,
    publicKey
  }
)

const createAsset = (privateKeys, quorum, {
  assetName,
  domainId,
  precision
}) => commands.createAsset(
  newCommandServiceOptions(privateKeys, quorum), {
    assetName,
    domainId,
    precision
  }
)

const transferAsset = (privateKeys, quorum, {
  srcAccountId,
  destAccountId,
  assetId,
  description,
  amount
}) => commands.transferAsset(
  newCommandServiceOptions(privateKeys, quorum), {
    srcAccountId,
    destAccountId,
    assetId,
    description,
    amount
  }
)

const addSignatory = (privateKeys, quorum, {
  accountId,
  publicKey
}) => commands.addSignatory(
  newCommandServiceOptions(privateKeys, quorum), {
    accountId,
    publicKey
  }
)

const removeSignatory = (privateKeys, quorum, {
  accountId,
  publicKey
}) => commands.removeSignatory(
  newCommandServiceOptions(privateKeys, quorum), {
    accountId,
    publicKey
  }
)

const addAssetQuantity = (privateKeys, quorum, {
  assetId,
  amount
}) => commands.addAssetQuantity(
  newCommandServiceOptions(privateKeys, quorum), {
    assetId,
    amount
  }
)

const setAccountDetail = (privateKeys, quorum, {
  accountId,
  key,
  value
}) => commands.setAccountDetail(
  newCommandServiceOptions(privateKeys, quorum), {
    accountId,
    key,
    value
  }
)

const setAccountQuorum = (privateKeys, currentQuorum, {
  accountId,
  quorum
}) => commands.setAccountQuorum(
  newCommandServiceOptions(privateKeys, currentQuorum), {
    accountId,
    quorum
  }
)

export {
  createAccount,
  createAsset,
  transferAsset,
  addSignatory,
  removeSignatory,
  addAssetQuantity,
  createSettlement,
  acceptSettlement,
  rejectSettlement,
  setAccountDetail,
  setAccountQuorum,
  signPendingTransaction
}
