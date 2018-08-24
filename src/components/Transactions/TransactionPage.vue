<template>
  <el-container>
    <el-main>
      <el-row>
        <el-col :xs="24" :md="{ span: 18, offset: 3}" :lg="{ span: 16, offset: 4 }" :xl="{ span: 14, offset: 5 }">
          <el-card>
            <div slot="header" style="display: flex; justify-content: space-between; align-items: center;">
              <span>Waiting transactions</span>
            </div>
            <el-table
              row-class-name="transactions__table-row"
              :data="mockData">
              <el-table-column type="expand"></el-table-column>
              <el-table-column label="Date" width="140px">
                <template slot-scope="scope">
                  {{ formatDateWith(scope.row.date, 'MMM D, HH:mm') }}
                </template>
              </el-table-column>
              <el-table-column label="Amount" width="140px">
                <template slot-scope="scope">
                  <div class="row__amount">
                    <span>{{ scope.row.amount.from }} BTC</span>
                    <span>{{ scope.row.amount.to }} ETH</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="Description" width="300px">
                <template slot-scope="scope">
                  <div>
                    {{ `${scope.row.description.substr(0, 100)}...` }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="Address" width="140px">
                <template slot-scope="scope">
                  <span>{{ scope.row.address }}</span>
                </template>
              </el-table-column>
              <el-table-column>
                <template slot-scope="scope">
                  <div>
                    <el-button
                      @click="openApprovalDialog()"
                      size="medium"
                      type="primary"
                      plain>
                      Confirm
                    </el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import dateFormat from '@/components/mixins/dateFormat'
import { mapActions } from 'vuex'

export default {
  name: 'transaction-page',
  mixins: [
    dateFormat
  ],
  data () {
    return {
      mockData: [{
        date: 1535100895476,
        amount: {
          from: '0.0048',
          to: '0.3223'
        },
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        address: '0x905f948341241519128'
      }, {
        date: 1535100895476,
        amount: {
          from: '0.0148',
          to: '0.7223'
        },
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        address: '0x333f948341241519128'
      }, {
        date: 1535100895476,
        amount: {
          from: '0.0048',
          to: '0.3223'
        },
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        address: '0x583f948341241519128'
      }]
    }
  },
  created () {
    this.$store.dispatch('getPendingTransactions')
  },
  methods: {
    ...mapActions([
      'openApprovalDialog'
    ])
  }
}
</script>

<style>
.transactions__table-row {
  height: 72px;
}
.row__amount {
  display: flex;
  flex-direction: column;
}
.row__amount span {
  font-weight: 600;
}
</style>
