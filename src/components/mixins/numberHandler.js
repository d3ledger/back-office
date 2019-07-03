import BigNumber from 'bignumber.js'

const numberHandler = {
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

export default numberHandler
