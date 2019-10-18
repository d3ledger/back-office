<template>
  <el-table
    :data="pendingSettingsTransactions"
    class="transactions_table"
  >
    <el-table-column
      label="Date"
      width="110"
    >
      <template slot-scope="scope">
        {{ formatDateWith(scope.row.date, 'MMM D, HH:mm') }}
      </template>
    </el-table-column>
    <el-table-column
      label="Type"
      min-width="90"
      show-overflow-tooltip
    >
      <template slot-scope="scope">
        <div>
          {{ scope.row.type }}
        </div>
      </template>
    </el-table-column>
    <el-table-column
      label="Description"
      min-width="90"
      show-overflow-tooltip
    >
      <template slot-scope="scope">
        <div class="transaction_description">
          {{ scope.row.description }}
        </div>
      </template>
    </el-table-column>
    <el-table-column
      label="Signs"
      width="60"
    >
      <template slot-scope="scope">
        {{ scope.row.signatures.length > accountQuorum ? scope.row.signatures.length / 2 : scope.row.signatures.length }}
        /
        {{ accountQuorum }}
      </template>
    </el-table-column>
    <el-table-column width="210">
      <template slot-scope="scope">
        <div class="transaction_action">
          <el-button
            v-if="scope.row.signatures.length < accountQuorum"
            size="medium"
            type="primary"
            plain
            @click="onSignPendingTransaction(scope.row.id, scope.row.signatures)"
          >
            Add signatures
          </el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { mapGetters } from 'vuex'
import dateFormat from '@/components/mixins/dateFormat'
import messageMixin from '@/components/mixins/message'

export default {
  name: 'SettingsTab',
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
  computed: {
    ...mapGetters([
      'pendingSettingsTransactions'
    ])
  }
}
</script>

<style scoped>

</style>
