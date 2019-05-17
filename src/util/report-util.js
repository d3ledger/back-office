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
fontLoader.addFont({ URL: 'fonts/Roboto-Regular.ttf', name: 'Roboto-Regular.ttf' })
fontLoader.addFont({ URL: 'fonts/Roboto-Italic.ttf', name: 'Roboto-Italic.ttf' })
fontLoader.addFont({ URL: 'fonts/Roboto-Medium.ttf', name: 'Roboto-Medium.ttf' })
fontLoader.addFont({ URL: 'fonts/Roboto-MediumItalic.ttf', name: 'Roboto-MediumItalic.ttf' })

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
        title: { fontSize: 20, margin: [0, 0, 0, 10] },
        heading1: { fontSize: 22, bold: true, margin: [0, 10, 0, 5] },
        heading2: { fontSize: 20, bold: true, margin: [0, 10, 0, 5] },
        logo: { alignment: 'center', margin: [0, 0, 0, 25] }
      },

      content: [
        { image: REPORT_LOGO, width: 200, style: 'logo' },
        { text: `Report (${formatDateWith(data.dateFrom, 'MMM. D YYYY HH:mm')} - ${formatDateWith(data.dateTo, 'MMM. D YYYY HH:mm')})`, style: 'title' },
        { text: `Account ID: ${data.accountId}` },
        { text: `Wallet: ${data.walletName} (${data.cryptoCurrencyUnit})`, style: 'heading1' },

        { text: `Summary`, style: 'heading2' },
        { text: `Ending Balance: ${formatPrecision(data.endingBalance)} ${data.cryptoCurrencyUnit}` },
        { text: `Ending Balance in ${data.fiat}: ${formatPrecision(data.endingBalanceFiat)}` },
        { text: `Starting Balance: ${formatPrecision(data.startingBalance)} ${data.cryptoCurrencyUnit}` },
        { text: `Starting Balance in ${data.fiat}: ${formatPrecision(data.startingBalanceFiat)}` },
        { text: `Net Change: ${formatPrecision(data.netChange)} ${data.cryptoCurrencyUnit}` },
        { text: `Transfers In: ${formatPrecision(data.transfersIn)} ${data.cryptoCurrencyUnit}` },
        { text: `Transfers Out: ${formatPrecision(data.transfersOut)} ${data.cryptoCurrencyUnit}` },

        { text: `Transactions By Day`, style: 'heading2' },
        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: ['15%', '17%', '17%', '17%', '17%', '17%'],
            body: [
              ['Date', 'In', `In (${data.fiat})`, 'Out', `Out (${data.fiat})`, 'Net'],
              ...data.transactionsByDay.map(tx => ([
                tx.date,
                formatPrecision(tx.dailyIn),
                formatPrecision(tx.dailyInFiat),
                formatPrecision(tx.dailyOut),
                formatPrecision(tx.dailyOutFiat),
                formatPrecision(tx.dailyNet)
              ]))
            ]
          }
        },

        { text: `Transaction Details`, style: 'heading2' },
        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: ['15%', '40%', '45%'],
            body: [
              ['Time', 'Description', 'Information'],
              ...data.transactionDetails.map(tx => ([
                formatDate(tx.time),
                tx.description,
                formatInformation(
                  formatPrecision(tx.amount),
                  formatPrecision(tx.amountFiat),
                  data.fiat,
                  formatPrecision(tx.balance)
                )
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
    const { formatDateWith } = params
    const dataForCSV = data.transactionDetails.map(tx => ({
      'Time': formatDateWith(tx.time, 'MMM. D YYYY HH:mm'),
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

export function generateMultiplePDF (data) {
  debug('generating PDF output...')
  const dateFrom = data[0].dateFrom
  const dateTo = data[0].dateTo
  const formatDateWith = data[0].formatDateWith
  const accountId = data[0].accountId
  const docDefinition = {
    info: {
      title: `report`,
      creationDate: new Date()
    },

    styles: {
      title: { fontSize: 20, margin: [0, 0, 0, 10] },
      heading1: { fontSize: 22, bold: true, margin: [0, 10, 0, 5] },
      heading2: { fontSize: 20, bold: true, margin: [0, 10, 0, 5] },
      logo: { alignment: 'center', margin: [0, 0, 0, 25] }
    },

    content: [
      { image: REPORT_LOGO, width: 200, style: 'logo' },
      { text: `Report (${formatDateWith(dateFrom, 'MMM. D YYYY HH:mm')} - ${formatDateWith(dateTo, 'MMM. D YYYY HH:mm')})`, style: 'title' },
      { text: `Account ID: ${accountId}` }
    ]
  }

  data.forEach(params => {
    const { formatDate, formatPrecision } = params
    const data = generateReportData.call(this, { ext: 'pdf', ...params })
    const walletDefinition = [
      { text: `Wallet: ${data.walletName} (${data.cryptoCurrencyUnit})`, style: 'heading1' },

      { text: `Summary`, style: 'heading2' },
      { text: `Ending Balance: ${formatPrecision(data.endingBalance)} ${data.cryptoCurrencyUnit}` },
      { text: `Ending Balance in ${data.fiat}: ${formatPrecision(data.endingBalanceFiat)}` },
      { text: `Starting Balance: ${formatPrecision(data.startingBalance)} ${data.cryptoCurrencyUnit}` },
      { text: `Starting Balance in ${data.fiat}: ${formatPrecision(data.startingBalanceFiat)}` },
      { text: `Net Change: ${formatPrecision(data.netChange)} ${data.cryptoCurrencyUnit}` },
      { text: `Transfers In: ${formatPrecision(data.transfersIn)} ${data.cryptoCurrencyUnit}` },
      { text: `Transfers Out: ${formatPrecision(data.transfersOut)} ${data.cryptoCurrencyUnit}` },

      { text: `Transactions By Day`, style: 'heading2' },
      {
        layout: 'lightHorizontalLines',
        table: {
          headerRows: 1,
          widths: ['15%', '17%', '17%', '17%', '17%', '17%'],
          body: [
            ['Date', 'In', `In (${data.fiat})`, 'Out', `Out (${data.fiat})`, 'Net'],
            ...data.transactionsByDay.map(tx => ([
              tx.date,
              formatPrecision(tx.dailyIn),
              formatPrecision(tx.dailyInFiat),
              formatPrecision(tx.dailyOut),
              formatPrecision(tx.dailyOutFiat),
              formatPrecision(tx.dailyNet)
            ]))
          ]
        }
      },

      { text: `Transaction Details`, style: 'heading2' },
      {
        layout: 'lightHorizontalLines',
        table: {
          headerRows: 1,
          widths: ['15%', '40%', '45%'],
          body: [
            ['Time', 'Description', 'Information'],
            ...data.transactionDetails.map(tx => ([
              formatDate(tx.time),
              tx.description,
              formatInformation(
                formatPrecision(tx.amount),
                formatPrecision(tx.amountFiat),
                data.fiat,
                formatPrecision(tx.balance)
              )
            ]))
          ]
        }
      }
    ]

    docDefinition.content.push(walletDefinition)
  })

  return fontLoader
    .load()
    .then(_ => new Promise((resolve, reject) => {
      const pdfDocGenerator = pdfMake.createPdf(docDefinition)

      pdfDocGenerator.getBlob(blob => {
        debug('successfully generated PDF output')
        resolve({ blob })
      })
    }))
}

export function generateMultipleCSV (data) {
  const dataForCSV = []

  data.forEach(params => {
    const data = generateReportData.call(this, { ext: 'csv', ...params })
    const { formatDateWith } = params
    dataForCSV.push(
      data.transactionDetails.map(tx => {
        return {
          'Asset': params.wallet.asset,
          'Time': formatDateWith(tx.time, 'MMM. D YYYY HH:mm'),
          'To': tx.to,
          'Amount': tx.amount,
          [`Amount in ${data.fiat}`]: tx.amountFiat,
          'Balance': tx.balance,
          [`Balance in ${data.fiat}`]: tx.balanceFiat,
          'Description': tx.description
        }
      })
    )
  })

  let csv

  try {
    csv = json2csv(dataForCSV, ',', false)
  } catch (err) {
    throw err
  }

  const blob = new Blob(
    [csv],
    { type: 'text/csv;charset=utf-8' }
  )

  debug('successfully generated CSV output', csv)

  return Promise.resolve({ blob })
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
    const dateFiat = priceFiatList.find(({ date }) => isSameDay(date, dateExpected))
    return dateFiat ? dateFiat.price : 0
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
  const changeAccountNameToYou = tr => {
    if (tr.from) {
      tr.from = tr.from === accountId ? 'you' : tr.from
    }
    if (tr.to) {
      tr.to = tr.to === accountId ? 'you' : tr.to
    }

    return tr
  }
  const divideSettlement = st => {
    if (typeof st.from === 'string') {
      return [st]
    }
    return [
      changeAccountNameToYou(st.from),
      changeAccountNameToYou(st.to)
    ]
  }

  const transactionsWithSettlements = transactions
    .reduce((trs, current) => trs.concat(divideSettlement(current)), [])
    .filter(tr => tr.assetId === wallet.assetId)
  const txsWithinRange = transactionsWithSettlements.filter(tx => isWithinRange(tx.date, startOfDay(dateFrom), endOfDay(dateTo)))
  const txsAfterRange = transactionsWithSettlements.filter(tx => isAfter(tx.date, endOfDay(dateTo)))
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
  const endingBalanceFiat = endingBalance * getDailyPriceFiat(dateTo)
  const startingBalance = endingBalance - netChange
  const startingBalanceFiat = startingBalance * getDailyPriceFiat(dateTo)

  /*
   * prepare transactionsByDay
   */
  const transactionsByDay = flow(
    groupBy(tx => startOfDay(new Date(tx.date))),
    entries,
    map(([date, txs]) => {
      const dailyIn = sumAmount(txs.filter(isToYou))
      const dailyInFiat = dailyIn * getDailyPriceFiat(date)
      const dailyOut = sumAmount(txs.filter(isFromYou))
      const dailyOutFiat = dailyOut * getDailyPriceFiat(date)
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
        // Year is needed even though the year doesn't appear in an output.
        // In Moscow timezone, for example:
        // a date omitting an year like `Sep 01 12:34` will be treated as
        // `Sep 01 2001 12:34`, which applies Moscow Summer Time which is not
        // used today and generates wrong results.
        time: tx.date,
        to: isToYou(tx) ? 'Received' : tx.to,
        description: tx.message,
        amount: amount.toFixed(precision),
        amountFiat: (amount * getDailyPriceFiat(tx.date)).toFixed(precision),
        balance: balance.toFixed(precision),
        balanceFiat: (balance * getDailyPriceFiat(tx.date)).toFixed(precision)
      }
    })
  )(txsWithinRange)
  transactionDetails.unshift({
    time: (new Date(dateFrom)).getTime(),
    to: null,
    description: 'Starting Balance',
    amount: '',
    amountFiat: '',
    balance: startingBalance.toFixed(precision),
    balanceFiat: (startingBalance * getDailyPriceFiat(dateFrom)).toFixed(precision)
  })

  transactionDetails.push({
    time: (new Date(dateTo)).getTime(),
    to: null,
    description: 'Ending Balance',
    amount: '',
    amountFiat: '',
    balance: endingBalance.toFixed(precision),
    balanceFiat: (startingBalance * getDailyPriceFiat(dateTo)).toFixed(precision)
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

function formatInformation (amount, amountFiat, fiat, balance) {
  return `${
    amount ? `Amount: ${amount}\n` : ''
  }${
    amount ? `Amount (${fiat}): ${amountFiat}\n` : ''
  }Balance: ${balance}`
}

const REPORT_LOGO = 'data:image/png;base64,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'
