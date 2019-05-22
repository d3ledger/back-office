<template>
  <el-container>
    <el-main>
      <el-row>
        <el-col
          :xs="24"
          :lg="{ span: 18, offset: 3 }"
          :xl="{ span: 16, offset: 4 }"
        >
          <el-card :body-style="{ padding: '0' }">
            <div class="header">
              <span>Pending transactions</span>
            </div>
            <el-table
              :data="allPendingTransactions"
              class="transactions_table"
            >
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <div class="transaction_details">
                    <p>
                      {{ scope.row.from }} transfered {{ scope.row.amount }}
                      {{ wallets.find(w => w.assetId = scope.row.assetId).asset }} to {{ scope.row.to }}
                    </p>
                    <div>
                      <p>Was <el-tag>created</el-tag> at {{ formatDateLong(scope.row.date) }}</p>
                      <p>Message: {{ scope.row.message }}</p>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="Date"
                width="110"
              >
                <template slot-scope="scope">
                  {{ formatDateWith(scope.row.date, 'MMM D, HH:mm') }}
                </template>
              </el-table-column>
              <el-table-column
                label="Amount"
                min-width="60"
              >
                <template slot-scope="scope">
                  {{ scope.row.from === 'you' ? '−' : '+' }}{{ Number(scope.row.amount) }}
                  {{ wallets.find(w => w.assetId === scope.row.assetId).asset }}
                </template>
              </el-table-column>
              <el-table-column
                label="Address"
                min-width="90"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  {{ scope.row.to === 'notary' ? 'Withdrawal' : '' }} to {{ scope.row.to === 'notary' ? scope.row.message : scope.row.to }}
                </template>
              </el-table-column>
              <el-table-column
                label="Description"
                min-width="90"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <div>
                    <div v-if="scope.row.from === 'notary' || scope.row.to === 'notary'"/>
                    <div v-else>{{ scope.row.message }}</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="Expire"
                width="70"
              >
                <template slot-scope="scope">
                  {{ calculateEstimatedTime(scope.row.date) }}
                </template>
              </el-table-column>
              <el-table-column
                label="Signs"
                width="60"
              >
                <template slot-scope="scope">
                  {{ scope.row.signatures.length }} / {{ accountQuorum }}
                </template>
              </el-table-column>
              <el-table-column width="210">
                <template slot-scope="scope">
                  <div class="transaction_action">
                    <el-button
                      size="medium"
                      type="primary"
                      plain
                      @click="onSignPendingTransaction(scope.row.id, scope.row.signatures)"
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
import { mapActions, mapGetters } from 'vuex'
import dateFormat from '@/components/mixins/dateFormat'
import messageMixin from '@/components/mixins/message'
import NOTIFICATIONS from '@/data/notifications'

export default {
  name: 'TransactionPage',
  mixins: [
    dateFormat,
    messageMixin
  ],
  data () {
    return {
      liveTimeOfTransaction: 24 * 60 * 60 * 1000, // 24h in milliseconds
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
    this.getAllUnsignedTransactions()
  },
  methods: {
    ...mapActions([
      'openApprovalDialog',
      'signPendingTransaction',
      'getAllUnsignedTransactions'
    ]),
    onSignPendingTransaction (txStoreId, signatures) {
      this.openApprovalDialog({ signatures })
        .then(privateKeys => {
          if (!privateKeys) return
          this.isSending = true

          return this.signPendingTransaction({
            privateKeys,
            txStoreId
          })
            .then(() => {
              let completed = privateKeys.length + signatures.length === this.accountQuorum
              this.$_showMessageFromStatus(
                completed,
                NOTIFICATIONS.TRANSACTION_SUCCESS,
                NOTIFICATIONS.NOT_COMPLETED
              )
              this.getAllUnsignedTransactions()
            })
            .catch(err => {
              console.error(err)
              this.$_showErrorAlertMessage(err.message, 'Transaction signing error')
            })
        })
        .finally(() => { this.isSending = false })
    },
    calculateEstimatedTime (date) {
      const rightDate = date + this.liveTimeOfTransaction
      return this.compareDates(rightDate, new Date().getTime())
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
.transaction_details {
  font-size: 0.8rem;
  color: #000000;
}
.transaction_action >>> button {
  background: #ffffff;
  text-transform: uppercase;
  padding: 0.7rem;
}
</style>
