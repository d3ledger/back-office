import _ from 'lodash'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import { isWithinRange, isAfter, startOfDay, endOfDay } from 'date-fns'
import { parse as json2csv } from 'json2csv'

pdfMake.vfs = pdfFonts.pdfMake.vfs

export function generatePDF (params) {
  return new Promise((resolve, reject) => {
    const formatDate = params.formatDate
    const data = generateReportData.call(this, { ext: 'pdf', ...params })
    const docDefinition = {
      info: {
        title: `report`,
        creationDate: new Date()
      },

      styles: {
        title: { fontSize: 24, margin: [0, 0, 0, 10] },
        heading1: { fontSize: 22, bold: true, margin: [0, 10, 0, 5] }
      },

      content: [
        { text: `Report (${data.dateFrom} - ${data.dateTo})`, style: 'title' },
        { text: `Account ID: ${data.accountId}` },
        { text: `Wallet: ${data.walletName} (${data.cryptoCurrencyUnit})` },

        { text: `Summary`, style: 'heading1' },
        { text: `Ending Balance: ${data.endingBalance} ${data.cryptoCurrencyUnit}` },
        { text: `Ending Balance in USD: ${data.endingBalanceUSD}` },
        { text: `Starting Balance: ${data.startingBalance} ${data.cryptoCurrencyUnit}` },
        { text: `Starting Balance in USD: ${data.startingBalanceUSD}` },
        { text: `Net Change: ${data.netChange} ${data.cryptoCurrencyUnit}` },
        { text: `Transfers In: ${data.transfersIn} ${data.cryptoCurrencyUnit}` },
        { text: `Transfers Out: ${data.transfersOut} ${data.cryptoCurrencyUnit}` },

        { text: `Transactions By Day`, style: 'heading1' },
        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*', '*', '*'],
            body: [
              ['Date', 'In', 'In (USD)', 'Out', 'Out (USD)', 'Net'],
              ...data.transactionsByDay.map(tx => ([
                formatDate(tx.date),
                tx.dailyIn,
                tx.dailyInUSD,
                tx.dailyOut,
                tx.dailyOutUSD,
                tx.dailyNet
              ]))
            ]
          }
        },

        { text: `Transaction Details`, style: 'heading1' },
        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: ['auto', '*', 'auto', 'auto', 'auto'],
            body: [
              ['Time', 'Description', 'Amount', 'Amount (USD)', 'Balance'],
              ...data.transactionDetails.map(tx => ([
                formatDate(tx.time),
                tx.description,
                tx.amount,
                tx.amountUSD,
                tx.balance
              ]))
            ]
          }
        }
      ]
    }
    const pdfDocGenerator = pdfMake.createPdf(docDefinition)

    // TODO: for testing
    pdfDocGenerator.open()

    pdfDocGenerator.getBlob(blob => {
      resolve({ filename: data.filename, blob })
    })
  })
}

export function generateCSV (params) {
  return new Promise((resolve, reject) => {
    const data = generateReportData.call(this, { ext: 'csv', ...params })
    const dataForCSV = data.transactionDetails.map(tx => ({
      'Time': tx.time,
      'To': tx.to,
      'Amount': tx.amount,
      'Amount in USD': tx.amountUSD,
      'Balance': tx.balance,
      'Balance in USD': tx.balanceUSD,
      'Description': tx.description
    }))
    const fields = ['Time', 'To', 'Amount', 'Amount in USD', 'Balance', 'Balance in USD', 'Description']

    let csv

    try {
      csv = json2csv(dataForCSV, { fields })
    } catch (err) {
      return reject(err)
    }

    console.log(csv)

    const blob = new Blob(
      [csv],
      { type: 'text/csv;charset=utf-8' }
    )

    resolve({ filename: data.filename, blob })
  })
}

/**
 * Generate a report data object
 * @param {Object} params
 * @returns {Object}
 */
export function generateReportData ({
  accountId,
  wallet,
  transactions,
  priceUSD,
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

  const cryptoCurrencyUnit = wallet.asset
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
  const endingBalanceUSD = endingBalance * priceUSD
  const startingBalance = endingBalance - netChange
  const startingBalanceUSD = startingBalance * priceUSD
  const transactionsByDay = _(txsWithinRange)
    .groupBy(tx => startOfDay(new Date(tx.date)))
    .map((txs, date) => {
      const dailyIn = sumAmount(txs.filter(isToYou))
      const dailyInUSD = dailyIn * priceUSD
      const dailyOut = sumAmount(txs.filter(isFromYou))
      const dailyOutUSD = dailyOut * priceUSD
      const dailyNet = dailyIn - dailyOut

      return {
        date: formatDateWith(date, 'MMM. D'),
        dailyIn: dailyIn.toFixed(precision),
        dailyInUSD: dailyInUSD.toFixed(precision),
        dailyOut: dailyOut.toFixed(precision),
        dailyOutUSD: dailyOutUSD.toFixed(precision),
        dailyNet: dailyNet.toFixed(precision)
      }
    })
    .values()
    .sortBy('date')
    .value()

  let accumulatedAmount = 0
  const transactionDetails = _(txsWithinRange)
    .sortBy('date')
    .map(tx => {
      const amount = isToYou(tx) ? +tx.amount : -tx.amount
      accumulatedAmount += parseFloat(amount)
      const balance = startingBalance + accumulatedAmount

      return {
        time: formatDate(tx.date),
        to: isToYou(tx) ? 'Received' : tx.to,
        description: tx.message,
        amount: amount.toFixed(precision),
        amountUSD: (amount * priceUSD).toFixed(precision),
        balance: balance.toFixed(precision),
        balanceUSD: (balance * priceUSD).toFixed(precision)
      }
    })
    .value()

  transactionDetails.unshift({
    time: formatDate(dateFrom),
    to: null,
    description: 'Starting Balance',
    amount: null,
    amountUSD: null,
    balance: startingBalance.toFixed(precision)
  })

  transactionDetails.push({
    time: formatDate(endOfDay(dateTo)),
    to: null,
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
    cryptoCurrencyUnit,
    dateFrom,
    dateTo,

    // summary
    endingBalance: endingBalance.toFixed(precision),
    endingBalanceUSD: endingBalanceUSD.toFixed(precision),
    startingBalance: startingBalance.toFixed(precision),
    startingBalanceUSD: startingBalanceUSD.toFixed(precision),
    netChange: netChange.toFixed(precision),
    transfersIn: transfersIn.toFixed(precision),
    transfersOut: transfersOut.toFixed(precision),

    // transactions by day
    transactionsByDay,

    // transaction details
    transactionDetails
  }

  console.log(reportData)

  return reportData
}
