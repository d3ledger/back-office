<template>
  <section>
    <el-table
      :data="settlements"
      ref="table"
      @row-dblclick="(row) => this.$refs.table.toggleRowExpansion(row)"
    >
      <el-table-column type="expand">
        <template slot-scope="scope">
          <p>
            {{ scope.row.from }} want to exchange {{ scope.row.offer_amount + ' ' + scope.row.offer_asset}}
            for {{ scope.row.request_amount + ' ' + scope.row.request_asset}} with {{ scope.row.to }}
          </p>
          <p>Was <el-tag>created</el-tag> at {{ scope.row.date | formatDateLong}}</p>
          <p>Message: {{ scope.row.message }}</p>
        </template>
      </el-table-column>
      <el-table-column label="Amount" min-width="220">
        <template slot-scope="scope">
          {{
            scope.row.offer_amount.toFixed(4) + ' ' + scope.row.offer_asset
            + ' → ' +
            scope.row.request_amount.toFixed(4) + ' ' + scope.row.request_asset
          }}
        </template>
      </el-table-column>
      <el-table-column label="Counterparty" min-width="150">
        <template slot-scope="scope">
          <div>
            from {{ scope.row.from }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Date" width="120">
        <template slot-scope="scope">
          {{ scope.row.date | formatDate }}
        </template>
      </el-table-column>
      <el-table-column
        width="180px"
      >
        <template slot-scope="scope">
          <div style="text-align: right">
            <el-button
              size="mini"
              plain type="primary"
              @click="acceptanceDialogVisible = true; settlementForAcceptance = scope.row"
            >
              Accept
            </el-button>
            <el-button
              size="mini" plain
              type="danger"
              @click="rejectionDialogVisible = true; settlementForRejection = scope.row"
            >
              Reject
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
     <el-dialog
      title="Accept settlement?"
      :visible.sync="acceptanceDialogVisible"
      width="500px"
    >
      <div v-if="settlementForAcceptance">
        Are you sure want to exchange {{ settlementForAcceptance.offer_amount + settlementForAcceptance.offer_asset }}
        for {{ settlementForAcceptance.request_amount + settlementForAcceptance.request_asset }} with {{ settlementForAcceptance.from }}?
      </div>
      <div slot="footer">
        <el-button type="primary" @click="onAccept">Accept</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="Reject settlement?"
      :visible.sync="rejectionDialogVisible"
      width="500px"
    >
      <div v-if="settlementForRejection">
        Are you sure want to reject {{ settlementForRejection.offer_amount + settlementForRejection.offer_asset }}
        for {{ settlementForRejection.request_amount + settlementForRejection.request_asset }} with {{ settlementForRejection.from }}?
      </div>
      <div slot="footer">
        <el-button type="danger" @click="onReject">Reject</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
import { mapGetters } from 'vuex'
import dateFormat from '@/components/mixins/dateFormat'

export default {
  mixins: [dateFormat],
  data () {
    return {
      acceptanceDialogVisible: false,
      settlementForAcceptance: null,

      rejectionDialogVisible: false,
      settlementForRejection: null,

      cancellationDialogVisible: false,
      settlementForcancellation: null
    }
  },
  computed: {
    ...mapGetters({
      settlements: 'waitingSettlements'
    })
  },
  created () {
    this.fetchAllUnsignedTransactions()
  },

  methods: {
    fetchAllUnsignedTransactions () {
      this.$store.dispatch('getAllUnsignedTransactions')
    },

    onAccept () {
      this.$store.dispatch('acceptSettlement', {
        settlementHash: this.settlementForAcceptance.id
      })
        .then(() => {
          this.$message('Accepted')
          this.fetchAllUnsignedTransactions()
        })
        .catch(err => {
          console.error(err)
          this.$message('Failed to accept')
        })
        .finally(() => { this.acceptanceDialogVisible = false })
    },

    onReject () {
      this.$store.dispatch('rejectSettlement', {
        settlementHash: this.settlementForRejection.id
      })
        .then(() => {
          this.$message('Rejected')
          this.fetchAllUnsignedTransactions()
        })
        .catch(err => {
          console.error(err)
          this.$message('Failed to reject')
        })
        .finally(() => { this.rejectionDialogVisible = false })
    },

    onCancel () {
      this.$store.dispatch('cancelSettlement', {
        settlementHash: this.settlementForcancellation.id
      })
        .then(() => {
          this.$message('Canceled')
          this.fetchAllUnsignedTransactions()
        })
        .catch(err => {
          console.error(err)
          this.$message('Failed to cancel')
        })
        .finally(() => { this.cancellationDialogVisible = false })
    }
  }
}
</script>
