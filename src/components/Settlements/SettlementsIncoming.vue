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
          <p>Was <el-tag>created</el-tag> at {{ formatDateLong(scope.row.date) }}</p>
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
          {{ formatDate(scope.row.date) }}
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
      center
    >
      <div v-if="settlementForAcceptance">
        Are you sure want to exchange {{ settlementForAcceptance.offer_amount + settlementForAcceptance.offer_asset }}
        for {{ settlementForAcceptance.request_amount + settlementForAcceptance.request_asset }} with {{ settlementForAcceptance.from }}?
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
        Are you sure want to reject {{ settlementForRejection.offer_amount + settlementForRejection.offer_asset }}
        for {{ settlementForRejection.request_amount + settlementForRejection.request_asset }} with {{ settlementForRejection.from }}?
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
      settlements: 'incomingSettlements'
    })
  },

  created () {
    this.fetchAllUnsignedTransactions()
  },

  methods: {
    ...mapActions([
      'openApprovalDialog'
    ]),

    fetchAllUnsignedTransactions () {
      this.$store.dispatch('getAllUnsignedTransactions')
    },

    onAccept () {
      this.openApprovalDialog()
        .then(privateKey => {
          console.log(`accept: privateKey=${privateKey}`)

          return this.$store.dispatch('acceptSettlement', {
            settlementHash: this.settlementForAcceptance.id
          })
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
      this.openApprovalDialog()
        .then(privateKey => {
          console.log(`reject: privateKey=${privateKey}`)

          return this.$store.dispatch('rejectSettlement', {
            settlementHash: this.settlementForRejection.id
          })
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
    }
  }
}
</script>
