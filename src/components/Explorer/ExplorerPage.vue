<template>
  <el-container>
    <el-main>
      <el-row>
        <el-col :xs="24" :lg="{ span: 18, offset: 3 }" :xl="{ span: 16, offset: 4 }">
          <el-card :body-style="{ padding: '0' }">
            <div class="header">
              <span>Transactions</span>
            </div>
            <el-row>
              <el-col :span="12">
                <el-input v-model="searchField" @input="search($event)"/>
              </el-col>
              <el-col :span="12">
                <el-radio-group v-model="currentSearchType" size="small">
                  <el-radio
                    v-for="(value, index) in searchType"
                    :key="index"
                    :label="value"
                    class="currencies_list-select"
                    border
                  >{{ value }}</el-radio>
                </el-radio-group>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-date-picker
                  style="width: 100%"
                  v-model="dateFrom"
                  type="datetime"
                />
              </el-col>
              <el-col :span="12">
                <el-date-picker
                  style="width: 100%"
                  v-model="dateTo"
                  type="datetime"
                />
              </el-col>
            </el-row>
            <el-table
              class="transactions_table"
              :data="transactions">
              <el-table-column label="Time" min-width="175" sortable>
                <template slot-scope="scope">
                  {{ formatDateLong(scope.row.payload.reducedPayload.createdTime) }}
                </template>
              </el-table-column>
              <el-table-column label="From" sortable>
                <template slot-scope="scope">
                  {{ scope.row.payload.reducedPayload.commandsList[0].transferAsset.srcAccountId }}
                </template>
              </el-table-column>
              <el-table-column label="To" sortable>
                <template slot-scope="scope">
                  {{ scope.row.payload.reducedPayload.commandsList[0].transferAsset.destAccountId }}
                </template>
              </el-table-column>
              <el-table-column label="Amount" sortable>
                <template slot-scope="scope">
                  {{ scope.row.payload.reducedPayload.commandsList[0].transferAsset.amount }}
                </template>
              </el-table-column>
              <el-table-column label="Asset" sortable>
                <template slot-scope="scope">
                  {{ assetName(scope.row.payload.reducedPayload.commandsList[0].transferAsset.assetId) }}
                </template>
              </el-table-column>
              <el-table-column label="Description">
                <template slot-scope="scope">
                  {{ scope.row.payload.reducedPayload.commandsList[0].transferAsset.description }}
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
import { mapActions, mapGetters } from 'vuex'
import dateFormat from '@/components/mixins/dateFormat'
import currencySymbol from '@/components/mixins/currencySymbol'

const BLOCK_TYPE = 'Block'
const TRANSACTION_TYPE = 'Transaction'
const ACCOUNT_TYPE = 'Account'

export default {
  name: 'explorer-page',
  mixins: [
    dateFormat,
    currencySymbol
  ],
  data () {
    return {
      searchField: '',
      searchType: [BLOCK_TYPE, TRANSACTION_TYPE, ACCOUNT_TYPE],
      currentSearchType: ACCOUNT_TYPE,
      dateFrom: 0,
      dateTo: 0
    }
  },
  computed: {
    ...mapGetters([
      'searchedTransactions'
    ]),
    transactions () {
      let transactions = [...this.searchedTransactions]

      if (this.dateFrom > 0) {
        transactions = transactions.filter(item => item.payload.reducedPayload.createdTime > +this.dateFrom)
      }

      if (this.dateTo > 0) {
        transactions = transactions.filter(item => item.payload.reducedPayload.createdTime < +this.dateTo)
      }

      return transactions
    }
  },

  beforeUpdate () {
    console.log(this.searchedTransactions)
  },

  methods: {
    ...mapActions([
      'searchTransactionById',
      'searchTransactionsByAccountId',
      'searchTransactionsByBlock'
    ]),
    search () {
      switch (this.currentSearchType) {
        case BLOCK_TYPE:
          this.searchTransactionsByBlock({height: this.searchField})
          break
        case TRANSACTION_TYPE:
          this.searchTransactionById({transactionId: this.searchField})
          break
        case ACCOUNT_TYPE:
          this.searchTransactionsByAccountId({accountId: this.searchField})
          break
      }
    }
  }
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem;
}
.transactions_table {
  padding: 0.9rem 1.5rem;
}
.transactions_table >>> .el-table__header th {
  font-weight: 500;
}
.transactions_table >>> .el-table__row td .cell {
  color: #000000;
}
.transactions_table-row {
  height: 72px;
  color: #000000;
}
.transaction_details {
  font-size: 0.8rem;
  color: #000000;
}
.transaction_action >>> button {
  background: #ffffff;
  text-transform: uppercase;
  padding: 0.7rem;
}
</style>
