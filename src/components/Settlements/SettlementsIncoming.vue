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
          {{
            scope.row.from.amount + ' ' + assetName(scope.row.from.assetId)
            + ' → ' +
            scope.row.to.amount + ' ' + assetName(scope.row.to.assetId)
          }}
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
        Are you sure want to exchange {{ settlementForAcceptance.from.amount }} {{ assetName(settlementForAcceptance.from.assetId) }}
        for {{ settlementForAcceptance.to.amount }} {{ assetName(settlementForAcceptance.to.assetId) }} with {{ settlementForAcceptance.to.from }}?
      </div>
      <div slot="footer">
        <el-button type="primary" class="fullwidth black clickable" @click="onAccept">Accept</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="Reject settlement?"
      :visible.sync="rejectionDialogVisible"
      width="500px"
      center
    >
      <div v-if="settlementForRejection">
        Are you sure want to reject {{ settlementForRejection.from.amount }} {{ assetName(settlementForRejection.from.assetId) }}
        for {{ settlementForRejection.to.amount }} {{ assetName(settlementForRejection.to.assetId) }} with {{ settlementForRejection.to.from }}?
      </div>
      <div slot="footer">
        <el-button type="danger" @click="onReject" class="fullwidth">Reject</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
// TODO: Add approval here as well
import { mapGetters, mapActions } from 'vuex'
import dateFormat from '@/components/mixins/dateFormat'

export default {
  mixins: [dateFormat],

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
      wallets: 'wallets'
    })
  },

  created () {
    this.getAllUnsignedTransactions()
  },

  methods: {
    ...mapActions([
      'openApprovalDialog',
      'getAllUnsignedTransactions'
    ]),

    onAccept () {
      this.openApprovalDialog()
        .then(privateKeys => {
          if (!privateKeys) return

          return this.$store.dispatch('acceptSettlement', {
            privateKeys,
            settlementBatch: this.settlementForAcceptance.from.batch
          })
            .then(() => {
              this.$message('Accepted')
              this.getAllUnsignedTransactions()
            })
            .catch(err => {
              console.error(err)
              this.$message('Failed to accept')
            })
            .finally(() => { this.acceptanceDialogVisible = false })
        })
    },

    onReject () {
      this.openApprovalDialog()
        .then(privateKeys => {
          if (!privateKeys) return

          return this.$store.dispatch('rejectSettlement', {
            privateKeys,
            settlementBatch: this.settlementForRejection.from.batch
          })
            .then(() => {
              this.$message('Rejected')
              this.getAllUnsignedTransactions()
            })
            .catch(err => {
              console.error(err)
              this.$message('Failed to reject')
            })
            .finally(() => { this.rejectionDialogVisible = false })
        })
    },

    assetName (assetId) {
      const wallet = this.wallets.find(w => w.assetId === assetId) || {}
      return wallet.asset
    }
  }
}
</script>

<style scoped>
.list_actions {
  display: flex;
  justify-content: space-between;
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
