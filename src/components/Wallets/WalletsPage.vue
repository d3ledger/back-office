<template>
  <div style="display: flex; fled-direction: row;">
    <div class="column-fullheight wallets-menu">
      <wallet-menu-item
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
import { mapGetters } from 'vuex'
import WalletMenuItem from '@/components/Wallets/WalletMenuItem'

export default {
  name: 'wallets-page',
  components: {
    WalletMenuItem
  },

  computed: {
    ...mapGetters({
      wallets: 'wallets'
    })
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
