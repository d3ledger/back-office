/*
 * Copyright D3 Ledger, Inc. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import numbro from 'numbro'
import BigNumber from 'bignumber.js'

const dateFormat = {
  filters: {
    formatNumberShort: value => numbro(value).format({
      mantissa: 2,
      average: true
    }),
    formatNumberLong: value => numbro(value).format({
      mantissa: 2,
      thousandSeparated: true
    }),
    formatPercent: value => {
      const nP = numbro(value).format({
        mantissa: 2,
        average: true,
        forceSign: true
      })
      return `${nP}%`
    },
    formatNumberPercentDiff: value => {
      const nV = numbro(value.diff).format({
        mantissa: 2,
        average: true,
        forceSign: true,
        spaceSeparated: true
      })
      const nP = numbro(value.percent).format({
        mantissa: 2,
        average: true,
        forceSign: true
      })
      return `${nV} (${nP}%)`
    },
    formatPrecision: value => {
      const removeZeros = (v) => v.replace(/0+$/, '')
      const arrRepOfValue = `${value}`.split('.')
      const beforeDecimal = arrRepOfValue[0]
      const afterDecimal = removeZeros(arrRepOfValue[1] || '')
      const format = afterDecimal.length ? `.${afterDecimal}` : ''
      return `${beforeDecimal}${format}`
    }
  },
  methods: {
    /**
     * This function returns correct fee based on asset precision.
     * @param {Number | Null} amount
     * @param {Number} fee
     * @param {Number} assetPrecision
     * @returns {Number} Current fee or minimum available precision as fee
     */
    $_calculateFee: (amount, fee, assetPrecision) => BigNumber(amount || 0)
      .multipliedBy(fee)
      .decimalPlaces(assetPrecision, BigNumber.ROUND_UP)
  }
}

export default dateFormat
