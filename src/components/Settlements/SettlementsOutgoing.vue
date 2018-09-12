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
          <p>
            {{ scope.row.from }} want to exchange {{ scope.row.offer_amount + ' ' + scope.row.offer_asset}}
            for {{ scope.row.request_amount + ' ' + scope.row.request_asset}} with {{ scope.row.to }}
          </p>
          <p>Was <el-tag>created</el-tag> at {{ formatDateLong(scope.row.date) }}</p>
          <p>Message: {{ scope.row.message }}</p>
        </template>
      </el-table-column>
      <el-table-column label="Amount" min-width="200">
        <template slot-scope="scope">
          {{
            Number(scope.row.offer_amount).toFixed(4) + ' ' + scope.row.offer_asset
            + ' → ' +
            Number(scope.row.request_amount).toFixed(4) + ' ' + scope.row.request_asset
          }}
        </template>
      </el-table-column>
      <el-table-column label="Counterparty" min-width="120">
        <template slot-scope="scope">
          to {{ scope.row.to }}
        </template>
      </el-table-column>
      <el-table-column label="Date" width="120">
        <template slot-scope="scope">
          {{ formatDate(scope.row.date) }}
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>
<script>
import { mapGetters } from 'vuex'
import dateFormat from '@/components/mixins/dateFormat'

export default {
  mixins: [dateFormat],

  data () {
    return {
    }
  },

  computed: {
    ...mapGetters({
      settlements: 'outgoingSettlements'
    })
  },

  created () {
    this.fetchAllUnsignedTransactions()
  },

  methods: {
    fetchAllUnsignedTransactions () {
      this.$store.dispatch('getAllUnsignedTransactions')
    }
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
</style>
