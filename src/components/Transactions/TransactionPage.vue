<template>
  <el-container>
    <el-main>
      <el-row>
        <el-col :xs="24" :lg="{ span: 18, offset: 3 }" :xl="{ span: 16, offset: 4 }">
          <el-card>
            <div slot="header" style="display: flex; justify-content: space-between; align-items: center;">
              <span>Waiting transactions to be signed</span>
            </div>
            <el-table
              row-class-name="transactions__table-row"
              :data="allPendingTransactions">
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <p>
                    {{ scope.row.from }} transfered  {{ scope.row.amount + ' ' + wallets.find(w => w.assetId = scope.row.assetId).asset}} to {{ scope.row.to }}
                  </p>
                  <div>
                    <p>Was <el-tag>created</el-tag> at {{ formatDateLong(scope.row.date) }}</p>
                    <p>Message: {{ scope.row.message }}</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="Date" width="140px">
                <template slot-scope="scope">
                  {{ formatDateWith(scope.row.date, 'MMM D, HH:mm') }}
                </template>
              </el-table-column>
              <el-table-column label="Amount" width="150px">
                <template slot-scope="scope">
                  {{ (scope.row.from === 'you' ? '−' : '+') + Number(scope.row.amount) + ' ' + wallets.find(w => w.assetId = scope.row.assetId).asset}}
                </template>
              </el-table-column>
              <el-table-column label="Address" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.to === 'notary' ? 'Withdrawal ' : '' }}to {{ scope.row.to === 'notary' ? scope.row.message : scope.row.to }}
                </template>
              </el-table-column>
              <el-table-column label="Description" min-width="200">
                <template slot-scope="scope">
                  <div>
                    <div v-if="scope.row.from === 'notary' || scope.row.to === 'notary'"></div>
                    <div v-else>{{ scope.row.message }}</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="Signs" min-width="50">
                <template slot-scope="scope">
                  {{ scope.row.signatures }} / {{ accountQuorum }}
                </template>
              </el-table-column>
              <el-table-column min-width="130px">
                <template slot-scope="scope">
                  <div>
                    <el-button
                      @click="onSubmitTransferForm(row.scope.id)"
                      size="medium"
                      type="primary"
                      plain
                    >
                      Add signatures
                    </el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import dateFormat from '@/components/mixins/dateFormat'
import numberFormat from '@/components/mixins/numberFormat'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'transaction-page',
  mixins: [
    dateFormat,
    numberFormat
  ],
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'allPendingTransactions',
      'wallets',
      'accountQuorum'
    ])
  },
  created () {
    this.$store.dispatch('getPendingTransactions')
  },
  methods: {
    ...mapActions([
      'openApprovalDialog'
    ]),
    onSubmitTransferForm (txStoreId) {
      this.openApprovalDialog()
        .then(privateKeys => {
          if (!privateKeys) return
          this.isSending = true

          return this.$store.dispatch('signPendingTransaction', {
            privateKeys,
            txStoreId
          })
            .then(() => {
              this.$message({
                message: 'Transaction succesfuly finalised and sent!',
                type: 'success'
              })
              this.fetchWallet()
              this.resetTransferForm()
              this.transferFormVisible = false
            })
            .catch(err => {
              console.error(err)
              this.$alert(err.message, 'Transaction signing error', {
                type: 'error'
              })
            })
        })
        .finally(() => { this.isSending = false })
    }

  }
}
</script>

<style>
.transactions__table-row {
  height: 72px;
}
</style>
