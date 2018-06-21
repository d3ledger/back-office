import _ from 'lodash'
import { amountToString } from './iroha-amount'

// TODO: To be removed.
const DUMMY_SETTLEMENTS = require('@/mocks/settlements.json')

// TODO: check if transferAsset is a part of a settlement by meta info.
function findSettlementOfTransaction (settlements = [], transferAsset) {
  if (!transferAsset) return null
  if (transferAsset.description !== 'PART_OF_DUMMY_SETTLEMENT') return null

  return {
    'id': 1,
    'from': 'you',
    'offer_amount': 0.796463,
    'offer_asset': 'WVS',
    'to': 'yuriy@ru',
    'request_amount': 0.26483,
    'request_asset': 'ETH',
    'date': '2018-03-24T00:19:35Z',
    'message': 'Hello. This is a settlement.',
    'status': 'accepted'
  }
}

export function getTransferAssetsFrom (transactions, accountId, settlements = []) {
  if (_.isEmpty(transactions)) return []

  const transformed = []

  transactions.forEach(t => {
    const { commandsList, createdTime } = t.payload

    commandsList.forEach(c => {
      if (!c.transferAsset) return

      const {
        amount,
        destAccountId,
        srcAccountId,
        description
      } = c.transferAsset

      const tx = {
        from: srcAccountId === accountId ? 'you' : srcAccountId,
        to: destAccountId === accountId ? 'you' : destAccountId,
        amount: amountToString(amount),
        date: createdTime,
        message: description,
        // TODO: set appropreate tx status ('accepted', 'rejected', 'canceled')
        status: 'accepted'
      }

      const settlement = findSettlementOfTransaction(settlements, c.transferAsset)

      if (settlement) tx.settlement = settlement

      transformed.push(tx)
    })
  })

  /*
    * As actions.getAccountTransactions() does, we fetch account's txs
    * by multiple getAccount*Asset*Transactions calls.
    *
    * Also, getAccount*Asset*Transactions returns txs each of which includes
    * one or more command(s), which possibly includes also commands issued
    * against different asset.
    *
    * Therefore, when merging transactions for multiple assets, duplication
    * possibly occurs.
    * e.g.
    *    accountAssetTransactions_of_asset_A = [
    *      { commands: [command_for_asset_A_1, command_for_asset_B_1] },
    *      { commands: [command_for_asset_A_2] }
    *    ]
    *    accountAssetTransactions_of_asset_B = [
    *      { commands: [command_for_asset_A_1, command_for_asset_B_1] }
    *    ]
    *    // -> command_for_asset_A_1 and B_1 duplicates!
    *
    * To avoid it, we uniq the transactions.
    */
  return _(transformed)
    .chain()
    .uniqWith(_.isEqual)
    .sortBy('date')
    .reverse()
    .value()
}

// TODO: extract settlements from raw transactions and return
// TODO: might be able to put together with getTransferAssetsFrom
export function getSettlementsFrom (transactions) {
  if (_.isEmpty(transactions)) return []

  return DUMMY_SETTLEMENTS
}
