const symbols = {
  USD: '$',
  RUB: '₽',
  EUR: '€'
}

const currencySymbol = {
  computed: {
    currencySymbol () {
      const view = this.$store.getters.settingsView.fiat
      return symbols[view]
    }
  }
}

export default currencySymbol
