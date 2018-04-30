<template>
  <el-card>
    <el-table
      :data="wallets"
      size="small"
    >
      <el-table-column
        label="Name"
        min-width="90px"
      >
        <template slot-scope="scope">
          {{ scope.row.name }} <span>({{ scope.row.short }})</span>
        </template>
      </el-table-column>
      <el-table-column
        label="Amount"
        min-width="70px"
      >
        <template slot-scope="scope">
          {{ Number(scope.row.amount).toFixed(scope.row.precision) }}
        </template>
      </el-table-column>
      <el-table-column
        width="193px"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button size="small">Deposit</el-button>
          <el-button size="small">Withdraw</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  name: 'balance-card',
  props: {
    wallets: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
    }
  }
}
</script>

<style scoped>
</style>
