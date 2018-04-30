<template>
  <el-row :gutter="20">
    <el-col :span="15">
      <transactions-card :transactions="transactions"/>
    </el-col>
    <el-col :span="9">
      <balance-card :wallets="wallets"/>
    </el-col>
  </el-row>
</template>

<script>
import BalanceCard from '@/components/Dashboard/BalanceCard'
import TransactionsCard from '@/components/Dashboard/TransactionsCard'
import mockTransactions from '@/mocks/transactions.json'

export default {
  name: 'Home',
  components: {
    BalanceCard,
    TransactionsCard
  },
  data () {
    return {
      transactions: mockTransactions,
      wallets: [
        {
          name: 'Ether',
          short: 'ETH',
          amount: 100.0,
          address: 'acsasdascasascasc',
          precision: 1
        },
        {
          name: 'Waves',
          short: 'WVS',
          amount: 200.12,
          address: 'acsasdascasascasc',
          precision: 2
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
