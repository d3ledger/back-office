/*
 * Copyright D3 Ledger, Inc. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import {
  CommandService_v1Client as CommandService,
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

const DYNAMIC_URL = () => {
  const url = new URL(cache.nodeIp)
  url.protocol = location.protocol
  return url.origin
}

export function newCommandService () {
  return new CommandService(DYNAMIC_URL())
}

export function newQueryService () {
  return new QueryService(DYNAMIC_URL())
}

export function newCommandServiceOptions (privateKeys, quorum) {
  return {
    privateKeys,
    quorum,
    creatorAccountId: cache.username,
    commandService: new CommandService(DYNAMIC_URL()),
    timeoutLimit: DEFAULT_TIMEOUT_LIMIT
  }
}

export function newQueryServiceOptions () {
  return {
    privateKey: cache.key,
    creatorAccountId: cache.username,
    queryService: new QueryService(DYNAMIC_URL()),
    timeoutLimit: DEFAULT_TIMEOUT_LIMIT
  }
}
