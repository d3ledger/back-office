<!--
  Copyright D3 Ledger, Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0
-->
<template>
  <div v-if="wallet.assetId">
    <el-row style="margin-bottom: 0.5rem">
      <el-col :span="24">
        <el-row :gutter="8">
          <el-col :span="12">
            <el-card
              :body-style="{ padding: '0' }"
              class="card"
            >
              <div class="card_header">
                <div class="card_header-title">
                  <div>{{ wallet.name }}</div>
                  <asset-icon
                    :asset="wallet.asset"
                    :size="17"
                    style="color: black;"
                  />
                </div>
              </div>
              <div class="top-left-card">
                <div class="amount">
                  <el-tooltip
                    :content="`${ amountWithPrecision } ${ wallet.asset }`"
                    class="item"
                    effect="dark"
                    placement="top-start"
                  >
                    <h2 class="text-overflow">{{ wallet.amount | fitAmount }} {{ wallet.asset }}</h2>
                  </el-tooltip>
                </div>
                <div class="card_actions">
                  <div
                    v-if="accountExist"
                    role="button"
                    class="card_actions-button button"
                    @click="receiveFormVisible = true"
                  >
                    <fa-icon
                      class="card_actions-button-text"
                      icon="angle-double-down"
                    />
                    <span
                      class="card_actions-button-text"
                      data-cy="deposit"
                    >Deposit</span>
                  </div>
                  <div
                    v-if="accountExist"
                    role="button"
                    class="card_actions-button button"
                    @click="onOpenWithdrawalForm"
                  >
                    <fa-icon
                      class="card_actions-button-text"
                      icon="angle-double-up"
                    />
                    <span
                      class="card_actions-button-text"
                      data-cy="withdraw"
                    >Withdraw</span>
                  </div>
                  <div
                    role="button"
                    class="card_actions-button button"
                    @click="onOpenTransferForm"
                  >
                    <fa-icon
                      class="card_actions-button-text"
                      icon="arrow-right"
                    />
                    <span
                      class="card_actions-button-text"
                      data-cy="transfer"
                    >Transfer</span>
                  </div>
                  <div
                    role="button"
                    class="card_actions-button button"
                    @click="openExchangeDialog(wallet.asset)"
                  >
                    <fa-icon
                      class="card_actions-button-text"
                      icon="exchange-alt"
                    />
                    <span
                      class="card_actions-button-text"
                      data-cy="exchange"
                    >Exchange</span>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card
              :body-style="{ padding : '0' }"
              class="card"
            >
              <div class="card_header-divided">
                <div class="card_header-title">
                  <div class="card_header-name">Market</div>
                  <div class="card_header-filter">
                    <div
                      v-for="period in marketPeriods"
                      :key="period"
                      :class="[selectedMarketPeriod !== period ? 'chart_time-filter' : 'chart_time-filter selected']"
                      @click="selectedMarketPeriod = period"
                    >
                      <p class="chart_time-filter_value">{{ period }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div
                v-loading="cryptoInfo.isLoading"
                class="card-info"
              >
                <el-row style="margin-bottom: 20px">
                  <el-col :span="9">
                    <p
                      :title="`the current price of 1 ${wallet.asset} in ${settingsView.fiat}`"
                      class="card-info-amount"
                    >
                      {{ cryptoInfo.current.fiat | formatNumberLong }} {{ currencySymbol }}
                    </p>

                    <p
                      :class="[cryptoInfo.current.fiat_change > 0 ? 'uptrend' : 'downtrend']"
                      :title="`the change (${settingsView.fiat}) from ${selectedMarketPeriod} ago`"
                    >
                      {{ cryptoInfo.current.fiat_change | formatNumberShort }}
                    </p>
                  </el-col>
                  <el-col :span="15">
                    <p
                      :title="`the current price of 1 ${wallet.asset} in ${settingsView.crypto}`"
                      class="card-info-amount"
                    >
                      {{ cryptoInfo.current.crypto | formatNumberLong }} {{ settingsView.crypto }}
                    </p>

                    <p
                      :class="[cryptoInfo.current.crypto_change > 0 ? 'uptrend' : 'downtrend']"
                      :title="`the change (%) from ${selectedMarketPeriod} ago`"
                    >
                      {{ cryptoInfo.current.crypto_change | formatPercent }}
                    </p>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="9">
                    <p class="card-info-title">Market Cap</p>
                    <p
                      :title="`the market cap in ${settingsView.fiat}`"
                      class="card-info-amount--small"
                    >
                      {{ cryptoInfo.market.cap.fiat | formatNumberShort }} {{ currencySymbol }}
                    </p>
                    <p
                      :title="`the market cap in ${wallet.asset}`"
                      class="card-info-amount--small"
                    >
                      {{ cryptoInfo.market.cap.crypto | formatNumberShort }} {{ wallet.asset }}
                    </p>
                  </el-col>
                  <el-col :span="8">
                    <p class="card-info-title">Volume ({{ selectedMarketPeriod }})</p>
                    <p
                      :title="`the amount ${wallet.asset} has been traded in ${selectedMarketPeriod} against ALL its trading pairs, in terms of ${settingsView.fiat}`"
                      class="card-info-amount--small"
                    >
                      {{ cryptoInfo.market.volume.fiat | formatNumberShort }} {{ currencySymbol }}
                    </p>
                    <p
                      :title="`the amount ${wallet.asset} has been traded in ${selectedMarketPeriod} against ALL its trading pairs, in terms of ${wallet.asset}`"
                      class="card-info-amount--small"
                    >
                      {{ cryptoInfo.market.volume.crypto | formatNumberShort }} {{ wallet.asset }}
                    </p>
                  </el-col>
                  <el-col :span="7">
                    <p class="card-info-title">Circulating Supply</p>
                    <p
                      :title="`the total supply in ${wallet.asset}`"
                      class="card-info-amount--small"
                    >
                      {{ cryptoInfo.market.supply | formatNumberShort }} {{ wallet.asset }}
                    </p>
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
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

    <el-dialog
      :title="'Withdraw'"
      :visible.sync="withdrawFormVisible"
      width="450px"
      center
      @close="closeWithdrawDialog()"
    >
      <el-form
        ref="withdrawForm"
        :model="withdrawForm"
        class="withdraw_form"
      >
        <el-form-item
          label="I send"
          prop="amount"
        >
          <el-input
            v-numeric
            v-model="$v.withdrawForm.amount.$model"
            :class="[
              _isValid($v.withdrawForm.amount) ? 'border_success' : '',
              _isError($v.withdrawForm.amount) ? 'border_fail' : ''
            ]"
            name="amount"
            placeholder="0"
            type="number"
          >
            <div slot="append">
              {{ wallet.asset }}
            </div>
          </el-input>
          <span
            v-if="_isError($v.withdrawForm.amount)"
            class="el-form-item__error"
          >{{ _showError($v.withdrawForm.amount) }}</span>
        </el-form-item>
        <div>
          <div class="form-item-text">
            Available balance:
            <span class="form-item-text-amount">
              {{ wallet.amount | formatPrecision }} {{ wallet.asset }}
            </span>
          </div>
          <div class="form-item-text">
            Withdrawal fee:
            <span class="form-item-text-amount">
              {{ withdrawalFeeAmount | formatPrecision }} {{ wallet.asset }}
            </span>
          </div>
        </div>
        <el-form-item
          label="Address"
          prop="wallet"
        >
          <el-select
            v-model="$v.withdrawForm.wallet.$model"
            :class="[
              'withdraw-wallet_select',
              _isValid($v.withdrawForm.wallet) ? 'border_success' : '',
              _isError($v.withdrawForm.wallet) ? 'border_fail' : ''
            ]"
            placeholder="Select withdrawal address"
          >
            <el-option
              v-for="address in whiteListAddresses"
              :key="address"
              :label="address"
              :value="address"
            />
          </el-select>
          <span
            v-if="_isError($v.withdrawForm.wallet)"
            class="el-form-item__error"
          >{{ _showError($v.withdrawForm.wallet) }}</span>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="isSending"
            class="fullwidth black clickable"
            style="margin-top: 40px"
            @click="onSubmitWithdrawalForm"
          >
            Withdraw
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      :visible.sync="receiveFormVisible"
      title="Deposit"
      width="450px"
      center
    >
      <div style="display: flex; flex-direction: column; align-items: center;">
        <div style="text-align: center; margin-bottom: 20px">
          <p>Scan QR code or send your {{ wallet.asset }} to</p>
          <p><span
            data-cy="deposit-address"
            class="monospace"
          >{{ walletAddress }}</span></p>
        </div>
        <qrcode-vue
          :value="walletAddress"
          :size="270"
        />
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="transferFormVisible"
      title="Transfer"
      width="450px"
      center
      @close="closeTransferForm()"
    >
      <el-form
        ref="transferForm"
        :model="transferForm"
        class="transfer_form"
      >
        <el-form-item
          label="I send"
          prop="amount"
        >
          <el-input
            v-numeric
            v-model="$v.transferForm.amount.$model"
            :class="[
              _isValid($v.transferForm.amount) ? 'border_success' : '',
              _isError($v.transferForm.amount) ? 'border_fail' : ''
            ]"
            name="amount"
            placeholder="0"
            type="number"
          >
            <div slot="append">
              {{ wallet.asset }}
            </div>
          </el-input>
          <span
            v-if="_isError($v.transferForm.amount)"
            class="el-form-item__error"
          >{{ _showError($v.transferForm.amount) }}</span>
        </el-form-item>
        <div>
          <div class="form-item-text">
            Available balance:
            <span class="form-item-text-amount">
              {{ wallet.amount | formatPrecision }} {{ wallet.asset }}
            </span>
          </div>
          <div class="form-item-text">
            Transfer fee:
            <span class="form-item-text-amount">
              {{ transferFeeAmount | formatPrecision }} {{ wallet.asset }}
            </span>
          </div>
        </div>
        <el-form-item
          label="Counterparty"
          prop="to"
        >
          <el-input
            v-model="$v.transferForm.to.$model"
            :class="[
              _isValid($v.transferForm.to) ? 'border_success' : '',
              _isError($v.transferForm.to) ? 'border_fail' : ''
            ]"
            placeholder="Account id"
          />
          <span
            v-if="_isError($v.transferForm.to)"
            class="el-form-item__error"
          >{{ _showError($v.transferForm.to) }}</span>
        </el-form-item>
        <el-form-item
          label="Additional information"
          prop="description"
        >
          <el-input
            v-model="$v.transferForm.description.$model"
            :class="[
              _isValid($v.transferForm.description) ? 'border_success' : '',
              _isError($v.transferForm.description) ? 'border_fail' : ''
            ]"
            placeholder="Details"
            resize="none"
          />
          <span
            v-if="_isError($v.transferForm.description)"
            class="el-form-item__error"
          >{{ _showError($v.transferForm.description) }}</span>
        </el-form-item>
      </el-form>
      <el-button
        :loading="isSending"
        class="fullwidth black clickable"
        style="margin-top: 40px"
        @click="onSubmitTransferForm"
      >
        TRANSFER
      </el-button>
    </el-dialog>
  </div>
  <div v-else>
    <no-assets-card />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { lazyComponent } from '@router'

export default {
  name: 'Wallet',
  components: {
    InfoCards: lazyComponent('Wallets/components/InfoCards'),
    HistoryTable: lazyComponent('Wallets/components/HistoryTable'),
    NoAssetsCard: lazyComponent('common/NoAssetsCard')
  },

  computed: {
    ...mapGetters([
      'wallets'
    ]),

    wallet () {
      const walletId = this.$route.params.walletId

      return this.$store.getters.wallets.find(w => (w.id === walletId)) || {}
    }
  },
  methods: {
    ...mapActions([
      'getAccountAssets',
      'getAccountAssetTransactions'
    ]),
    updateHistory () {
      this.getAccountAssets()
      this.getAccountAssetTransactions({ assetId: this.wallet.assetId })
    }
  }
}
</script>

<style scoped>
</style>
