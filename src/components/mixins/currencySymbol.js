const symbols = {
  USD: '$',
  RUB: '₽',
  EUR: '€'
}

const currencySymbol = {
  computed: {
    getSymbol () {
      const view = this.$store.getters.settingsView.fiat
      return symbols[view]
    }
  }
}

export default currencySymbol
