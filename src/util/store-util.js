import flow from 'lodash/fp/flow'
import isEmpty from 'lodash/fp/isEmpty'
import isEqual from 'lodash/fp/isEqual'
import uniqWith from 'lodash/fp/uniqWith'
import sortBy from 'lodash/fp/sortBy'
import reverse from 'lodash/fp/reverse'

const notaryAccount = process.env.VUE_APP_NOTARY_ACCOUNT || 'notary_red@notary'

// TODO: To be removed.
const DUMMY_SETTLEMENTS = require('@/data/settlements.json')

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
  if (isEmpty(transactions)) return []

  const transformed = []

  transactions.forEach(t => {
    const { commandsList, createdTime } = t.payload.reducedPayload
    const signatures = t.signaturesList.map(x => Buffer.from(x.publicKey, 'base64').toString('hex'))

    commandsList.forEach((c, idx) => {
      if (!c.transferAsset) return

      const {
        amount,
        destAccountId,
        srcAccountId,
        description,
        assetId
      } = c.transferAsset

      const tx = {
        from: match(srcAccountId)
          .on(x => x === accountId, () => 'you')
          .on(x => x === notaryAccount, () => 'notary')
          .otherwise(x => x),
        to: match(destAccountId)
          .on(x => x === accountId, () => 'you')
          .on(x => x === notaryAccount, () => 'notary')
          .otherwise(x => x),
        amount: amount,
        date: createdTime,
        message: description,

        signatures,
        id: idx,
        assetId
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
  return flow(
    uniqWith(isEqual),
    sortBy('date'),
    reverse
  )(transformed)
}

// TODO: extract settlements from raw transactions and return
// TODO: might be able to put together with getTransferAssetsFrom
export function getSettlementsFrom (transactions) {
  if (isEmpty(transactions)) return []

  return DUMMY_SETTLEMENTS
}

// Match function https://codeburst.io/alternative-to-javascripts-switch-statement-with-a-functional-twist-3f572787ba1c
const matched = x => ({
  on: () => matched(x),
  otherwise: () => x
})

const match = x => ({
  on: (pred, fn) => (pred(x) ? matched(fn(x)) : match(x)),
  otherwise: fn => fn(x)
})
