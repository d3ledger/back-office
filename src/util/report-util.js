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
import { encode as json2csv } from 'csv.js'
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
    const { formatDate, formatDateWith, formatPrecision } = params
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
        { text: `Ending Balance: ${formatPrecision(data.endingBalance)} ${data.cryptoCurrencyUnit}` },
        { text: `Ending Balance in ${data.fiat}: ${formatPrecision(data.endingBalanceFiat)}` },
        { text: `Starting Balance: ${formatPrecision(data.startingBalance)} ${data.cryptoCurrencyUnit}` },
        { text: `Starting Balance in ${data.fiat}: ${formatPrecision(data.startingBalanceFiat)}` },
        { text: `Net Change: ${formatPrecision(data.netChange)} ${data.cryptoCurrencyUnit}` },
        { text: `Transfers In: ${formatPrecision(data.transfersIn)} ${data.cryptoCurrencyUnit}` },
        { text: `Transfers Out: ${formatPrecision(data.transfersOut)} ${data.cryptoCurrencyUnit}` },

        { text: `Transactions By Day`, style: 'heading1' },
        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: ['auto', '*', '*', '*', '*', '*'],
            body: [
              ['Date', 'In', `In (${data.fiat})`, 'Out', `Out (${data.fiat})`, 'Net'],
              ...data.transactionsByDay.map(tx => ([
                formatDateWith(tx.date, 'MMM. D'),
                formatPrecision(tx.dailyIn),
                formatPrecision(tx.dailyInFiat),
                formatPrecision(tx.dailyOut),
                formatPrecision(tx.dailyOutFiat),
                formatPrecision(tx.dailyNet)
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
                formatPrecision(tx.amount),
                formatPrecision(tx.amountFiat),
                formatPrecision(tx.balance)
              ]))
            ]
          }
        }
      ]
    }

    // do not create PDF in headless e2e testing environment
    if (window.Cypress) {
      return resolve({ filename: data.filename })
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
      'Time': tx.time.replace(',', ''),
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
      csv = json2csv(dataForCSV, ',', fields)
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
 * @param {Array} params.priceFiatList - a list of prices *from fiat to crypto*
 * @param {Number} params.priceFiatList[].price
 * @param {Number} params.priceFiatList[].date
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
  const getDailyPriceFiat = (dateExpected) => {
    return priceFiatList.find(({ date }) => isSameDay(date, dateExpected)).price
  }
  const formatDateWithYear = (date) => formatDateWith(date, 'MMM. D, YYYY HH:mm')

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
  const endingBalanceFiat = endingBalance / getDailyPriceFiat(dateTo)
  const startingBalance = endingBalance - netChange
  const startingBalanceFiat = startingBalance / getDailyPriceFiat(dateTo)

  /*
   * prepare transactionsByDay
   */
  const transactionsByDay = flow(
    groupBy(tx => startOfDay(new Date(tx.date))),
    entries,
    map(([date, txs]) => {
      const dailyIn = sumAmount(txs.filter(isToYou))
      const dailyInFiat = dailyIn / getDailyPriceFiat(date)
      const dailyOut = sumAmount(txs.filter(isFromYou))
      const dailyOutFiat = dailyOut / getDailyPriceFiat(date)
      const dailyNet = dailyIn - dailyOut

      return {
        date: formatDateWithYear(date),
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
        // Year is needed even though the year doesn't appear in an output.
        // In Moscow timezone, for example:
        // a date omitting an year like `Sep 01 12:34` will be treated as
        // `Sep 01 2001 12:34`, which applies Moscow Summer Time which is not
        // used today and generates wrong results.
        time: formatDateWithYear(tx.date),
        to: isToYou(tx) ? 'Received' : tx.to,
        description: tx.message,
        amount: amount.toFixed(precision),
        amountFiat: (amount / getDailyPriceFiat(tx.date)).toFixed(precision),
        balance: balance.toFixed(precision),
        balanceFiat: (balance / getDailyPriceFiat(tx.date)).toFixed(precision)
      }
    })
  )(txsWithinRange)

  transactionDetails.unshift({
    time: formatDateWithYear(dateFrom),
    to: null,
    description: 'Starting Balance',
    amount: '',
    amountFiat: '',
    balance: startingBalance.toFixed(precision),
    balanceFiat: (startingBalance / getDailyPriceFiat(dateFrom)).toFixed(precision)
  })

  transactionDetails.push({
    time: formatDateWithYear(dateTo),
    to: null,
    description: 'Ending Balance',
    amount: '',
    amountFiat: '',
    balance: endingBalance.toFixed(precision),
    balanceFiat: (startingBalance / getDailyPriceFiat(dateTo)).toFixed(precision)
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
