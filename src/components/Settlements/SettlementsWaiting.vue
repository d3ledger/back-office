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
          <div v-if="scope.row.from === 'you'">
            to {{ scope.row.to }}
          </div>
          <div v-else>
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
          <div v-if="scope.row.to === 'you'" style="text-align: right">
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
              @click="rejectionDialogVisible = true; setttlementForRejection = scope.row"
            >
              Reject
            </el-button>
          </div>
          <div v-else style="text-align: right">
            <el-button
              size="mini" plain
              type="info"
              @click="cancellationDialogVisible = true; settlementForcancellation = scope.row"
            >
              Cancel
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
        <el-button type="primary">Accept</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="Reject settlement?"
      :visible.sync="rejectionDialogVisible"
      width="500px"
    >
      <div v-if="setttlementForRejection">
        Are you sure want to reject {{ setttlementForRejection.offer_amount + setttlementForRejection.offer_asset }}
        for {{ setttlementForRejection.request_amount + setttlementForRejection.request_asset }} with {{ setttlementForRejection.from }}?
      </div>
      <div slot="footer">
        <el-button type="danger">Reject</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="Cancel settlement?"
      :visible.sync="cancellationDialogVisible"
      width="500px"
    >
      <div v-if="settlementForcancellation">
        Are you sure want to cancel {{ settlementForcancellation.offer_amount + settlementForcancellation.offer_asset }}
        for {{ settlementForcancellation.request_amount + settlementForcancellation.request_asset }} with {{ settlementForcancellation.to }}?
        <el-alert
          title="Note that we can't guarantee the success of cancellation."
          type="warning"
          :closable="false"
          style="margin-top: 20px"
        />
      </div>
      <div slot="footer">
        <el-button type="danger">Cancel</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
import mockSettlements from '@/mocks/settlements.json'
import dateFormat from '@/components/mixins/dateFormat'

export default {
  mixins: [dateFormat],
  data () {
    return {
      acceptanceDialogVisible: false,
      settlementForAcceptance: null,

      rejectionDialogVisible: false,
      setttlementForRejection: null,

      cancellationDialogVisible: false,
      settlementForcancellation: null
    }
  },
  computed: {
    settlements: () => mockSettlements.filter(x => x.status === 'waiting')
  }
}
</script>
