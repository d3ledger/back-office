export const WalletTypes = Object.freeze({
  ETH: Symbol('ETH'),
  BTC: Symbol('BTC')
})

export const SearchTypes = Object.freeze({
  BLOCK_TYPE: 'Block',
  TRANSACTION_TYPE: 'Transaction',
  ACCOUNT_TYPE: 'Account'
})

export const ADDRESS_WAITING_TIME = 3 * 24 * 60 * 60 * 1000
