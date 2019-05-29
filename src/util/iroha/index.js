/*
 * Copyright D3 Ledger, Inc. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import * as queries from './queries'
import * as commands from './commands'
import * as functions from './functions'

export default {
  ...queries,
  ...commands,
  ...functions
}
