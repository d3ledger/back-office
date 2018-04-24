<template>
  <section>
    <el-row>
      <el-col :md="12" :lg="10">
        <el-card id="wallets">
          <el-table
            :data="wallets"
          >
            <el-table-column
              label="Name"
              width="120px"
            >
              <template slot-scope="scope">
                {{ scope.row.name }} <span>({{ scope.row.short }})</span>
              </template>
            </el-table-column>
            <el-table-column
              label="Amount"
              width="120px"
            >
              <template slot-scope="scope">
                {{ Number(scope.row.amount).toFixed(scope.row.precision) }}
              </template>
            </el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <el-button-group>
                  <el-button size="small">Deposit</el-button>
                  <el-button size="small">Withdraw</el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </section>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
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

<style scoped>
</style>
