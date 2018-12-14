const symbols = {
  USD: '$',
  RUB: '₽',
  EUR: '€'
}

const currencySymbol = {
  methods: {
    assetName (assetId) {
      const wallet = this.$store.getters.wallets.find(w => w.assetId === assetId) || {}
      return wallet.asset
    }
  },
  computed: {
    currencySymbol () {
      const view = this.$store.getters.settingsView.fiat
      return symbols[view]
    }
  }
}

export default currencySymbol
