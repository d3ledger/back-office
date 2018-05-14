<template>
  <el-row :gutter="40">
    <el-col v-for="wallet in wallets" :xs="24" :md="8" :lg="6" :xl="4" :key="wallet.name">
      <wallet-card
        :name="wallet.name"
        :asset="wallet.asset"
        :amount="wallet.amount"
        :color="wallet.color"
      />
    </el-col>
  </el-row>
</template>

<script>
import WalletCard from '@/components/Wallets/WalletCard'

export default {
  name: 'wallets-card',
  components: {
    WalletCard
  },
  data () {
    return {
      wallets: [
        {
          name: 'Bitcoin',
          asset: 'BTC',
          amount: 1.80368522,
          color: 'ffb055'
        },
        {
          name: 'Waves',
          asset: 'WVS',
          amount: 200.04,
          color: '0055fe'
        },
        {
          name: 'Etherium',
          asset: 'ETH',
          amount: 100.803685,
          color: '494949'
        },
        {
          name: 'Bitcoin1',
          asset: 'BTC',
          amount: 1.80368522,
          color: 'ffb055'
        },
        {
          name: 'Waves1',
          asset: 'WVS',
          amount: 200.04,
          color: '0055fe'
        },
        {
          name: 'Etherium1',
          asset: 'ETH',
          amount: 100.803685,
          color: '494949'
        }
      ]
    }
  }
}
</script>
