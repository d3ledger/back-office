/*
 * Copyright D3 Ledger, Inc. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// TODO: We should make refactoring of this file, because we have a lot of code duplications
import flow from 'lodash/fp/flow'
import isEmpty from 'lodash/fp/isEmpty'
import isEqual from 'lodash/fp/isEqual'
import uniqWith from 'lodash/fp/uniqWith'
import sortBy from 'lodash/fp/sortBy'
import reverse from 'lodash/fp/reverse'
import groupBy from 'lodash/fp/groupBy'
import filter from 'lodash/fp/filter'
import values from 'lodash/fp/values'
import map from 'lodash/fp/map'
import chunk from 'lodash/fp/chunk'
import cloneDeep from 'lodash/fp/cloneDeep'
import { FeeTypes, NOTARY_ACCOUNT, BTC_WITHDRAWAL } from '@/data/consts'

export function getTransferAssetsFrom (transactions, accountId, settlements = []) {
  if (isEmpty(transactions)) return []
  const transformed = []

  transactions.forEach((t, idx) => {
    const batch = t.payload.batch
    const { commandsList, createdTime } = t.payload.reducedPayload
    const transferAssetCommands = commandsList.filter(({ transferAsset }) => transferAsset)
    const signatures = t.signaturesList.map(x => Buffer.from(x.publicKey, 'hex').toString('hex'))
    let fee = 0

    transferAssetCommands.forEach(
      ({ transferAsset }) => {
        const {
          amount,
          destAccountId,
          srcAccountId,
          description,
          assetId
        } = transferAsset
        const [, domain] = srcAccountId.split('@')

        if (
          (destAccountId !== accountId) &&
          (srcAccountId !== accountId)
        ) return

        if (
          destAccountId === `${FeeTypes.TRANSFER}@${domain}` ||
          destAccountId === `${FeeTypes.EXCHANGE}@${domain}`
        ) {
          if (srcAccountId === accountId) {
            fee = amount
          }
        } else {
          const tx = {
            from: match(srcAccountId)
              .on(x => x === accountId, () => 'you')
              .on(x => x === NOTARY_ACCOUNT, () => 'notary')
              .on(x => x === BTC_WITHDRAWAL, () => 'btc_withdrawal_service')
              .otherwise(x => x),
            to: match(destAccountId)
              .on(x => x === accountId, () => 'you')
              .on(x => x === NOTARY_ACCOUNT, () => 'notary')
              .on(x => x === BTC_WITHDRAWAL, () => 'btc_withdrawal_service')
              .otherwise(x => x),
            amount: amount,
            date: createdTime,
            message: description,
            batch,
            signatures,
            id: idx,
            assetId,
            fee
          }
          fee = 0
          const settlement = findSettlementByBatch(tx, settlements)
          if (settlement) {
            transformed.push(settlement)
          } else {
            transformed.push(tx)
          }
        }
      }
    )
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

// TODO: think about to use hashMap
export function getSettlementsFrom (transactions, accountId) {
  if (isEmpty(transactions)) return []
  let txIndex = 0

  const settlements = flow([
    filter(tr => tr.payload.batch),
    map(tr => {
      const commands = []
      const { commandsList, createdTime, quorum } = tr.payload.reducedPayload
      const batch = tr.payload.batch
      const signatures = tr.signaturesList.map(x => Buffer.from(x.publicKey, 'base64').toString('hex'))
      let fee = 0
      commandsList.forEach(c => {
        if (!c.transferAsset) return
        const {
          amount,
          destAccountId,
          srcAccountId,
          description,
          assetId
        } = c.transferAsset

        const [, domain] = srcAccountId.split('@')

        if (destAccountId === `${FeeTypes.EXCHANGE}@${domain}`) {
          fee = amount
        } else {
          const tx = {
            txId: txIndex,
            from: srcAccountId,
            to: destAccountId,
            amount: amount,
            date: createdTime,
            message: description,
            signatures,
            assetId,
            fee,
            batch,
            quorum
          }
          fee = 0
          txIndex += 1

          commands.push(tx)
        }
      })
      if (commands.length > 1) return
      return commands[0]
    }),
    groupBy(tr => tr.batch.reducedHashesList),
    values,
    map(tr => {
      let from = {}
      let to = {}
      tr.forEach(obj => { obj.to === accountId ? to = obj : from = obj })
      return { from, to }
    }),
    filter(tr => tr.from.from),
    sortBy(tr => tr.from.date)
  ])(transactions)
  return settlements
}

export function getSettlementsRawPair (transactions) {
  if (isEmpty(transactions)) return []
  // convert elements to pairs by two elements in pair
  const settlements = chunk(2)(transactions.getTransactionsList())
  return settlements
}

export function findBatchFromRaw (rawUnsignedTransactions, settlement) {
  let rawUnsignedTransactionsCopy = cloneDeep(rawUnsignedTransactions)
  const rawPairs = getSettlementsRawPair(rawUnsignedTransactionsCopy)
  let batch = rawPairs.find(tr => {
    return isEqual(tr[0].toObject().payload.batch, settlement) || isEqual(tr[1].toObject().payload.batch, settlement)
  }) || []
  return batch
}

function findSettlementByBatch (tx, settlements) {
  const s = filter(
    s => isEqual(s.from.batch)(tx.batch)
  )(settlements)
  return s[0]
}

export function getSettingsTransactionsFrom (transactions, account) {
  if (isEmpty(transactions)) return []
  const transformed = []

  transactions.forEach((t, idx) => {
    const batch = t.payload.batch
    const { commandsList, createdTime } = t.payload.reducedPayload
    const signatures = t.signaturesList.map(x => Buffer.from(x.publicKey, 'hex').toString('hex'))

    commandsList.forEach(c => {
      let tx
      if (c.setAccountDetail) {
        const {
          key,
          value
        } = c.setAccountDetail
        let type = ''
        let description = ''

        switch (key) {
          case 'eth_whitelist': {
            type = 'ETH whitlist'
            description = `New whitelist: ${JSON.parse(value.replace(/\\/g, '')).join(', ')}`
            break
          }
          case 'btc_whitelist': {
            type = 'BTC whitelist'
            description = `New whitelist: ${JSON.parse(value.replace(/\\/g, '')).join(', ')}`
            break
          }
          case 'notifications': {
            if (key === 'true') {
              type = 'Enable notifications'
            } else {
              type = 'Disable notifications'
            }
            break
          }
          case 'email': {
            type = 'Set notification email'
            description = value
            break
          }
        }

        tx = {
          type,
          description,
          date: createdTime,
          batch,
          signatures,
          id: idx
        }
      } else if (c.addSignatory) {
        const {
          publicKey
        } = c.addSignatory

        tx = {
          type: 'Add signatory',
          description: publicKey,
          date: createdTime,
          batch,
          signatures,
          id: idx
        }
      } else if (c.removeSignatory) {
        const {
          publicKey
        } = c.removeSignatory

        tx = {
          type: 'Remove signatory',
          description: publicKey,
          date: createdTime,
          batch,
          signatures,
          id: idx
        }
      }
      if (tx) {
        transformed.push(tx)
      }
    })
  })

  return flow(
    uniqWith(isEqual),
    sortBy('date'),
    reverse
  )(transformed)
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
