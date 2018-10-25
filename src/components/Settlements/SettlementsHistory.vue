<template>
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
            <el-col :span="6">{{ formatDateLong(scope.row.date) }}</el-col>
            <el-col :span="6" class="transaction_details-amount">
              <p>- {{ scope.row.offer_amount }} {{ scope.row.offer_asset }}</p>
              <p>+ {{ scope.row.request_amount }} {{ scope.row.request_asset }}</p>
            </el-col>
            <el-col :span="6">{{ scope.row.message }}</el-col>
            <el-col :span="6">{{ scope.row.to === 'you' ? scope.row.from : scope.row.to }}</el-col>
          </el-row>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="Amount" min-width="220">
      <template slot-scope="scope">
        {{ Number(scope.row.offer_amount).toFixed(4) + ' ' + scope.row.offer_asset + ' → ' + Number(scope.row.request_amount).toFixed(4) + ' ' + scope.row.request_asset }}
      </template>
    </el-table-column>
    <el-table-column label="Counterparty" width="150">
      <template slot-scope="scope">
        <div v-if="scope.row.from === 'you'">
          to {{ scope.row.to }}
        </div>
        <div v-else>
          from {{ scope.row.from }}
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
          class="status-tag"
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
  mixins: [dateFormat],
  data () {
    return {

    }
  },
  computed: {
    ...mapGetters({
      settlements: 'resolvedSettlements'
    })
  },
  created () {
    this.$store.dispatch('getAccountTransactions')
    this.$store.dispatch('getPendingTransactions')
  },
  methods: {
    tagType: function (val) {
      val = val.toLowerCase()
      if (val === 'accepted') return 'success'
      if (val === 'rejected') return 'danger'
      if (val === 'canceled') return 'info'
      return ''
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
