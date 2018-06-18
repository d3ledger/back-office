<template>
  <div style="display: flex; fled-direction: row;">
    <div class="column-fullheight wallets-menu">
      <wallet-card
        v-for="wallet in wallets"
        :key="wallet.name"
        :walletId="wallet.id"
        :name="wallet.name"
        :asset="wallet.asset"
      />
    </div>
    <div class="column-fullheight wallet">
      <router-view :key="$route.params.walletId"></router-view>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { lazyComponent } from '@router'
import sortBy from 'lodash/fp/sortBy'

export default {
  name: 'wallets-page',
  components: {
    WalletMenuItem: lazyComponent('Wallets/WalletMenuItem'),
    NoAssetsCard: lazyComponent('common/NoAssetsCard')
  },

  data () {
    return {
      search: '',
      criterions: [
        { name: 'alphabetical (asc)', icon: 'sort-alpha-up', key: 'name', desc: false },
        { name: 'alphabetical (desc)', icon: 'sort-alpha-down', key: 'name', desc: true },
        { name: 'token amount (asc)', icon: 'sort-amount-up', key: 'amount', desc: false, numeric: true },
        { name: 'token amount (desc)', icon: 'sort-amount-down', key: 'amount', desc: true, numeric: true },
        { name: 'fiat price (asc)', icon: 'sort-numeric-up', key: 'fiat', desc: false, numeric: true },
        { name: 'fiat price (desc)', icon: 'sort-numeric-down', key: 'fiat', desc: true, numeric: true }
      ]
    }
  },

  computed: {
    ...mapGetters({
      wallets: 'wallets',
      portfolioPercent: 'portfolioPercent',
      currentCriterion: 'walletsSortCriterion'
    }),
    walletsWithFiatPrice () {
      return this.wallets.map((x, i) => {
        x.fiat = this.portfolioPercent[i].price
        return x
      })
    },
    filteredWallets () {
      return this.search
        ? this.walletsWithFiatPrice.filter(x => x.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1 || x.asset.toLowerCase().indexOf(this.search.toLowerCase()) > -1)
        : this.walletsWithFiatPrice
    },
    sortedWallets () {
      const { numeric, key, desc } = this.currentCriterion
      const sorted = sortBy(x => numeric ? parseFloat(x[key]) : x[key])(this.filteredWallets)
      return desc ? sorted.reverse() : sorted
    }
  },

  watch: {
    '$route' (to, from) {
      if (to.name === 'wallets' && this.wallets.length) {
        this.$router.push(`/wallets/${this.wallets[0].id}`)
      }
    }
  },

  created () {
    Promise.all([
      this.loadWalletsSortCriterion(),
      this.getAccountAssets(),
      this.getAllAssetTransactions()
    ])

    if (!this.currentCriterion) this.sort(this.criterions[0])
  },

  mounted () {
    if (this.wallets.length) {
      this.$router.push(`/wallets/${this.sortedWallets[0].id}`)
    }
  },

  methods: {
    ...mapActions([
      'getAccountAssets',
      'getAllAssetTransactions',
      'loadWalletsSortCriterion',
      'updateWalletsSortCriterion'
    ]),
    sort (criterion) {
      this.updateWalletsSortCriterion(criterion)
    }
  }
}
</script>

<style scoped>
.wallets-menu {
  width: 352px;
  background: white;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.08);
}

.wallet {
  width: 100%
}
</style>
