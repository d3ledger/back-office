<template>
  <el-container>
    <el-main>
      <el-row>
        <el-col :xs="24" :lg="{ span: 18, offset: 3 }" :xl="{ span: 16, offset: 4 }">
          <el-card :body-style="{ padding: '0' }">
            <div class="header">
              <span>Transaction explorer</span>
            </div>
            <div class="search">
              <el-form
                style="width: 100%"
                :model="form"
                ref="form"
                @submit.native.prevent>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="Query" prop="query">
                      <el-input
                        name="query"
                        v-model="$v.form.query.$model"
                        @input="search()"
                        :placeholder="placeholder"
                        :class="[
                          _isValid($v.form.query) ? 'border_success' : '',
                          _isError($v.form.query) ? 'border_fail' : ''
                        ]"
                      />
                      <span
                        v-if="_isError($v.form.query)"
                        class="el-form-item__error"
                      >
                        {{ _showError($v.form.query) }}
                      </span>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="Search by">
                      <el-radio-group v-model="currentSearchType" size="small">
                        <el-radio
                          v-for="(value, index) in searchType"
                          :key="index"
                          :label="value"
                          class="currencies_list-select"
                          border
                          @change="search()"
                        >{{ value }}</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="11">
                    <el-form-item label="Date from">
                      <el-date-picker
                        style="width: 100%"
                        v-model="dateFrom"
                        type="datetime"
                        placeholder="Date from"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" :offset="1">
                    <el-form-item label="Date to">
                      <el-date-picker
                        style="width: 100%"
                        v-model="dateTo"
                        type="datetime"
                        placeholder="Date to"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <el-table
              class="transactions_table"
              :data="transactions"
              v-loading="explorerLoading">
              <el-table-column label="Time" min-width="175" prop="createdTime" sortable>
                <template slot-scope="scope">
                  {{ formatDateLong(scope.row.createdTime) }}
                </template>
              </el-table-column>
              <el-table-column label="From" sortable>
                <template slot-scope="scope">
                  {{ scope.row.srcAccountId }}
                </template>
              </el-table-column>
              <el-table-column label="To" prop="destAccountId" sortable>
              </el-table-column>
              <el-table-column label="Amount" prop="amount" sortable>
              </el-table-column>
              <el-table-column label="Asset" prop="assetId" sortable>
                <template slot-scope="scope">
                  {{ assetName(scope.row.assetId) }}
                </template>
              </el-table-column>
              <el-table-column label="Description" prop="description">
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
import {
  _explorerQuery,
  errorHandler
} from '@/components/mixins/validation'
import { required } from 'vuelidate/lib/validators'
import { SearchTypes } from '@/data/consts'

export default {
  name: 'explorer-page',
  mixins: [
    dateFormat,
    currencySymbol,
    errorHandler
  ],
  validations () {
    return {
      form: {
        query: {
          required,
          _explorerQuery: _explorerQuery(this.currentSearchType)
        }
      }
    }
  },
  data () {
    return {
      form: {
        query: ''
      },
      searchType: [SearchTypes.BLOCK_TYPE, SearchTypes.TRANSACTION_TYPE, SearchTypes.ACCOUNT_TYPE],
      currentSearchType: SearchTypes.ACCOUNT_TYPE,
      dateFrom: '',
      dateTo: ''
    }
  },
  computed: {
    ...mapGetters([
      'searchedTransactions',
      'explorerLoading'
    ]),
    transactions () {
      let transactions = [...this.searchedTransactions]

      if (this.dateFrom > 0) {
        transactions = transactions.filter(item => item.createdTime > this.dateFrom.getTime())
      }

      if (this.dateTo > 0) {
        transactions = transactions.filter(item => item.createdTime < this.dateTo.getTime())
      }

      return transactions
    },
    placeholder () {
      switch (this.currentSearchType) {
        case SearchTypes.BLOCK_TYPE:
          return 'Type a query, example "1"'
        case SearchTypes.TRANSACTION_TYPE:
          return 'Type a query, example "0x00000000000000000000"'
        case SearchTypes.ACCOUNT_TYPE:
          return 'Type a query, example "user@d3"'
        default:
          return 'Type a query'
      }
    }
  },

  methods: {
    ...mapActions([
      'searchTransactionById',
      'searchTransactionsByAccountId',
      'searchTransactionsByBlock'
    ]),
    search () {
      if (this._isValid(this.$v.form.query)) {
        switch (this.currentSearchType) {
          case SearchTypes.BLOCK_TYPE:
            this.searchTransactionsByBlock({height: this.form.query})
            break
          case SearchTypes.TRANSACTION_TYPE:
            this.searchTransactionById({transactionId: this.form.query})
            break
          case SearchTypes.ACCOUNT_TYPE:
            this.searchTransactionsByAccountId({accountId: this.form.query})
            break
        }
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
.search {
  padding: 0.9rem 1.5rem;
}
.search_types {
  display: flex;
  justify-content: flex-end;
  align-items: center;
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
