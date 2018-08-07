import { sign as signQuery, derivePublicKey } from 'ed25519.js'
import { sha3_256 as sha3 } from 'js-sha3'
import cloneDeep from 'lodash/cloneDeep'
import each from 'lodash/each'
import { Signature } from './proto/primitive_pb'
import * as Queries from './proto/queries_pb'
import { capitalize, hexStrToByte } from './util.js'

const emptyQuery = () => new Queries.Query()

/**
 * Returns payload from the query or a new one
 * @param {Object} query
 */
const getOrCreatePayload = query => query.hasPayload() ? cloneDeep(query.getPayload()) : new Queries.Query.Payload()

/**
 * Returns new query with added command.
 * @param {Object} query base query
 * @param {stringing} queryName name of a query. For reference, visit http://iroha.readthedocs.io/en/latest/api/queries.html
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
 * @param {stringing} meta.creatorAccountId accountID of query's creator
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
 * @param {stringing} privateKeyHex - private key of query's creator in hex.
 */
const sign = (query, privateKeyHex) => {
  const privateKey = hexStrToByte(privateKeyHex)
  const publicKey = derivePublicKey(privateKey)

  const payloadHash = sha3.array(query.getPayload().serializeBinary())

  const signatory = signQuery(payloadHash, publicKey, privateKey)

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
