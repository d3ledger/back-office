<template>
  <el-row>
    <el-col :span="24">
      <el-card :body-style="{ padding: '0' }">
        <div class="card_header">
          <div class="card_header-title">
            <span class="card_header-name card_history-title">History</span>
            <el-button
              size="medium"
              type="primary"
              @click="fetchWallet"
            >Refresh</el-button>
          </div>
        </div>
        <el-table
          ref="table"
          :data="transactions"
          class="wallets_table"
          @row-dblclick="(row) => this.$refs.table.toggleRowExpansion(row)"
        >
          <el-table-column type="expand">
            <template slot-scope="scope">
              <div class="transaction_details">
                <div v-if="scope.row.to.from">
                  <el-row>
                    <el-col :span="6">
                      {{ formatDateLong(scope.row.from.date) }}
                    </el-col>
                    <el-col :span="18" >
                      <p>
                        <span class="transaction_details-title">Type: </span>
                        <span>EXCHANGE</span>
                      </p>
                      <p>
                        <span class="transaction_details-title">Amount outgoing:</span>
                        {{ scope.row.from.amount | formatPrecision }} {{ assetName(scope.row.from.assetId) }}
                      </p>
                      <p>
                        <span class="transaction_details-title">Amount incoming:</span>
                        {{ scope.row.to.amount | formatPrecision }} {{ assetName(scope.row.to.assetId) }}
                      </p>
                      <p v-if="scope.row.from.fee">
                        <span class="transaction_details-title">Fee:</span>
                        - {{ scope.row.from.fee }} {{ assetName(scope.row.from.assetId) }}
                      </p>
                      <p>
                        <span class="transaction_details-title">Address:</span>
                        {{ scope.row.from.to }}
                      </p>
                      <p v-if="scope.row.from.message.length">
                        <span class="transaction_details-title">Desciption:</span>
                        {{ scope.row.from.message }}
                      </p>
                    </el-col>
                  </el-row>
                </div>
                <div v-else>
                  <el-row>
                    <el-col :span="6">
                      {{ formatDateLong(scope.row.date) }}
                    </el-col>
                    <el-col :span="18">
                      <p>
                        <span class="transaction_details-title">Type: </span>
                        <span v-if="scope.row.to === 'notary'">WITHDRAWAL</span>
                        <span v-else-if="scope.row.to === 'btc_withdrawal_service'">WITHDRAWAL</span>
                        <span v-else-if="scope.row.from === 'notary'">DEPOSIT</span>
                        <span v-else>TRANSFER</span>
                      </p>
                      <p>
                        <span class="transaction_details-title">Amount:</span>
                        {{ scope.row.from === 'you' ? '−' : '+' }} {{ scope.row.amount | formatPrecision }} {{ assetName(scope.row.assetId) }}
                      </p>
                      <p>
                        <span class="transaction_details-title">Address:</span>
                        <span v-if="scope.row.from === 'you'">
                          {{ scope.row.to === 'notary' ? 'Withdrawal' : '' }} to {{ scope.row.to === 'notary' ? scope.row.message : scope.row.to }}
                        </span>
                        <span v-else>
                          {{ scope.row.from === 'notary' ? 'Deposit' : '' }} from {{ scope.row.from === 'notary' ? scope.row.message : scope.row.from }}
                        </span>
                      </p>
                      <p v-if="scope.row.fee">
                        <span class="transaction_details-title">Fee:</span>
                        - {{ scope.row.fee }} {{ assetName(scope.row.assetId) }}
                      </p>
                      <p v-if="scope.row.message.length && scope.row.to !== 'notary' && scope.row.from !== 'notary'">
                        <span class="transaction_details-title">Desciption:</span>
                        {{ scope.row.message }}
                      </p>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="Date"
            width="130"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.from.to">
                {{ formatDate(scope.row.from.date) }}
              </span>
              <span v-else>
                {{ formatDate(scope.row.date) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="Type"
            width="130"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.from.to">EXCHANGE</span>
              <span v-else-if="scope.row.to === 'notary'">WITHDRAWAL</span>
              <span v-else-if="scope.row.to === 'btc_withdrawal_service'">WITHDRAWAL</span>
              <span v-else-if="scope.row.from === 'notary'">DEPOSIT</span>
              <span v-else>TRANSFER</span>
            </template>
          </el-table-column>
          <el-table-column
            label="Amount"
            width="130"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span
                v-if="scope.row.from.to"
                class="table_amount"
              >
                <p>- {{ scope.row.from.amount | formatPrecision }} {{ assetName(scope.row.from.assetId) }} </p>
                <p>+ {{ scope.row.to.amount | formatPrecision }} {{ assetName(scope.row.to.assetId) }}</p>
              </span>
              <span
                v-else
                class="table_amount"
              >
                {{ scope.row.from === 'you' ? '−' : '+' }} {{ scope.row.amount | formatPrecision }} {{ wallet.asset }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="Address"
            min-width="130"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span v-if="scope.row.from.to">
                {{ scope.row.from.to }}
              </span>
              <span v-else-if="scope.row.from === 'you'">
                {{ scope.row.to === 'notary' ? 'Withdrawal' : '' }} to {{ scope.row.to === 'notary' ? scope.row.message : scope.row.to }}
              </span>
              <span v-else>
                {{ scope.row.from === 'notary' ? 'Deposit' : '' }} from {{ scope.row.from === 'notary' ? scope.row.message : scope.row.from }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="message"
            label="Description"
            min-width="160"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span class="wallets_table-message">
                <p v-if="scope.row.from.to">
                  {{ scope.row.from.message }}
                </p>
                <p v-else-if="scope.row.from !== 'notary' && scope.row.to !== 'notary'">
                  {{ scope.row.message }}
                </p>
              </span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :pager-count="11"
          :page-size="10"
          :total="allTransactionsSize"
          class="wallet-pagination"
          layout="prev, pager, next"
          @current-change="onNextPage"
        />
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import dateFormat from '@/components/mixins/dateFormat'
import numberFormat from '@/components/mixins/numberFormat'
import currencySymbol from '@/components/mixins/currencySymbol'

export default {
  mixins: [
    dateFormat,
    numberFormat,
    currencySymbol
  ],
  props: {
    wallet: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  data () {
    return {
      activePage: 1
    }
  },
  computed: {
    ...mapGetters([
      'getTransactionsByAssetId',
      'getPaginationMetaByAssetId'
    ]),
    transactions () {
      if (!this.wallet) return []
      const paging = [this.activePage * 10 - 10, this.activePage * 10]
      return this.getTransactionsByAssetId(this.wallet.assetId)
        .slice()
        .sort((t1, t2) => {
          const date1 = t1.date ? t1.date : t1.from ? t1.from.date : 0
          const date2 = t2.date ? t2.date : t2.from ? t2.from.date : 0
          return date2 - date1
        })
        .slice(...paging)
    },

    paginationMeta () {
      if (!this.wallet.assetId) return {}
      return this.getPaginationMetaByAssetId(this.wallet.assetId)
    },

    allTransactionsSize () {
      if (!this.paginationMeta) return 1
      return this.paginationMeta.allTransactionsSize
    }
  },
  methods: {
    ...mapActions([
      'getAccountAssetTransactionsNextPage'
    ]),

    onNextPage (page) {
      this.activePage = page
      this.getAccountAssetTransactionsNextPage({
        page,
        assetId: this.wallet.assetId
      })
    }
  }
}
</script>

<style scoped>
.card {
  height: 14rem;
}

.card_header {
  padding: 0.9rem 1.5rem;
}

.card_header-title {
  font-size: 0.9rem;
  display: flex;
  justify-content: space-between;
}

.card_header-name {
  padding: 1rem 0 0 1rem;
}

.card_history-title {
  font-size: 1.2rem;
}

.wallets_table {
  font-size: 0.8rem;
}
.wallets_table >>> .el-table__header th {
  font-weight: 500;
}
.wallets_table >>> .el-table__row td .cell {
  color: #000000;
}
.wallets_table >>> .el-table__body tr {
  height: 4.5rem;
}
.wallets_table-message > p {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.table_amount {
  font-weight: 600;
}
.wallets_table >>> .el-table__expanded-cell {
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
.transaction_details-message {
  word-break: break-all;
}
.transaction_details-title {
  font-weight: 600;
}
.withdraw_form >>> .el-form-item__label::before,
.transfer_form >>> .el-form-item__label::before {
  content: '';
}

.wallet-pagination {
  display: flex;
  justify-content: center;
  padding: 0;
}

.wallet-pagination >>> .el-icon {
  line-height: 4rem;
  opacity: 0.5;
}

.wallet-pagination >>> .el-icon:hover {
  color: #000000;
  opacity: 1;
}

.wallet-pagination >>> .number {
  height: 4rem;
  width: 3rem;
  line-height: 4rem;
  opacity: 0.5;
}

.wallet-pagination >>> .number:hover {
  color: #000000;
  opacity: 1;
}

.wallet-pagination >>> .number.active {
  background-color: #f4f4f4;
  color: #000000;
  opacity: 1;
}
</style>
