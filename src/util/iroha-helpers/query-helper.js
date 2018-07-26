import { sign as signQuery, derivePublicKey } from 'ed25519.js'
import cloneDeep from 'lodash/cloneDeep'
import each from 'lodash/each'
import { Signature } from '../proto/primitive_pb'
import * as Queries from '../proto/queries_pb'

const emptyQuery = () => new Queries.Query()

/**
 * Returns payload from the query or a new one
 * @param {Object} query
 */
const getOrCreatePayload = query => query.hasPayload() ? cloneDeep(query.getPayload()) : new Queries.Query.Payload()

/**
 * Capitalizes string
 * @param {String} string
 * @returns {String} capitalized string
 */
const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1)

/**
 * Returns new query with added command.
 * @param {Object} query base query
 * @param {String} queryName name of a query. For reference, visit http://iroha.readthedocs.io/en/latest/api/queries.html
 * @param {Object} params query parameters. For reference, visit http://iroha.readthedocs.io/en/latest/api/queries.html
 */
const addQuery = (query, queryName, params) => {
  let payloadQuery = new Queries[capitalize(queryName)]()

  each(params, (value, key) => {
    payloadQuery['set' + capitalize(key)](value)
  })

  let payload = getOrCreatePayload(query)
  payload['set' + capitalize(queryName)](payloadQuery)

  let queryWithQuery = cloneDeep(query)
  queryWithQuery.setPayload(payload)

  return queryWithQuery
}

/**
 * Returns new query with meta information
 * @param {Object} query base query
 * @param {Object} meta - meta info
 * @param {String} meta.creatorAccountId accountID of query's creator
 * @param {Number} meta.createdTime time of query creation
 * @param {Number} meta.queryCounter query counter (will be removed soon)
 */

const addMeta = (query, { creatorAccountId, createdTime = Date.now(), queryCounter = 1 }) => {
  let meta = new Queries.QueryPayloadMeta()
  meta.setCreatorAccountId(creatorAccountId)
  meta.setCreatedTime(createdTime)
  meta.setQueryCounter(queryCounter)

  let payload = getOrCreatePayload(query)
  payload.setMeta(meta)

  let queryWithMeta = cloneDeep(query)
  queryWithMeta.setPayload(payload)

  return queryWithMeta
}

/**
 * Returns new signed query
 * @param {Object} query base query
 * @param {String} privateKeyHex - private key of query's creator in hex.
 */

const sign = (query, privateKeyHex) => {
  const payload = query.getPayload()
  const privateKey = Buffer.from(privateKeyHex, 'hex')
  const publicKey = derivePublicKey(privateKey)

  const signatory = signQuery(Buffer.from(payload.serializeBinary()), privateKey, publicKey)

  let s = new Signature()
  s.setPubkey(publicKey)
  s.setSignature(signatory)

  let signedQueryWithSignature = cloneDeep(query)
  signedQueryWithSignature.setSignature(s)

  return signedQueryWithSignature
}

export default {
  sign,
  addMeta,
  addQuery,
  emptyQuery
}

module.exports = {
  sign,
  addMeta,
  addQuery,
  emptyQuery
}
