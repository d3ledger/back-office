<template>
  <el-card>
    <div slot="header" class="transactions-card-header">
      <div>
        <el-radio-group v-model="transactionsFilter">
          <el-radio-button label="all" name="all">All</el-radio-button>
          <el-radio-button label="incoming" name="incoming">Incoming</el-radio-button>
          <el-radio-button label="outgoing" name="outgoing">Outgoing</el-radio-button>
        </el-radio-group>
        <el-checkbox v-model="waitingOnly" border style="margin-left: 10px">
          Waiting only
        </el-checkbox>
      </div>
    </div>
    <el-table :data="transactionsFiltered" size="small" height="70vh">
      <el-table-column label="ID" prop="id" min-width="40px" />
      <el-table-column label="From" prop="from" min-width="80px" />
      <el-table-column label="Offering" min-width="100px">
        <template slot-scope="scope">
          {{ scope.row.offer_amount+scope.row.offer_asset }}
        </template>
      </el-table-column>
      <el-table-column label="To" prop="to" min-width="80px" />
      <el-table-column label="Request" min-width="100px">
        <template slot-scope="scope">
          {{ scope.row.request_amount+scope.row.request_asset }}
        </template>
      </el-table-column>
      <el-table-column label="Status" prop="status" width="80px" />
      <el-table-column
        width="177px"
      >
          <template slot-scope="scope">
            <div v-if="scope.row.status === 'waiting' && scope.row.to === 'you'">
              <el-button
                size="mini" plain
                type="danger"
                v-on:click="$emit('decline-settlement', scope.row)"
              >
                Decline
              </el-button>
              <el-button
                size="mini"
                plain type="success"
                v-on:click="$emit('accept-settlement', scope.row)"
              >
                Accept
              </el-button>
            </div>
          </template>
        </el-table-column>
    </el-table>
  </el-card>
</template>

<script>

export default {
  name: 'transactions-card',
  props: {
    transactions: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      transactionsFilter: 'all',
      waitingOnly: false
    }
  },
  computed: {
    transactionsFiltered: function () {
      return this.transactions.filter(
        this.transactionsFilter === 'incoming'
          ? x => x.to === 'you' : this.transactionsFilter === 'outgoing' ? x => x.from === 'you' : x => x
      ).filter(this.waitingOnly ? x => x.status === 'waiting' : x => x)
    }
  }
}
</script>

<style scoped>
.transactions-card-header {
  display: flex;
  justify-content: space-between;
}
</style>
