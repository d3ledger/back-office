<template>
  <el-table
    :data="settlements"
    ref="table"
    class="settlements_table"
    @row-dblclick="(row) => this.$refs.table.toggleRowExpansion(row)"
  >
    <el-table-column type="expand">
      <template slot-scope="scope">
        <p>
          {{ scope.row.from }} wanted to exchange {{ scope.row.offer_amount + ' ' + scope.row.offer_asset}} for {{ scope.row.request_amount + ' ' + scope.row.request_asset}} with {{ scope.row.to }}
        </p>
        <p>Was <el-tag>created</el-tag> at {{ formatDateLong(scope.row.date) }}</p>
        <p>Was <el-tag :type="tagType(scope.row.status)" >{{ scope.row.status }}</el-tag> at
        {{ formatDateLong(scope.row.date) }}</p>
        <p>Message: {{ scope.row.message }}</p>
      </template>
    </el-table-column>
    <el-table-column label="Amount" min-width="220">
        <template slot-scope="scope">
          {{ scope.row.from.amount }} {{ assetName(scope.row.from.assetId) }}
          {{ '→' }}
          {{ scope.row.to.amount }} {{ assetName(scope.row.to.assetId) }}
        </template>
    </el-table-column>
    <el-table-column label="Counterparty" width="150">
      <template slot-scope="scope">
        <div>
          {{ scope.row.from.to }}
        </div>
      </template>
    </el-table-column>
    <el-table-column label="Date" min-width="120">
      <template slot-scope="scope">
        {{ formatDate(scope.row.date) }}
      </template>
    </el-table-column>
     <el-table-column width="93">
      <template slot-scope="scope">
        <el-tag
          :type="tagType(scope.row.status)"
        >{{ scope.row.status }}</el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { mapGetters } from 'vuex'
import dateFormat from '@/components/mixins/dateFormat'

export default {
  mixins: [
    dateFormat,
    currencySymbol
  ],
  data () {
    return {}
  },
  computed: {
    ...mapGetters({
      settlements: 'resolvedSettlements'
    })
  },
  created () {
    this.$store.dispatch('getAccountTransactions')
  },
  methods: {
    ...mapActions([
      'getAccountAssets',
      'getAllAssetTransactions'
    ])
  }
}
</script>

<style scoped>
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
.status-tag {
  text-transform: capitalize;
}
</style>
