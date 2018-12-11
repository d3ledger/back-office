import numbro from 'numbro'

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
    },
    satoshiToBtc: (value, assetId) => {
      console.log(value)
      if (assetId === 'btc#bitcoin') {
        return (value * 0.00000001).toFixed(8)
      }

      return value
    },
    btcToSatoshi: (value, assetId) => {
      if (assetId === 'btc#bitcoin') {
        return (value * 100000000).toFixed(0)
      }
      return value
    }
  }
}

export default dateFormat
