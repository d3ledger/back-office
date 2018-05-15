<template>
  <el-table :data="settlements">
    <el-table-column type="expand">
      <template slot-scope="scope">
        <p>
          {{ scope.row.from }} wanted to exchange {{ scope.row.offer_amount + ' ' + scope.row.offer_asset}} for {{ scope.row.request_amount + ' ' + scope.row.request_asset}} with {{ scope.row.to }}
        </p>
        <p>Was <el-tag>created</el-tag> at {{ scope.row.date | formatDateLong}}</p>
        <p>Was <el-tag :type="tagType(scope.row.status)" >{{ scope.row.status }}</el-tag> at
        {{ scope.row.date | formatDateLong}}</p>
        <p>Message: {{ scope.row.message }}</p>
      </template>
    </el-table-column>
    <el-table-column width="93">
      <template slot-scope="scope">
        <el-tag
          :type="tagType(scope.row.status)"
        >{{ scope.row.status }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="Amount" min-width="220">
      <template slot-scope="scope">
        {{ scope.row.offer_amount.toFixed(4) + ' ' + scope.row.offer_asset + ' → ' + scope.row.request_amount.toFixed(4) + ' ' + scope.row.request_asset }}
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
  </el-table>
</template>

<script>
import dateFormat from '@/components/mixins/dateFormat'
import mockSettlements from '@/mocks/settlements.json'

export default {
  mixins: [dateFormat],
  data () {
    return {

    }
  },
  computed: {
    settlements: () => mockSettlements.filter(x => x.status !== 'waiting')
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
