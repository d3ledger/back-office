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
                          {{ scope.row.from === 'notary' ? 'Deposit' : '' }} from {{ scope.row }} {{ scope.row.from === 'notary' ? scope.row.message : scope.row.from }}
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
export default {

}
</script>

<style>

</style>
