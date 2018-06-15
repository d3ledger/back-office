<template>
  <el-row :gutter="40">
    <el-col v-for="wallet in wallets" :xs="24" :md="8" :lg="6" :xl="4" :key="wallet.name">
      <wallet-card
        :walletId="wallet.id"
        :name="wallet.name"
        :asset="wallet.asset"
        :amount="wallet.amount"
        :color="wallet.color"
      />
    </el-col>
  </el-row>
</template>

<script>
import { mapGetters } from 'vuex'
import WalletCard from '@/components/Wallets/WalletCard'

export default {
  name: 'wallets-card',
  components: {
    WalletCard
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
