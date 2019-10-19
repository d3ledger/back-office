<template>
  <el-table
    :data="formattedTransactions"
    class="transactions_table"
  >
    <el-table-column type="expand">
      <template slot-scope="scope">
        <div class="transaction_details">
          <el-table
            :data="scope.row"
            class="transactions_table"
          >
            <el-table-column
              prop="from"
              label="From"
            />
            <el-table-column
              prop="to"
              label="To"
            />
            <el-table-column
              label="Amount"
            >
              <template slot-scope="scope">
                {{ scope.row.from === 'you' ? '−' : '+' }}{{ scope.row.amount }}
                {{ availableAssets.find(w => w.assetId === scope.row.assetId).asset }}
              </template>
            </el-table-column>
            <el-table-column
              prop="message"
              label="Message"
            />
          </el-table>
        </div>
      </template>
    </el-table-column>
    <el-table-column
      label="Date"
      width="110"
    >
      <template slot-scope="scope">
        {{ formatDateWith(scope.row[0].date, 'MMM D, HH:mm') }}
      </template>
    </el-table-column>
    <el-table-column
      label="Description"
      min-width="90"
      show-overflow-tooltip
    >
      <template slot-scope="scope">
        <div>
          <div v-if="scope.row[0].from === 'notary' || scope.row[0].to === 'notary'" />
          <div v-else>
            {{ scope.row[0].message }}
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column
      label="Expire"
      width="70"
    >
      <template slot-scope="scope">
        {{ calculateEstimatedTime(scope.row[0].date) }}
      </template>
    </el-table-column>
    <el-table-column
      label="Signs"
      width="60"
    >
      <template slot-scope="scope">
        {{ scope.row[0].signatures.length > accountQuorum ? scope.row[0].signatures.length / 2 : scope.row[0].signatures.length }}
        /
        {{ accountQuorum }}
      </template>
    </el-table-column>
    <el-table-column width="210">
      <template slot-scope="scope">
        <div class="transaction_action">
          <el-button
            v-if="scope.row[0].signatures.length < accountQuorum"
            size="medium"
            type="primary"
            plain
            @click="onSignPendingTransaction(scope.row[0].id, scope.row[0].signatures)"
          >
            Add signatures
          </el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import groupBy from 'lodash/groupBy'
import { mapGetters } from 'vuex'
import dateFormat from '@/components/mixins/dateFormat'
import messageMixin from '@/components/mixins/message'

export default {
  name: 'TransferTab',
  mixins: [
    dateFormat,
    messageMixin
  ],
  props: {
    accountQuorum: {
      type: Number,
      required: true
    },
    availableAssets: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data () {
    return {
      liveTimeOfTransaction: 24 * 60 * 60 * 1000 // 24h in milliseconds
    }
  },
  computed: {
    ...mapGetters([
      'pendingTransferTransactions'
    ]),
    formattedTransactions () {
      return Object.values(
        groupBy(this.pendingTransferTransactions, (tx) => tx.id)
      )
    }
  },
  methods: {
    calculateEstimatedTime (date) {
      const rightDate = date + this.liveTimeOfTransaction
      return this.compareDates(rightDate, new Date().getTime())
    }
  }
}
</script>

<style scoped>

</style>
