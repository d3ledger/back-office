import flow from 'lodash/fp/flow'
import groupBy from 'lodash/fp/groupBy'
import entries from 'lodash/fp/entries'
import map from 'lodash/fp/map'
import values from 'lodash/fp/values'
import sortBy from 'lodash/fp/sortBy'
import pdfMake from 'pdfmake-lite/build/pdfmake.min'
import isWithinRange from 'date-fns/is_within_range'
import isAfter from 'date-fns/is_after'
import startOfDay from 'date-fns/start_of_day'
import endOfDay from 'date-fns/end_of_day'
import isSameDay from 'date-fns/is_same_day'
import { parse as json2csv } from 'json2csv'
import { fontLoader } from './font-util'

pdfMake.vfs = fontLoader.vfs
fontLoader.addFont({URL: 'fonts/Roboto-Regular.ttf', name: 'Roboto-Regular.ttf'})
fontLoader.addFont({URL: 'fonts/Roboto-Italic.ttf', name: 'Roboto-Italic.ttf'})
fontLoader.addFont({URL: 'fonts/Roboto-Medium.ttf', name: 'Roboto-Medium.ttf'})
fontLoader.addFont({URL: 'fonts/Roboto-MediumItalic.ttf', name: 'Roboto-MediumItalic.ttf'})

const debug = require('debug')('report-util')

/**
 * generate PDF blob
 * @param {Object} params
 * @returns {Promise}
 */
export function generatePDF (params) {
  debug('generating PDF output...')

  return fontLoader.load().then(() => new Promise((resolve, reject) => {
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
        { text: `Report (${formatDate(data.dateFrom)} - ${formatDate(data.dateTo)})`, style: 'title' },
        { text: `Account ID: ${data.accountId}` },
        { text: `Wallet: ${data.walletName} (${data.cryptoCurrencyUnit})` },

        { text: `Summary`, style: 'heading1' },
        { text: `Ending Balance: ${data.endingBalance} ${data.cryptoCurrencyUnit}` },
        { text: `Ending Balance in ${data.fiat}: ${data.endingBalanceFiat}` },
        { text: `Starting Balance: ${data.startingBalance} ${data.cryptoCurrencyUnit}` },
        { text: `Starting Balance in ${data.fiat}: ${data.startingBalanceFiat}` },
        { text: `Net Change: ${data.netChange} ${data.cryptoCurrencyUnit}` },
        { text: `Transfers In: ${data.transfersIn} ${data.cryptoCurrencyUnit}` },
        { text: `Transfers Out: ${data.transfersOut} ${data.cryptoCurrencyUnit}` },

        { text: `Transactions By Day`, style: 'heading1' },
        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: ['auto', '*', '*', '*', '*', '*'],
            body: [
              ['Date', 'In', `In (${data.fiat})`, 'Out', `Out (${data.fiat})`, 'Net'],
              ...data.transactionsByDay.map(tx => ([
                formatDate(tx.date),
                tx.dailyIn,
                tx.dailyInFiat,
                tx.dailyOut,
                tx.dailyOutFiat,
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
              ['Time', 'Description', 'Amount', `Amount (${data.fiat})`, 'Balance'],
              ...data.transactionDetails.map(tx => ([
                formatDate(tx.time),
                tx.description,
                tx.amount,
                tx.amountFiat,
                tx.balance
              ]))
            ]
          }
        }
      ]
    }
    const pdfDocGenerator = pdfMake.createPdf(docDefinition)

    pdfDocGenerator.getBlob(blob => {
      debug('successfully generated PDF output')

      resolve({ filename: data.filename, blob })
    })
  }))
}

/**
 * generate CSV blob
 * @param {Object} params
 * @returns {Promise}
 */
export function generateCSV (params) {
  debug('generating CSV output...')

  return new Promise((resolve, reject) => {
    const data = generateReportData.call(this, { ext: 'csv', ...params })
    const dataForCSV = data.transactionDetails.map(tx => ({
      'Time': tx.time,
      'To': tx.to,
      'Amount': tx.amount,
      [`Amount in ${data.fiat}`]: tx.amountFiat,
      'Balance': tx.balance,
      [`Balance in ${data.fiat}`]: tx.balanceFiat,
      'Description': tx.description
    }))
    const fields = ['Time', 'To', 'Amount', `Amount in ${data.fiat}`, 'Balance', `Balance in ${data.fiat}`, 'Description']

    let csv

    try {
      csv = json2csv(dataForCSV, { fields })
    } catch (err) {
      return reject(err)
    }

    const blob = new Blob(
      [csv],
      { type: 'text/csv;charset=utf-8' }
    )

    debug('successfully generated CSV output', csv)

    resolve({ filename: data.filename, blob })
  })
}

/**
 * Generate a report data object
 * @param {Object} params
 * @param {String} params.accountId - e.g. 'alice@test'
 * @param {Object} params.wallet - { name, asset, precision, amount }
 * @param {Object[]} params.transactins - an array of TransferAsset transactions
 * @param {String} params.fiat - e.g. 'RUB'
 * @param {Number} params.priceFiatList - a list of prices *from fiat to crypto*
 * @param {Date} params.dateFrom - start of the range
 * @param {Date} params.dateTo - end of the range
 * @param {String} params.ext - e.g. 'pdf'
 * @param {Function} params.formatDate - a functino to format a date to the specific string
 * @param {Function} params.formatDateWith - a function to format a date to an arbitrary string
 * @returns {Object}
 */
export function generateReportData ({
  accountId,
  wallet,
  transactions,
  priceFiatList,
  dateFrom,
  dateTo,
  ext,
  formatDate,
  formatDateWith,
  fiat
}) {
  /*
   * prepare utility functions
   */
  const sumAmount = (txs) => txs
    .map(tx => parseFloat(tx.amount))
    .reduce((sum, x) => sum + x, 0)
  const isToYou = (tx) => (tx.to === 'you')
  const isFromYou = (tx) => (tx.from === 'you')
  // TODO: fix it
  const getPriceFromFiat = (dateExpected, assetExpected) => {
    return priceFiatList.find(({ date }) => isSameDay(date, dateExpected)).prices[assetExpected]
  }

  /*
   * prepare basic data
   */
  const filename = `report-${wallet.name.toLowerCase()}-${formatDateWith(dateFrom, 'YYYYMMDD')}-${formatDateWith(dateTo, 'YYYYMMDD')}.${ext}`
  const cryptoCurrencyUnit = wallet.asset
  const precision = wallet.precision
  const currentAmount = wallet.amount

  /*
   * split transactions
   */
  const txsWithinRange = transactions.filter(tx => isWithinRange(tx.date, startOfDay(dateFrom), endOfDay(dateTo)))
  const txsAfterRange = transactions.filter(tx => isAfter(tx.date, endOfDay(dateTo)))

  /*
   * calculate figures
   */
  const netChangeAfterRange = txsAfterRange
    .map(tx => (tx.to === 'you') ? +tx.amount : -tx.amount)
    .reduce((sum, x) => sum + x, 0)
  const transfersIn = sumAmount(txsWithinRange.filter(isToYou))
  const transfersOut = sumAmount(txsWithinRange.filter(isFromYou))
  const netChange = transfersIn - transfersOut
  const endingBalance = currentAmount - netChangeAfterRange
  const endingBalanceFiat = endingBalance / getPriceFromFiat(dateTo, cryptoCurrencyUnit)
  const startingBalance = endingBalance - netChange
  const startingBalanceFiat = startingBalance / getPriceFromFiat(dateTo, cryptoCurrencyUnit)

  /*
   * prepare transactionsByDay
   */
  const transactionsByDay = flow(
    groupBy(tx => startOfDay(new Date(tx.date))),
    entries,
    map(([date, txs]) => {
      const dailyIn = sumAmount(txs.filter(isToYou))
      const dailyInFiat = dailyIn / getPriceFromFiat(date, cryptoCurrencyUnit)
      const dailyOut = sumAmount(txs.filter(isFromYou))
      const dailyOutFiat = dailyOut / getPriceFromFiat(date, cryptoCurrencyUnit)
      const dailyNet = dailyIn - dailyOut

      return {
        date: formatDateWith(date, 'MMM. D'),
        dailyIn: dailyIn.toFixed(precision),
        dailyInFiat: dailyInFiat.toFixed(precision),
        dailyOut: dailyOut.toFixed(precision),
        dailyOutFiat: dailyOutFiat.toFixed(precision),
        dailyNet: dailyNet.toFixed(precision)
      }
    }),
    values,
    sortBy('date')
  )(txsWithinRange)

  /*
   * prepare transactionDetails
   */
  let accumulatedAmount = 0
  const transactionDetails = flow(
    sortBy('date'),
    map(tx => {
      const amount = isToYou(tx) ? +tx.amount : -tx.amount
      accumulatedAmount += parseFloat(amount)
      const balance = startingBalance + accumulatedAmount

      return {
        time: formatDate(tx.date),
        to: isToYou(tx) ? 'Received' : tx.to,
        description: tx.message,
        amount: amount.toFixed(precision),
        amountFiat: (amount / getPriceFromFiat(tx.date, cryptoCurrencyUnit)).toFixed(precision),
        balance: balance.toFixed(precision),
        balanceFiat: (balance / getPriceFromFiat(tx.date, cryptoCurrencyUnit)).toFixed(precision)
      }
    })
  )(txsWithinRange)

  transactionDetails.unshift({
    time: formatDate(dateFrom),
    to: null,
    description: 'Starting Balance',
    amount: null,
    amountFiat: null,
    balance: startingBalance.toFixed(precision)
  })

  transactionDetails.push({
    time: formatDate(endOfDay(dateTo)),
    to: null,
    description: 'Ending Balance',
    amount: null,
    amountFiat: null,
    balance: endingBalance.toFixed(precision)
  })

  /*
   * put data together
   */
  const reportData = {
    // metadata
    filename,
    accountId,
    walletName: wallet.name,
    cryptoCurrencyUnit,
    dateFrom,
    dateTo,
    fiat,

    // summary
    endingBalance: endingBalance.toFixed(precision),
    endingBalanceFiat: endingBalanceFiat.toFixed(precision),
    startingBalance: startingBalance.toFixed(precision),
    startingBalanceFiat: startingBalanceFiat.toFixed(precision),
    netChange: netChange.toFixed(precision),
    transfersIn: transfersIn.toFixed(precision),
    transfersOut: transfersOut.toFixed(precision),

    // transactions by day
    transactionsByDay,

    // transaction details
    transactionDetails
  }

  debug('successfully generated reportData', reportData)

  return reportData
}
