<template>
  <div>
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
                  <h2> {{wallet.amount| formatPrecision}} {{wallet.asset}}</h2>
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
          <div class="card_header">History</div>
          <el-table
            :data="transactions"
            ref="table"
            class="wallets_table"
            @row-dblclick="(row) => this.$refs.table.toggleRowExpansion(row)"
          >
            <el-table-column type="expand">
              <template slot-scope="scope">
                <p>
                  {{ scope.row.from }} transfered  {{ scope.row.amount + ' ' + wallet.asset}} to {{ scope.row.to }}
                </p>
                <div v-if="scope.row.settlement" style="background: #F8FFF0">
                  <p>This transaction is a part of a succesfull setllement:</p>
                  <p>{{ scope.row.settlement.from }} exchanged {{ scope.row.settlement.offer_amount + ' ' + scope.row.settlement.offer_asset}} for {{ scope.row.settlement.request_amount + ' ' + scope.row.settlement.request_asset}} with {{ scope.row.settlement.to }}</p>
                  <p>Was <el-tag>created</el-tag> at {{ formatDateLong(scope.row.settlement.date) }}</p>
                  <p>Was <el-tag :type="tagType(scope.row.settlement.status)" >{{ scope.row.settlement.status }}</el-tag> at
                  {{ formatDateLong(scope.row.settlement.date) }}</p>
                  <p>Message: {{ scope.row.settlement.message }}</p>
                </div>
                <div v-else>
                  <p>Was <el-tag>created</el-tag> at {{ formatDateLong(scope.row.date) }}</p>
                  <p>Message: {{ scope.row.message }}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="Date" width="120">
              <template slot-scope="scope">
                {{ formatDate(scope.row.date) }}
              </template>
            </el-table-column>
            <el-table-column label="Amount" width="120">
              <template slot-scope="scope">
                <span class="table_amount">
                  {{ (scope.row.from === 'you' ? '−' : '+') + Number(scope.row.amount).toFixed(displayPrecision)}}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="message" label="Description" min-width="200">
              <template slot-scope="scope">
                <div v-if="scope.row.settlement">Part of a settlement <fa-icon icon="exchange-alt" /></div>
                <div v-if="scope.row.from === 'notary' || scope.row.to === 'notary'"></div>
                <div v-else>{{ scope.row.message }}</div>
              </template>
            </el-table-column>
            <el-table-column label="Address" min-width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="scope.row.from === 'you'">
                  {{ scope.row.to === 'notary' ? 'Withdrawal' : '' }} to {{ scope.row.to === 'notary' ? scope.row.message : scope.row.to }}
                </div>
                <div v-else>
                  {{ scope.row.from === 'notary' ? 'Deposit' : '' }} from {{ scope.row.from === 'notary' ? scope.row.message : scope.row.from }}
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog
      :title="'Withdraw ' + wallet.asset"
      :visible.sync="withdrawFormVisible"
      @close="closeWithdrawDialog()"
      width="500px"
      center
    >
      <el-form ref="withdrawForm" :model="withdrawForm" :rules="rules">
        <el-form-item label="I send" prop="amount">
          <el-input name="amount" v-model="withdrawForm.amount" placeholder="0">
            <div slot="append">
              {{ wallet.asset }}
            </div>
          </el-input>
        </el-form-item>
        <span class="form-item-text">
          Available balance:
          <span class="form-item-text-amount">
            {{ wallet | toUpperCase }}
          </span>
        </span>
        <el-form-item label="Address" prop="wallet">
          <el-input
            v-if="withdrawWalletAddresses.length === 0"
            v-model="withdrawForm.wallet"
            placeholder="withdrawal address, e.g. 0x0000000000000000000000000000000000000000" />
          <el-select
            v-else
            class="withdraw-wallet_select"
            v-model="withdrawForm.wallet"
            placeholder="Select withdrawal address">
            <el-option
              v-for="address in withdrawWalletAddresses"
              :key="address"
              :label="address"
              :value="address">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-bottom: 0;">
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
      width="500px"
      center
    >
      <div style="display: flex; flex-direction: column; align-items: center;">
        <div style="text-align: center; margin-bottom: 20px">
          <p>Scan QR code or send your {{ wallet.asset }} to</p>
          <p><span class="monospace"> {{ ethWalletAddress }}</span></p>
        </div>
        <qrcode-vue
          :value="ethWalletAddress"
          :size="270"
        />
      </div>
    </el-dialog>

    <el-dialog
      title="Transfer"
      :visible.sync="transferFormVisible"
      @close="closeTransferForm()"
      width="500px"
      center
    >
      <el-form ref="transferForm" :model="transferForm" :rules="rules">
        <el-form-item label="I send" prop="amount">
          <el-input name="amount" v-model="transferForm.amount" placeholder="0">
            <div slot="append">
              {{ wallet.asset }}
            </div>
          </el-input>
        </el-form-item>
        <span class="form-item-text">
          Available balance:
          <span class="form-item-text-amount">
            {{ wallet.amount  + ' ' + wallet.asset.toUpperCase() }}
          </span>
        </span>
        <el-form-item label="Counterparty" prop="to">
          <el-input v-model="transferForm.to" placeholder="Account id" />
        </el-form-item>
        <el-form-item label="Additional information">
          <el-input
            type="textarea"
            :rows="2"
            v-model="transferForm.description"
            placeholder="Details"
            resize="none"
          />
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
</template>

<script>
// TODO: Transfer form all assets
import QrcodeVue from 'qrcode.vue'
import { mapActions, mapGetters } from 'vuex'
import AssetIcon from '@/components/common/AssetIcon'
import dateFormat from '@/components/mixins/dateFormat'
import numberFormat from '@/components/mixins/numberFormat'
import currencySymbol from '@/components/mixins/currencySymbol'
import inputValidation from '@/components/mixins/inputValidation'

// Notary account for withdrawal.
const notaryAccount = process.env.VUE_APP_NOTARY_ACCOUNT || 'notary_red@notary'

export default {
  name: 'wallet',
  mixins: [
    dateFormat,
    numberFormat,
    currencySymbol,
    inputValidation({
      to: 'nameDomain',
      amount: 'tokensAmount',
      wallet: 'walletAddress'
    })
  ],
  components: {
    AssetIcon,
    QrcodeVue
  },
  data () {
    return {
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
      marketPeriods: ['1H', '1D', '1W', '1M', '1Y', 'ALL'],
      selectedMarketPeriod: '1D'
    }
  },

  computed: {
    ...mapGetters([
      'cryptoInfo',
      'settingsView',
      'ethWalletAddress',
      'withdrawWalletAddresses'
    ]),

    wallet () {
      const walletId = this.$route.params.walletId

      return this.$store.getters.wallets.find(w => (w.id === walletId)) || {}
    },

    transactions () {
      if (!this.wallet) return []

      return this.$store.getters.getTransactionsByAssetId(this.wallet.assetId)
    },

    displayPrecision () {
      return this.wallet.precision < 4 ? this.wallet.precision : 4
    }
  },

  watch: {
    selectedMarketPeriod () { this.updateMarketCard() }
  },

  created () {
    this.fetchWallet()
  },

  beforeUpdate () {
    this._refreshRules({
      amount: { pattern: 'tokensAmount', amount: this.wallet.amount, precision: this.wallet.precision }
    })
  },

  methods: {
    ...mapActions([
      'openApprovalDialog',
      'openExchangeDialog'
    ]),

    tagType: function (val) {
      val = val.toLowerCase()
      if (val === 'accepted') return 'success'
      if (val === 'rejected') return 'danger'
      if (val === 'canceled') return 'info'
      return ''
    },

    fetchWallet () {
      this.$store.dispatch('getAccountAssets')
        .then(() => {
          this.$store.dispatch('getAccountAssetTransactions', { assetId: this.wallet.assetId })
          this.updateMarketCard()
        })
    },

    updateMarketCard () {
      return this.$store.dispatch('getCryptoFullData', { filter: this.selectedMarketPeriod, asset: this.wallet.asset })
    },

    onSubmitWithdrawalForm () {
      if (!this.validateForm('withdrawForm')) return

      this.openApprovalDialog()
        .then(privateKeys => {
          if (!privateKeys) return

          this.isSending = true

          return this.$store.dispatch('transferAsset', {
            privateKeys,
            assetId: this.wallet.assetId,
            to: notaryAccount,
            description: this.withdrawForm.wallet,
            amount: this.withdrawForm.amount.toString()
          })
            .then(() => {
              this.$message({
                message: 'Withdrawal request is submitted to notary!',
                type: 'success'
              })
              this.resetWithdrawForm()
              this.fetchWallet()
              this.withdrawFormVisible = false
            })
            .catch(err => {
              console.error(err)
              this.$alert(err.message, 'Withdrawal error', {
                type: 'error'
              })
            })
        })
        .finally(() => { this.isSending = false })
    },

    onSubmitTransferForm () {
      if (!this.validateForm('transferForm')) return
      this.openApprovalDialog()
        .then(privateKeys => {
          if (!privateKeys) return
          this.isSending = true

          return this.$store.dispatch('transferAsset', {
            privateKeys,
            assetId: this.wallet.assetId,
            to: this.transferForm.to,
            description: this.transferForm.description,
            amount: this.transferForm.amount.toString()
          })
            .then(() => {
              this.$message({
                message: 'Transfer successful!',
                type: 'success'
              })
              this.fetchWallet()
              this.resetTransferForm()
              this.transferFormVisible = false
            })
            .catch(err => {
              console.error(err)
              this.$alert(err.message, 'Transfer error', {
                type: 'error'
              })
            })
        })
        .finally(() => { this.isSending = false })
    },

    resetTransferForm () {
      this.$refs.transferForm.resetFields()
    },

    resetWithdrawForm () {
      this.$refs.withdrawForm.resetFields()
    },

    closeWithdrawDialog () {
      this.resetWithdrawForm()
    },

    closeTransferForm () {
      this.resetTransferForm()
      this.transferForm.description = ''
    },

    validateForm (ref) {
      let isValid = true
      this.$refs[ref].validate(valid => {
        if (!valid) isValid = false
      })
      return isValid
    }
  },

  filters: {
    toUpperCase (wallet) {
      if (!wallet || !Object.keys(wallet).length) return null
      return `${wallet.amount} ${wallet.asset.toUpperCase()}`
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
  justify-content: center
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

.card-header {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: space-between;
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
.wallets_table >>> .el-table__header th {
  font-weight: 500;
}
.wallets_table >>> .el-table__row td .cell {
  color: #000000;
}
.table_amount {
  font-weight: 600;
}
</style>
