<template>
  <el-container v-if="wallets.length">
    <el-aside class="column-fullheight wallets-menu" width="280px">
      <el-input style="width: 100%; padding: 5px;" v-model="search" placeholder="Search" />
      <wallet-menu-item
        v-for="wallet in filteredWallets"
        :key="wallet.name"
        :walletId="wallet.id"
        :name="wallet.name"
        :asset="wallet.asset"
      />
    </el-aside>
    <el-main class="column-fullheight wallet">
      <router-view :key="$route.params.walletId"></router-view>
    </el-main>
  </el-container>
  <el-container v-else>
    <no-assets-card />
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import WalletMenuItem from '@/components/Wallets/WalletMenuItem'
import NoAssetsCard from '@/components/common/NoAssetsCard'

export default {
  name: 'wallets-page',
  components: {
    WalletMenuItem,
    NoAssetsCard
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
  background: white;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.08);
}
</style>
