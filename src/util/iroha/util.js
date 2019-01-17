import {
  // CommandService_v1Client as CommandService,
  QueryService_v1Client as QueryService
} from 'iroha-helpers/lib/proto/endpoint_pb_service'

export const DEFAULT_TIMEOUT_LIMIT = 5000

/**
 * cached items available from start to end of the app
 * plus, `nodeIp` is persisted by localStorage
 */
export const cache = {
  username: null, // NOT persisted by localStorage
  // TODO: do not cache keys; require a private key on every action instead.
  // For now it is needed for queries until tokens are implemented.
  key: null, // NOT persisted by localStorage
  nodeIp: null // persisted by localStorage
}

export function newCommandServiceOptions () {
  return {}
}

export function newQueryServiceOptions () {
  const a = {
    privateKey: cache.key,
    creatorAccountId: cache.username,
    queryService: new QueryService(cache.nodeIp)
  }
  console.log(a)
  return a
}
