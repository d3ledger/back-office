<template>
  <el-container>
    <el-main>
      <el-row>
        <el-col :xs="24" :lg="{ span: 18, offset: 3 }" :xl="{ span: 16, offset: 4 }">
          <el-card :body-style="{ padding: '0' }">
            <div class="header">
              <span>Pending transactions</span>
            </div>
            <el-table
              class="transactions_table"
              :data="allPendingTransactions">
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <p>
                    {{ scope.row.from }} transfered  {{ scope.row.amount + ' ' + wallets.find(w => w.assetId = scope.row.assetId).asset}} to {{ scope.row.to }}
                  </p>
                  <div>
                    <p>Was <el-tag>created</el-tag> at {{ formatDateLong(scope.row.date) }}</p>
                    <p>Message: {{ scope.row.message }}</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="Date" width="140px">
                <template slot-scope="scope">
                  {{ formatDateWith(scope.row.date, 'MMM D, HH:mm') }}
                </template>
              </el-table-column>
              <el-table-column label="Amount" width="150px">
                <template slot-scope="scope">
                  {{ (scope.row.from === 'you' ? '−' : '+') + Number(scope.row.amount) + ' ' + wallets.find(w => w.assetId = scope.row.assetId).asset}}
                </template>
              </el-table-column>
              <el-table-column label="Address" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.to === 'notary' ? 'Withdrawal ' : '' }}to {{ scope.row.to === 'notary' ? scope.row.message : scope.row.to }}
                </template>
              </el-table-column>
              <el-table-column label="Description" min-width="200">
                <template slot-scope="scope">
                  <div>
                    <div v-if="scope.row.from === 'notary' || scope.row.to === 'notary'"></div>
                    <div v-else>{{ scope.row.message }}</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="Signs" min-width="50">
                <template slot-scope="scope">
                  {{ scope.row.signatures }} / {{ accountQuorum }}
                </template>
              </el-table-column>
              <el-table-column min-width="190">
                <template slot-scope="scope">
                  <div class="transaction_action">
                    <el-button
                      @click="onSignPendingTransaction(scope.row.id)"
                      size="medium"
                      type="primary"
                      plain
                    >
                      Add signatures
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
import numberFormat from '@/components/mixins/numberFormat'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'transaction-page',
  mixins: [
    dateFormat,
    numberFormat
  ],
  data () {
    return {
      isSending: false
    }
  },
  computed: {
    ...mapGetters([
      'allPendingTransactions',
      'wallets',
      'accountQuorum'
    ])
  },
  created () {
    this.getPendingTransactions()
  },
  methods: {
    ...mapActions([
      'openApprovalDialog',
      'signPendingTransaction',
      'getPendingTransactions'
    ]),
    onSignPendingTransaction (txStoreId) {
      this.openApprovalDialog()
        .then(privateKeys => {
          if (!privateKeys) return
          this.isSending = true

          return this.signPendingTransaction({
            privateKeys,
            txStoreId
          })
            .then(() => {
              this.$message({
                message: 'Transaction succesfuly finalised and sent!',
                type: 'success'
              })
              this.getPendingTransactions()
            })
            .catch(err => {
              console.error(err)
              this.$alert(err.message, 'Transaction signing error', {
                type: 'error'
              })
            })
        })
        .finally(() => { this.isSending = false })
    }

  }
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem;
}
.transactions_table {
  padding: 0.9rem 1.5rem;
}
.transactions_table >>> .el-table__header th {
  font-weight: 500;
}
.transactions_table >>> .el-table__row td .cell {
  color: #000000;
}
.transactions_table-row {
  height: 72px;
  color: #000000;
}
.transaction_action >>> button {
  background: #ffffff;
  text-transform: uppercase;
  padding: 0.7rem;
}
</style>
