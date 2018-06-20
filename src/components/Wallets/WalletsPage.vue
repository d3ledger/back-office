<template>
  <div style="display: flex; fled-direction: row;">
    <div class="column-fullheight wallets-menu">
      <el-input style="width: 100%; padding: 5px;" v-model="search" placeholder="Search" />
      <wallet-menu-item
        v-for="wallet in filteredWallets"
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
import { mapGetters } from 'vuex'
import WalletMenuItem from '@/components/Wallets/WalletMenuItem'

export default {
  name: 'wallets-page',
  components: {
    WalletMenuItem
  },

  data () {
    return {
      search: ''
    }
  },

  computed: {
    ...mapGetters({
      wallets: 'wallets'
    }),
    filteredWallets: function () {
      return this.search ? this.wallets.filter(x => x.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1 || x.asset.toLowerCase().indexOf(this.search.toLowerCase()) > -1) : this.wallets
    }
  },

  created () {
    this.$store.dispatch('getAccountAssets')
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
  width: 100%;
  padding: 20px;
}
</style>
