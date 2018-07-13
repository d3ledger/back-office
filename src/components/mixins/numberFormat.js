import numbro from 'numbro'

numbro.zeroFormat('N/A')

var dateFormat = {
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
    }
  }
}

export default dateFormat
