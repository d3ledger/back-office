<template>
  <el-card>
    <div slot="header">
      <el-input
        placeholder="Search"
        prefix-icon="el-icon-search"
        suffix-icon="el-icon-date"
        >
      </el-input>
    </div>
    <div>
      <el-table
        :data="data">
        <el-table-column
          prop="currency"
          label="Currency"
          width="180"
          header-align="left">
        </el-table-column>
        <el-table-column
          prop="balance"
          label="Balance"
          width="180"
          header-align="center">
        </el-table-column>
        <el-table-column
          prop="changes"
          label="Changes"
          header-align="right">
        </el-table-column>
      </el-table>
    </div>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      data: [{
        currency: 'Ethereum (ETH)',
        balance: '14 749 ₽',
        changes: '4 000 ₽ (54 %)'
      }, {
        currency: 'Cardano (ADA)',
        balance: '14 749 ₽',
        changes: '4 000 ₽ (54 %)'
      }, {
        currency: 'Aeternity (AE)',
        balance: '14 749 ₽',
        changes: '4 000 ₽ (54 %)'
      }]
    }
  }
}
</script>

<style scoped>
</style>
