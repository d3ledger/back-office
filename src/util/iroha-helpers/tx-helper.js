import { sign as signTransaction, derivePublicKey } from 'ed25519.js'
import { sha3_256 as sha3 } from 'js-sha3'
import cloneDeep from 'lodash/cloneDeep'
import each from 'lodash/each'
import * as Commands from './proto/commands_pb'
import { Signature } from './proto/primitive_pb'
import Transaction from './proto/transaction_pb'
import { capitalize, hexStrToByte } from './util.js'

const emptyTransaction = () => new Transaction.Transaction()

/**
 * Returns payload from the transaction or a new one
 * @param {Object} transaction
 */
const getOrCreatePayload = transaction => transaction.hasPayload() ? cloneDeep(transaction.getPayload()) : new Transaction.Transaction.Payload()

/**
 * Returns reducedPayload from the payload or a new one
 * @param {Object} payload
 */
const getOrCreateReducedPayload = payload => payload.hasReducedPayload() ? cloneDeep(payload.getReducedPayload()) : new Transaction.Transaction.Payload.ReducedPayload()

// TODO: Create corner cases for AddPeer, setPermission
/**
 * Returns new query with added command.
 * @param {Object} transaction base transaction
 * @param {String} commandName name of a commandName. For reference, visit http://iroha.readthedocs.io/en/latest/api/commands.html
 * @param {Object} params command parameters. For reference, visit http://iroha.readthedocs.io/en/latest/api/commands.html
 */
const addCommand = (transaction, commandName, params) => {
  let payloadCommand = new Commands[capitalize(commandName)]()

  each(params, (value, key) => {
    payloadCommand['set' + capitalize(key)](value)
  })

  let command = new Commands.Command()
  command['set' + capitalize(commandName)](payloadCommand)

  let payload = getOrCreatePayload(transaction)
  let reducedPayload = getOrCreateReducedPayload(payload)

  reducedPayload.addCommands(command, reducedPayload.getCommandsList.length)
  payload.setReducedPayload(reducedPayload)

  let txWithCommand = cloneDeep(transaction)
  txWithCommand.setPayload(payload)

  return txWithCommand
}

/**
 * Returns new transaction with meta information
 * @param {Object} transaction base transaction
 * @param {Object} meta - meta info
 * @param {String} meta.creatorAccountId accountID of transaction's creator
 * @param {Number} meta.createdTime time of transaction creation
 * @param {Number} meta.quorum minimum amount of signatures needed to sign a transaction
 */

const addMeta = (transaction, { creatorAccountId, createdTime = Date.now(), quorum = 1 }) => {
  let payload = getOrCreatePayload(transaction)
  let reducedPayload = getOrCreateReducedPayload(payload)

  reducedPayload.setCreatorAccountId(creatorAccountId)
  reducedPayload.setCreatedTime(createdTime)
  reducedPayload.setQuorum(quorum)

  payload.setReducedPayload(reducedPayload)

  let transactionWithMeta = cloneDeep(transaction)
  transactionWithMeta.setPayload(payload)

  return transactionWithMeta
}

/**
 * Returns new transaction with one more signature
 * @param {Object} transaction base transaction
 * @param {String} privateKeyHex - private key of query's creator in hex.
 */
const sign = (transaction, privateKeyHex) => {
  const privateKey = hexStrToByte(privateKeyHex)
  const publicKey = derivePublicKey(privateKey)

  const payloadHash = sha3.array(transaction.getPayload().serializeBinary())

  const signatory = signTransaction(payloadHash, publicKey, privateKey)

  let s = new Signature()
  s.setPubkey(publicKey)
  s.setSignature(signatory)

  let signedTransactionWithSignature = cloneDeep(transaction)
  signedTransactionWithSignature.addSignatures(s, signedTransactionWithSignature.getSignaturesList.length)

  return signedTransactionWithSignature
}

/**
 * Returns hash of a transaction
 * @param {Object} transaction base transaction
 * @param {String} privateKeyHex private key of query's creator in hex.
 * @returns {Uint8Array} transaction hash
 */

const hash = transaction => new Uint8Array(sha3.array(transaction.getPayload().serializeBinary()))

// TODO: Add types for commands
export default {
  addCommand,
  addMeta,
  sign,
  emptyTransaction,
  hash
}

module.exports = {
  addCommand,
  addMeta,
  sign,
  emptyTransaction,
  hash
}
