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
  name: 'wallets-page',
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
          asset: 'WAVES',
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
          name: 'UnknownCoin',
          asset: 'UKC',
          amount: 200.01,
          color: '7ED321'
        },
        {
          name: 'EOS',
          asset: 'EOS',
          amount: 100.012,
          color: '443F54'
        },
        {
          name: 'DogeCoin',
          asset: 'Doge',
          amount: 123.456,
          color: 'C6A600'
        },
        {
          name: 'StrangeCoin',
          asset: 'STRNG',
          amount: 999.144,
          color: '9013FE'
        }
      ]
    }
  }
}
</script>
