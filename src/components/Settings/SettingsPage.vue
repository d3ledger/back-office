<template>
  <el-row :gutter="20">
    <el-col :span="12">
      <wallets-card
        title="ETH wallets"
        :wallets="eth"
      />
    </el-col>
    <el-col :span="12">
      <wallets-card
        title="Waves wallets"
        :wallets="wvs"
      />
    </el-col>
  </el-row>
</template>

<script>
import WalletsCard from './WalletsCard'

export default {
  name: 'settings-page',
  components: {
    WalletsCard
  },
  data () {
    return {
      eth: [
        {
          name: 'Work wallet',
          currency: 'ETH',
          address: 'SomeEthAddress'
        },
        {
          name: 'MyHomeWallet',
          currency: 'ETH',
          address: 'SomeOtherEthAddress'
        }
      ],
      wvs: [
        {
          name: 'Work wallet',
          currency: 'WVS',
          address: 'SomeWVSAddress'
        },
        {
          name: 'MyHomeWallet',
          currency: 'WVS',
          address: 'SomeOtherWVSAddress'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
