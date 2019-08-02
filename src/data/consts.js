/*
 * Copyright D3 Ledger, Inc. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
export const WalletTypes = Object.freeze({
  ETH: Symbol('ETH'),
  BTC: Symbol('BTC')
})

export const SearchTypes = Object.freeze({
  BLOCK: 'Block',
  TRANSACTION: 'Transaction',
  ACCOUNT: 'Account'
})

export const FeeTypes = Object.freeze({
  TRANSFER: 'transfer_billing',
  CUSTODY: 'custody_billing',
  ACCOUNT_CREATION: 'account_creation_billing',
  EXCHANGE: 'exchange_billing',
  WITHDRAWAL: 'withdrawal_billing'
})

export const BillingTypes = Object.freeze({
  TRANSFER: 'TRANSFER',
  CUSTODY: 'CUSTODY',
  ACCOUNT_CREATION: 'ACCOUNT_CREATION',
  EXCHANGE: 'EXCHANGE',
  WITHDRAWAL: 'WITHDRAWAL'

})

export const NOTARY_ACCOUNT = 'notary@notary'

export const ETH_WITHDRAWAL = 'withdrawal@notary'
export const BTC_WITHDRAWAL = 'btc_withdrawal_service@notary'

export const BITCOIN_ASSET_NAME = 'btc#bitcoin'
