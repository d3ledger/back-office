/*
 * Copyright D3 Ledger, Inc. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
export const WalletTypes = Object.freeze({
  ETH: Symbol('ETH'),
  BTC: Symbol('BTC')
})

export const SearchTypes = Object.freeze({
  BLOCK_TYPE: 'Block',
  TRANSACTION_TYPE: 'Transaction',
  ACCOUNT_TYPE: 'Account'
})
