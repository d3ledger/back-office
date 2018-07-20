import _ from 'lodash'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import { isWithinRange, isAfter, startOfDay, endOfDay } from 'date-fns'

pdfMake.vfs = pdfFonts.pdfMake.vfs

export function generatePDF (params) {
  return new Promise((resolve, reject) => {
    const reportData = generateReportData.call(this, { ext: 'pdf', ...params })
    const content = JSON.stringify(reportData, null, '  ')
    const docDefinition = {
      content
    }
    const pdfDocGenerator = pdfMake.createPdf(docDefinition)

    pdfDocGenerator.getBlob(blob => {
      resolve({ filename: reportData.filename, blob })
    })
  })
}

export function generateCSV (params) {
  return new Promise((resolve, reject) => {
    const reportData = generateReportData.call(this, { ext: 'csv', ...params })
    const content = JSON.stringify(reportData, null, '  ')
    const blob = new Blob(
      [content],
      { type: 'text/csv;charset=utf-8' }
    )

    resolve({ filename: reportData.filename, blob })
  })
}

export function generateReportData ({
  accountId,
  wallet,
  transactions,
  dateFrom,
  dateTo,
  ext,
  formatDate,
  formatDateWith
}) {
  const sumAmount = (txs) => txs
    .map(tx => parseFloat(tx.amount))
    .reduce((sum, x) => sum + x, 0)
  const isToYou = (tx) => (tx.to === 'you')
  const isFromYou = (tx) => (tx.from === 'you')

  const filename = `report-${formatDateWith(dateFrom, 'YYYYMMDD')}-${formatDateWith(dateTo, 'YYYYMMDD')}.${ext}`

  const currencyAbbr = wallet.asset
  const precision = wallet.precision
  const currentAmount = wallet.amount

  const txsWithinRange = transactions.filter(tx => isWithinRange(tx.date, startOfDay(dateFrom), endOfDay(dateTo)))
  const txsAfterRange = transactions.filter(tx => isAfter(tx.date, endOfDay(dateTo)))
  const netChangeAfterRange = txsAfterRange
    .map(tx => (tx.to === 'you') ? +tx.amount : -tx.amount)
    .reduce((sum, x) => sum + x, 0)
  const transfersIn = sumAmount(txsWithinRange.filter(isToYou))
  const transfersOut = sumAmount(txsWithinRange.filter(isFromYou))
  const netChange = transfersIn - transfersOut
  const endingBalance = currentAmount - netChangeAfterRange
  // TODO:
  const endingBalanceUSD = null
  const startingBalance = endingBalance - netChange
  // TODO:
  const startingBalanceUSD = null
  // TODO:
  const transactionsByDay = _(txsWithinRange)
    .groupBy(tx => formatDateWith(tx.date, 'YYYYMMDD'))
    .map((txs, date) => {
      const dailyIn = sumAmount(txs.filter(isToYou))
      // TODO:
      const dailyInUSD = null
      const dailyOut = sumAmount(txs.filter(isFromYou))
      // TODO:
      const dailyOutUSD = null
      const dailyNet = dailyIn - dailyOut

      return {
        date,
        dailyIn: dailyIn.toFixed(precision),
        dailyInUSD,
        dailyOut: dailyOut.toFixed(precision),
        dailyOutUSD,
        dailyNet: dailyNet.toFixed(precision)
      }
    })
    .value()

  let accumulatedAmount = 0
  const transactionsDetails = _(txsWithinRange)
    .map(tx => {
      accumulatedAmount += parseFloat(tx.amount)

      const balance = startingBalance + accumulatedAmount

      return {
        time: formatDate(tx.date),
        description: tx.message,
        amount: tx.amount,
        // TODO:
        amountUSD: null,
        balance: balance.toFixed(precision)
      }
    })
    .sortBy('time')
    .value()

  transactionsDetails.unshift({
    time: formatDate(dateFrom),
    description: 'Starting Balance',
    amount: null,
    amountUSD: null,
    balance: startingBalance.toFixed(precision)
  })

  transactionsDetails.push({
    time: formatDate(endOfDay(dateTo)),
    description: 'Ending Balance',
    amount: null,
    amountUSD: null,
    balance: endingBalance.toFixed(precision)
  })

  const reportData = {
    // metadata
    filename,
    accountId,
    walletName: wallet.name,
    currencyAbbr,
    dateFrom,
    dateTo,

    // summary
    endingBalance: endingBalance.toFixed(precision),
    endingBalanceUSD,
    startingBalance: startingBalance.toFixed(precision),
    startingBalanceUSD,
    netChange: netChange.toFixed(precision),
    transfersIn: transfersIn.toFixed(precision),
    transfersOut: transfersOut.toFixed(precision),

    // transactions by day
    transactionsByDay,

    // transaction details
    transactionsDetails
  }

  console.log(reportData)

  return reportData
}
