<template>
  <section>
    <el-table
      :data="settlements"
      ref="table"
      class="settlements_table"
      @row-dblclick="(row) => this.$refs.table.toggleRowExpansion(row)"
    >
      <el-table-column type="expand">
        <template slot-scope="scope">
          <div class="transaction_details">
            <el-row>
              <el-col :span="6">{{ formatDateLong(scope.row.to.date) }}</el-col>
              <el-col :span="6" class="transaction_details-amount">
                <p>- {{ scope.row.from.amount }} {{ assetName(scope.row.from.assetId) }}</p>
                <p>+ {{ scope.row.to.amount }} {{ assetName(scope.row.to.assetId) }}</p>
              </el-col>
              <el-col :span="6">{{ scope.row.from.message }}</el-col>
              <el-col :span="6">{{ scope.row.from.to }}</el-col>
            </el-row>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Amount" min-width="200">
        <template slot-scope="scope">
          {{ scope.row.from.amount }} {{ assetName(scope.row.from.assetId) }}
          {{ '→' }}
          {{ scope.row.to.amount }} {{ assetName(scope.row.to.assetId) }}
        </template>
      </el-table-column>
      <el-table-column label="Counterparty" min-width="120">
        <template slot-scope="scope">
          <div>
            from {{ scope.row.from.to }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Date" width="120">
        <template slot-scope="scope">
          {{ formatDate(scope.row.from.date) }}
        </template>
      </el-table-column>
      <el-table-column width="200">
        <template slot-scope="scope">
          <div class="list_actions">
            <el-button
              plain
              size="medium"
              type="primary"
              @click="acceptanceDialogVisible = true; settlementForAcceptance = scope.row"
            >
              Accept
            </el-button>
            <el-button
              plain
              size="medium"
              type="danger"
              @click="rejectionDialogVisible = true; settlementForRejection = scope.row"
            >
              Decline
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="Accept settlement?"
      :visible.sync="acceptanceDialogVisible"
      width="500px"
      center
    >
      <div v-if="settlementForAcceptance">
        Are you sure want to exchange
        {{ settlementForAcceptance.from.amount }} {{ assetName(settlementForAcceptance.from.assetId) }}
        for {{ settlementForAcceptance.to.amount }} {{ assetName(settlementForAcceptance.to.assetId) }}
        with {{ settlementForAcceptance.to.from }}?
      </div>
      <div slot="footer">
        <el-button type="primary" class="fullwidth black clickable" @click="onAccept" :loading="acceptSettlementLoading">Accept</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="Reject settlement?"
      :visible.sync="rejectionDialogVisible"
      width="500px"
      center
    >
      <div v-if="settlementForRejection">
        Are you sure want to reject
        {{ settlementForRejection.from.amount }} {{ assetName(settlementForRejection.from.assetId) }}
        for {{ settlementForRejection.to.amount }} {{ assetName(settlementForRejection.to.assetId) }}
        with {{ settlementForRejection.to.from }}?
      </div>
      <div slot="footer">
        <el-button type="danger" @click="onReject" class="fullwidth" :loading="rejectSettlementLoading">Reject</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
// TODO: Add approval here as well
import { mapGetters, mapActions } from 'vuex'
import dateFormat from '@/components/mixins/dateFormat'
import currencySymbol from '@/components/mixins/currencySymbol'

export default {
  mixins: [
    dateFormat,
    currencySymbol
  ],

  data () {
    return {
      acceptanceDialogVisible: false,
      settlementForAcceptance: null,

      rejectionDialogVisible: false,
      settlementForRejection: null
    }
  },

  computed: {
    ...mapGetters({
      settlements: 'incomingSettlements',
      wallets: 'wallets',
      accountQuorum: 'accountQuorum',
      acceptSettlementLoading: 'acceptSettlementLoading',
      rejectSettlementLoading: 'rejectSettlementLoading'
    })
  },

  created () {
    this.getAllUnsignedTransactions()
  },

  methods: {
    ...mapActions([
      'openApprovalDialog',
      'getAllUnsignedTransactions',
      'acceptSettlement',
      'rejectSettlement'
    ]),

    onAccept () {
      this.openApprovalDialog({ requiredMinAmount: this.accountQuorum })
        .then(privateKeys => {
          if (!privateKeys) return

          return this.acceptSettlement({
            privateKeys,
            settlementBatch: this.settlementForAcceptance.from.batch
          })
            .then(() => {
              this.$message.success('Accepted')
            })
            .catch(err => {
              console.error(err)
              this.$message.error('Failed to accept')
            })
            .finally(() => {
              this.acceptanceDialogVisible = false
              this.getAllUnsignedTransactions()
            })
        })
    },

    onReject () {
      this.openApprovalDialog({ requiredMinAmount: this.accountQuorum })
        .then(privateKeys => {
          if (!privateKeys) return

          return this.rejectSettlement({
            privateKeys,
            settlementBatch: this.settlementForRejection.from.batch
          })
            .then(() => {
              this.$message.success('Rejected')
            })
            .catch(err => {
              console.error(err)
              this.$message.error('Failed to reject')
            })
            .finally(() => {
              this.rejectionDialogVisible = false
              this.getAllUnsignedTransactions()
            })
        })
    }
  }
}
</script>

<style scoped>
.list_actions {
  display: flex;
  justify-content: flex-end;
}
.list_actions >>> button {
  background: #ffffff;
  text-transform: uppercase;
  padding: 0.7rem;
}
.settlements_table >>> .el-table__header th {
  font-weight: 500;
}
.settlements_table >>> .el-table__row td .cell {
  color: #000000;
}
.settlements_table >>> .el-table__expanded-cell {
  padding: 0rem 1rem 1rem;
}
.transaction_details {
  font-size: 0.8rem;
  color: #000000;
  background-color: #f4f4f4;
  padding: 1rem;
}
.transaction_details-amount {
  flex-wrap: wrap;
  font-weight: 600;
}
</style>
