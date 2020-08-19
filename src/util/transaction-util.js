/*
 * Copyright D3 Ledger, Inc. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import {
  txHelper
} from 'iroha-helpers'
import Transaction from 'iroha-helpers/lib/proto/transaction_pb'
import TxList from 'iroha-helpers/lib/proto/endpoint_pb'
import format from 'date-fns/format'
import FileSaver from 'file-saver'

function createCommand (commandName, params) {
  const tx = txHelper.addCommand(
    txHelper.emptyTransaction(),
    commandName,
    {
      ...params
    }
  )
  return tx
}

function transactionToBinary (tx) {
  return tx.serializeBinary()
}

function binaryToTransaction (bytes) {
  return Transaction.Transaction.deserializeBinary(bytes)
}

function binaryToTxList (bytes) {
  return TxList.TxList.deserializeBinary(bytes)
}

function saveTransaction (tx) {
  const date = format(new Date(), 'MM-DD-YYYY-HH-mm-ss')
  const filename = `D3-Transaction-${date}.draft`
  const binaryArray = transactionToBinary(tx)
  FileSaver.saveAs(new Blob([binaryArray]), filename)
}

export default {
  createCommand,
  transactionToBinary,
  binaryToTransaction,
  binaryToTxList,
  saveTransaction
}
