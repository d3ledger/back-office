<template>
  <div v-if="wallet.assetId">
    <el-row style="margin-bottom: 20px">
      <el-col :xs="24" :lg="{ span: 22, offset: 1 }" :xl="{ span: 20, offset: 2 }">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card class="card" :body-style="{ padding: '0' }">
              <div class="card_header">
                <div class="card_header-title">
                  <div>{{ wallet.name }}</div>
                  <asset-icon :asset="wallet.asset" :size="17" style="color: black;"/>
                </div>
              </div>
              <div class="top-left-card">
                <div class="amount">
                  <el-tooltip class="item" effect="dark" :content="`${ amountWithPrecision } ${ wallet.asset }`" placement="top-start">
                    <h2 class="text-overflow">{{ wallet.amount | fitAmount }} {{ wallet.asset }}</h2>
                  </el-tooltip>
                </div>
                <div class="card_actions">
                  <div role="button" class="card_actions-button button" @click="receiveFormVisible = true">
                    <fa-icon class="card_actions-button-text" icon="angle-double-down" />
                    <span class="card_actions-button-text" data-cy="deposit">Deposit</span>
                  </div>
                  <div role="button" class="card_actions-button button" @click="withdrawFormVisible = true">
                    <fa-icon class="card_actions-button-text" icon="angle-double-up" />
                    <span class="card_actions-button-text" data-cy="withdraw">Withdraw</span>
                  </div>
                  <div role="button" class="card_actions-button button" @click="transferFormVisible = true">
                    <fa-icon class="card_actions-button-text" icon="arrow-right" />
                    <span class="card_actions-button-text" data-cy="transfer">Transfer</span>
                  </div>
                  <div role="button" class="card_actions-button button" @click="openExchangeDialog(wallet.asset)">
                    <fa-icon class="card_actions-button-text" icon="exchange-alt" />
                    <span class="card_actions-button-text" data-cy="exchange">Exchange</span>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="card" :body-style="{ padding : '0' }">
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

              <div class="card-info" v-loading="cryptoInfo.isLoading">
                <el-row style="margin-bottom: 20px">
                  <el-col :span="9">
                    <p
                      class="card-info-amount"
                      :title="`the current price of 1 ${wallet.asset} in ${settingsView.fiat}`"
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
                      class="card-info-amount"
                      :title="`the current price of 1 ${wallet.asset} in ${settingsView.crypto}`"
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
                      class="card-info-amount--small"
                      :title="`the market cap in ${settingsView.fiat}`"
                    >
                      {{ cryptoInfo.market.cap.fiat | formatNumberShort }} {{ currencySymbol }}
                    </p>
                    <p
                      class="card-info-amount--small"
                      :title="`the market cap in ${wallet.asset}`"
                    >
                      {{ cryptoInfo.market.cap.crypto | formatNumberShort }} {{ wallet.asset }}
                    </p>
                  </el-col>
                  <el-col :span="8">
                    <p class="card-info-title">Volume ({{ selectedMarketPeriod }})</p>
                    <p
                      class="card-info-amount--small"
                      :title="`the amount ${wallet.asset} has been traded in ${selectedMarketPeriod} against ALL its trading pairs, in terms of ${settingsView.fiat}`"
                    >
                      {{ cryptoInfo.market.volume.fiat | formatNumberShort }} {{ currencySymbol }}
                    </p>
                    <p
                      class="card-info-amount--small"
                      :title="`the amount ${wallet.asset} has been traded in ${selectedMarketPeriod} against ALL its trading pairs, in terms of ${wallet.asset}`"
                    >
                      {{ cryptoInfo.market.volume.crypto | formatNumberShort }} {{ wallet.asset }}
                    </p>
                  </el-col>
                  <el-col :span="7">
                    <p class="card-info-title">Circulating Supply</p>
                    <p
                      class="card-info-amount--small"
                      :title="`the total supply in ${wallet.asset}`"
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
      <el-col :xs="24" :lg="{ span: 22, offset: 1 }" :xl="{ span: 20, offset: 2 }">
        <el-card :body-style="{ padding: '0' }">
          <div class="card_header">
            <div class="card_header-title">
              <span class="card_header-name card_history-title">History</span>
              <el-button size="medium" type="primary" @click="fetchWallet">Refresh</el-button>
            </div>
          </div>
          <el-table
            :data="transactions"
            ref="table"
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
                          <span v-else-if="scope.row.from === 'notary'">DEPOSIT</span>
                          <span v-else>TRANSFER</span>
                        </p>
                        <p>
                          <span class="transaction_details-title">Amount:</span>
                          {{ scope.row.from === 'you' ? '−' : '+' }} {{ scope.row.amount | formatPrecision }}
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
            <el-table-column label="Date" width="130">
              <template slot-scope="scope">
                <span v-if="scope.row.from.to">
                  {{ formatDate(scope.row.from.date) }}
                </span>
                <span v-else>
                  {{ formatDate(scope.row.date) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="Type" width="130">
              <template slot-scope="scope">
                <span v-if="scope.row.from.to">EXCHANGE</span>
                <span v-else-if="scope.row.to === 'notary'">WITHDRAWAL</span>
                <span v-else-if="scope.row.from === 'notary'">DEPOSIT</span>
                <span v-else>TRANSFER</span>
              </template>
            </el-table-column>
            <el-table-column label="Amount" width="130" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="table_amount" v-if="scope.row.from.to">
                  <p>- {{ scope.row.from.amount | formatPrecision }} {{ assetName(scope.row.from.assetId) }} </p>
                  <p>+ {{ scope.row.to.amount | formatPrecision }} {{ assetName(scope.row.to.assetId) }}</p>
                </span>
                <span class="table_amount" v-else>
                  {{ scope.row.from === 'you' ? '−' : '+' }} {{ scope.row.amount | formatPrecision }} {{ wallet.asset }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="Address" min-width="130" show-overflow-tooltip>
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
            <el-table-column prop="message" label="Description" min-width="160" show-overflow-tooltip>
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
            class="wallet-pagination"
            :pager-count="11"
            :page-size="10"
            layout="prev, pager, next"
            :total="paginationMeta.allTransactionsSize"
            @current-change="onNextPage"
          >
          </el-pagination>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog
      :title="'Withdraw'"
      :visible.sync="withdrawFormVisible"
      @close="closeWithdrawDialog()"
      width="450px"
      center
    >
      <el-form
        ref="withdrawForm"
        :model="withdrawForm"
        class="withdraw_form"
      >
        <el-form-item label="I send" prop="amount">
          <el-input
            name="amount"
            v-model="$v.withdrawForm.amount.$model"
            placeholder="0"
            type="number"
            :class="[
              _isValid($v.withdrawForm.amount) ? 'border_success' : '',
              _isError($v.withdrawForm.amount) ? 'border_fail' : ''
            ]"
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
        <span class="form-item-text">
          Available balance:
          <span class="form-item-text-amount">
            {{wallet.amount | formatPrecision}} {{wallet.asset}}
          </span>
        </span>
        <el-form-item label="Address" prop="wallet">
          <el-input
            v-if="!withdrawWalletAddresses.length"
            v-model="$v.withdrawForm.wallet.$model"
            placeholder="withdrawal address"
            :class="[
              _isValid($v.withdrawForm.wallet) ? 'border_success' : '',
              _isError($v.withdrawForm.wallet) ? 'border_fail' : ''
            ]"
          />
          <el-select
            v-else
            v-model="$v.withdrawForm.wallet.$model"
            placeholder="Select withdrawal address"
            :class="[
              'withdraw-wallet_select',
              _isValid($v.withdrawForm.wallet) ? 'border_success' : '',
              _isError($v.withdrawForm.wallet) ? 'border_fail' : ''
            ]"
          >
            <el-option
              v-for="address in withdrawWalletAddresses"
              :key="address"
              :label="address"
              :value="address">
            </el-option>
          </el-select>
          <span
            v-if="_isError($v.withdrawForm.wallet)"
            class="el-form-item__error"
          >{{ _showError($v.withdrawForm.wallet) }}</span>
        </el-form-item>
        <el-form-item>
          <el-button
            class="fullwidth black clickable"
            @click="onSubmitWithdrawalForm"
            :loading="isSending"
            style="margin-top: 40px"
          >
            Withdraw
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="Deposit"
      :visible.sync="receiveFormVisible"
      width="450px"
      center
    >
      <div style="display: flex; flex-direction: column; align-items: center;">
        <div style="text-align: center; margin-bottom: 20px">
          <p>Scan QR code or send your {{ wallet.asset }} to</p>
          <p><span data-cy="deposit-address" class="monospace">{{ walletAddress }}</span></p>
        </div>
        <qrcode-vue
          :value="walletAddress"
          :size="270"
        />
      </div>
    </el-dialog>

    <el-dialog
      title="Transfer"
      :visible.sync="transferFormVisible"
      @close="closeTransferForm()"
      width="450px"
      center
    >
      <el-form
        ref="transferForm"
        :model="transferForm"
        class="transfer_form"
      >
        <el-form-item label="I send" prop="amount">
          <el-input
            name="amount"
            v-model="$v.transferForm.amount.$model"
            placeholder="0"
            type="number"
            :class="[
              _isValid($v.transferForm.amount) ? 'border_success' : '',
              _isError($v.transferForm.amount) ? 'border_fail' : ''
            ]"
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
        <span class="form-item-text">
          Available balance:
          <span class="form-item-text-amount">
            {{wallet.amount | formatPrecision}} {{wallet.asset}}
          </span>
        </span>
        <el-form-item label="Counterparty" prop="to">
          <el-input
            v-model="$v.transferForm.to.$model"
            placeholder="Account id"
            :class="[
              _isValid($v.transferForm.to) ? 'border_success' : '',
              _isError($v.transferForm.to) ? 'border_fail' : ''
            ]"
          />
          <span
            v-if="_isError($v.transferForm.to)"
            class="el-form-item__error"
          >{{ _showError($v.transferForm.to) }}</span>
        </el-form-item>
        <el-form-item label="Additional information" prop="description">
          <el-input
            v-model="$v.transferForm.description.$model"
            placeholder="Details"
            resize="none"
            :class="[
              _isValid($v.transferForm.description) ? 'border_success' : '',
              _isError($v.transferForm.description) ? 'border_fail' : ''
            ]"
          />
          <span
            v-if="_isError($v.transferForm.description)"
            class="el-form-item__error"
          >{{ _showError($v.transferForm.description) }}</span>
        </el-form-item>
      </el-form>
      <el-button
        class="fullwidth black clickable"
        @click="onSubmitTransferForm"
        style="margin-top: 40px"
        :loading="isSending"
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
// TODO: Transfer form all assets
import QrcodeVue from 'qrcode.vue'
import { mapActions, mapGetters } from 'vuex'
import { lazyComponent } from '@router'
import AssetIcon from '@/components/common/AssetIcon'
import dateFormat from '@/components/mixins/dateFormat'
import numberFormat from '@/components/mixins/numberFormat'
import currencySymbol from '@/components/mixins/currencySymbol'
import messageMixin from '@/components/mixins/message'
import NOTIFICATIONS from '@/data/notifications'

import {
  _wallet,
  _amount,
  _user,
  errorHandler
} from '@/components/mixins/validation'
import { required, maxLength } from 'vuelidate/lib/validators'

// Notary account for withdrawal.
const btcNotaryAccount = process.env.VUE_APP_BTC_NOTARY_ACCOUNT || 'btc_withdrawal_service@notary'
const ethNotaryAccount = process.env.VUE_APP_ETH_NOTARY_ACCOUNT || 'notary@notary'
const BITCOIN_ASSET_NAME = 'btc#bitcoin'

export default {
  name: 'wallet',
  mixins: [
    dateFormat,
    numberFormat,
    currencySymbol,
    messageMixin,
    errorHandler
  ],
  validations () {
    return {
      withdrawForm: {
        amount: {
          required,
          _amount: _amount(this.wallet, this.wallet.assetId)
        },
        wallet: {
          required,
          _address: _wallet.address
        }
      },
      transferForm: {
        to: {
          required,
          _userDomain: _user.nameDomain,
          _userExist: _user.nameExist
        },
        amount: {
          required,
          _amount: _amount(this.wallet, this.wallet.assetId)
        },
        description: {
          maxLength: maxLength(64)
        }
      }
    }
  },
  components: {
    AssetIcon,
    QrcodeVue,
    NoAssetsCard: lazyComponent('common/NoAssetsCard')
  },
  data () {
    return {
      activePage: 1,
      receiveFormVisible: false,
      withdrawFormVisible: false,
      transferFormVisible: false,
      isSending: false,
      withdrawForm: {
        amount: null,
        wallet: null
      },
      transferForm: {
        to: null,
        amount: null,
        description: ''
      },
      marketPeriods: ['1H', '1D', '1W', '1M', '1Y'],
      selectedMarketPeriod: '1D'
    }
  },

  computed: {
    ...mapGetters([
      'cryptoInfo',
      'settingsView',
      'ethWalletAddress',
      'btcWalletAddress',
      'withdrawWalletAddresses',
      'getTransactionsByAssetId',
      'accountQuorum',
      'wallets',
      'getPaginationMetaByAssetId'
    ]),

    wallet () {
      const walletId = this.$route.params.walletId

      return this.$store.getters.wallets.find(w => (w.id === walletId)) || {}
    },

    paginationMeta () {
      if (!this.wallet) return []
      return this.getPaginationMetaByAssetId(this.wallet.assetId)
    },

    transactions () {
      if (!this.wallet) return []
      const paging = [this.activePage * 10 - 10, this.activePage * 10]
      return this.getTransactionsByAssetId(this.wallet.assetId)
        .slice()
        .sort((t1, t2) => {
          const date1 = t1.date ? t1.date : t1.from ? t1.from.date : t1.from ? t1.from.date : 0
          const date2 = t2.date ? t2.date : t2.from ? t2.from.date : t2.from ? t2.from.date : 0
          return date2 - date1
        })
        .slice(...paging)
    },

    displayPrecision () {
      return this.wallet.precision < 4 ? this.wallet.precision : 4
    },

    amountWithPrecision () {
      return numberFormat.filters.formatPrecision(this.wallet.amount)
    },

    walletAddress () {
      return this.wallet.assetId === BITCOIN_ASSET_NAME ? this.btcWalletAddress : this.ethWalletAddress
    }
  },

  watch: {
    selectedMarketPeriod () { this.updateMarketCard() }
  },

  created () {
    if (this.wallet.assetId) {
      this.fetchWallet()
    }
  },

  methods: {
    ...mapActions([
      'openApprovalDialog',
      'openExchangeDialog',
      'getAccountAssets',
      'getAccountAssetTransactions',
      'getAccountAssetTransactionsNextPage',
      'getCryptoFullData',
      'transferAsset'
    ]),

    fetchWallet () {
      this.getAccountAssets()
      this.getAccountAssetTransactions({
        assetId: this.wallet.assetId
      })
        .then(() => {
          this.updateMarketCard()
        })
    },

    updateMarketCard () {
      return this.getCryptoFullData({
        filter: this.selectedMarketPeriod,
        asset: this.wallet.asset
      })
    },

    onSubmitWithdrawalForm () {
      this.$v.withdrawForm.$touch()
      if (this.$v.withdrawForm.$invalid) return

      this.openApprovalDialog()
        .then(privateKeys => {
          if (!privateKeys) return
          this.isSending = true
          const notaryAccount = this.wallet.assetId === BITCOIN_ASSET_NAME ? btcNotaryAccount : ethNotaryAccount

          return this.transferAsset({
            privateKeys,
            assetId: this.wallet.assetId,
            to: notaryAccount,
            description: this.withdrawForm.wallet,
            amount: this.withdrawForm.amount.toString()
          })
            .then(() => {
              let completed = privateKeys.length === this.accountQuorum
              this.$_showMessageFromStatus(
                completed,
                NOTIFICATIONS.WITHDRAWAL_SUCCESS,
                NOTIFICATIONS.NOT_COMPLETED
              )

              this.fetchWallet()
              this.closeWithdrawDialog()
              this.withdrawFormVisible = false
            })
            .catch(err => {
              console.error(err)
              this.$_showErrorAlertMessage(err.message, 'Withdrawal error')
            })
        })
        .finally(() => { this.isSending = false })
    },

    onSubmitTransferForm () {
      this.$v.transferForm.$touch()
      if (this.$v.transferForm.$invalid) return

      this.openApprovalDialog()
        .then(privateKeys => {
          if (!privateKeys) return
          this.isSending = true

          return this.transferAsset({
            privateKeys,
            assetId: this.wallet.assetId,
            to: this.transferForm.to,
            description: this.transferForm.description,
            amount: this.transferForm.amount
          })
            .then(() => {
              let completed = privateKeys.length === this.accountQuorum
              this.$_showMessageFromStatus(
                completed,
                NOTIFICATIONS.TRANSFER_SUCCESS,
                NOTIFICATIONS.NOT_COMPLETED
              )

              this.fetchWallet()
              this.closeTransferForm()
              this.transferFormVisible = false
            })
            .catch(err => {
              console.error(err)
              this.$_showErrorAlertMessage(err.message, 'Transfer error')
            })
        })
        .finally(() => { this.isSending = false })
    },

    resetTransferForm () {
      if (this.$refs.transferForm) {
        this.$v.$reset()
        this.$refs.transferForm.resetFields()
      }
    },

    resetWithdrawForm () {
      if (this.$refs.withdrawForm) {
        this.$v.$reset()
        this.$refs.withdrawForm.resetFields()
      }
    },

    closeWithdrawDialog () {
      this.resetWithdrawForm()
    },

    closeTransferForm () {
      this.resetTransferForm()
    },

    onNextPage (page) {
      this.getAccountAssetTransactionsNextPage({
        page: this.page,
        assetId: this.wallet.assetId
      })
      this.activePage = page
    }
  },

  filters: {
    fitAmount (amount) {
      return numberFormat.filters.formatPrecision(amount)
    }
  }
}
</script>
<style scoped>
.header {
  background-color: #494949;
  padding: 30px 20px;
  color: white;
}

.title {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.title-text {
  font-weight: 600;
  font-size: 1rem;
  margin: 0;
}

.title-icon {
  width: 40px;
  margin-right: 15px;
}

.amount {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 1.5rem 0 0.5rem 1.5rem;
}

.card {
  height: 14rem;
}

.card_header {
  padding: 0.9rem 1.5rem;
}

.card_header-divided {
  border-bottom: 2px solid #f5f5f5;
}

.card_header-title {
  font-size: 0.9rem;
  display: flex;
  justify-content: space-between;
}

.card_header-name {
  padding: 1rem 0 0 1rem;
}

.card_header-filter {
  display: flex;
  justify-content: center;
}

.card_history-title {
  font-size: 1.2rem;
}

.chart_time-filter {
  justify-content: center;
  opacity: 0.3;
  padding: 1rem;
  cursor: pointer;
}
.chart_time-filter.selected {
  opacity: 1;
  font-weight: 600;
  background-color: #f5f5f5;
  border-bottom: 2px solid #000000;
}

.top-left-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.top-left-card >>> .button {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 15px 10px;
  border-top: 1px solid #e8e8e8;
  flex-grow: 1;
  color: rgba(0, 0, 0, 0.35);
  cursor: pointer;
}

.top-left-card >>> .button:hover {
  background: #409eff;
}

.top-left-card >>> .button:active {
  background: #227ede;
}

.top-left-card >>> .button:hover *{
  color: #ffffff;
}

.top-left-card >>> .button>span{
 margin-top: 5px;
}

.top-left-card >>> .button+.button {
  border-left: 1px solid #e8e8e8;
}

.card_actions {
  width: 100%;
  display: flex;
  margin-top: 1.3rem;
}

.card_actions-button {
  background-color: #f9fcff;
}

.card_actions-button:hover {
  background-color: #f9fcff;
}

.card_actions-button-text {
  color: #409eff;
}

.card-info {
  margin-top: 1.3rem;
  font-size: 12px;
  line-height: 1.3rem;
  padding: 0rem 0 0rem 1.5rem;
}

.card-info .uptrend {
  color: #06b023;
}

.card-info .downtrend {
  color: #ff1339;
}
.card-info-title {
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 4px;
}

.card-info-amount {
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 4px;
}

.card-info-amount--small {
  word-break: break-all;
}

.icon {
  width: 17x;
  font-size: 17px;
}

.withdraw-wallet_select {
  width: 100%;
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
