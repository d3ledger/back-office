<!--
  Copyright D3 Ledger, Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0
-->
<template>
  <div v-if="wallet.assetId">
    {{ wallet }}
    <info-cards
      :wallet="wallet"
    />
  </div>
  <div v-else>
    <no-assets-card />
  </div>
</template>

<script>
// TODO: Transfer form all assets
import { mapGetters } from 'vuex'
import { lazyComponent } from '@router'
// import dateFormat from '@/components/mixins/dateFormat'
// import numberFormat from '@/components/mixins/numberFormat'
// import currencySymbol from '@/components/mixins/currencySymbol'
// import messageMixin from '@/components/mixins/message'
// import NOTIFICATIONS from '@/data/notifications'

// import { FeeTypes } from '@/data/consts'

export default {
  name: 'Wallet',
  components: {
    InfoCards: lazyComponent('Wallets/components/InfoCards'),
    NoAssetsCard: lazyComponent('common/NoAssetsCard')
  },
  //   mixins: [
  //     dateFormat,
  //     numberFormat,
  //     currencySymbol,
  //     messageMixin
  //   ],
  //   data () {
  //     return {
  //       activePage: 1,
  //       isSending: false,
  //       marketPeriods: ['1H', '1D', '1W', '1M', '1Y'],
  //       selectedMarketPeriod: '1D'
  //     }
  //   },

  computed: {
    ...mapGetters([
      'wallets'
      // 'cryptoInfo',
      // 'settingsView',
      // 'ethWalletAddress',
      // 'btcWalletAddress',
      // 'ethWhiteListAddresses',
      // 'btcWhiteListAddresses',
      // 'getTransactionsByAssetId',
      // 'accountQuorum',
      // 'getPaginationMetaByAssetId',
      // 'transferFee',
      // 'withdrawalFee',
      // 'servicesIPs',
      // 'accountId',
      // 'currentWalletPrecision'
    ]),

    wallet () {
      const walletId = this.$route.params.walletId

      return this.$store.getters.wallets.find(w => (w.id === walletId)) || {}
    }

  //     paginationMeta () {
  //       if (!this.wallet.assetId) return {}
  //       return this.getPaginationMetaByAssetId(this.wallet.assetId)
  //     },

  //     allTransactionsSize () {
  //       if (!this.paginationMeta) return 1
  //       return this.paginationMeta.allTransactionsSize
  //     },

  //     transactions () {
  //       if (!this.wallet) return []
  //       const paging = [this.activePage * 10 - 10, this.activePage * 10]
  //       return this.getTransactionsByAssetId(this.wallet.assetId)
  //         .slice()
  //         .sort((t1, t2) => {
  //           const date1 = t1.date ? t1.date : t1.from ? t1.from.date : t1.from ? t1.from.date : 0
  //           const date2 = t2.date ? t2.date : t2.from ? t2.from.date : t2.from ? t2.from.date : 0
  //           return date2 - date1
  //         })
  //         .slice(...paging)
  //     },

  //     displayPrecision () {
  //       return this.wallet.precision < 4 ? this.wallet.precision : 4
  //     },

  //     walletAddress () {
  //       return this.wallet.assetId === BITCOIN_ASSET_NAME ? this.btcWalletAddress : this.ethWalletAddress
  //     },

  //     accountExist () {
  //       let assetDomain = this.wallet.assetId.split('#')[1]

  //       if (assetDomain === 'bitcoin' && this.btcWalletAddress) {
  //         return true
  //       }

  //       if ((assetDomain === 'ethereum' ||
  //         assetDomain === 'd3' ||
  //         assetDomain === 'sora') && this.ethWalletAddress) {
  //         return true
  //       }

  //       return false
  //     },

  //     whiteListAddresses () {
  //       return this.wallet.assetId === BITCOIN_ASSET_NAME ? this.btcWhiteListAddresses : this.ethWhiteListAddresses
  //     },

  //     currentTransferFee () {
  //       return this.transferFee[this.wallet.assetId] ? this.transferFee[this.wallet.assetId].feeFraction : 0
  //     },

  //     currentWithdrawalFee () {
  //       return this.withdrawalFee[this.wallet.assetId] ? this.withdrawalFee[this.wallet.assetId].feeFraction : 0
  //     },

  //     transferFeeAmount () {
  //       return this.$_calculateFee(
  //         this.transferForm.amount,
  //         this.currentTransferFee,
  //         this.currentWalletPrecision
  //       ).toString()
  //     },

  //     withdrawalFeeAmount () {
  //       return this.$_calculateFee(
  //         this.withdrawForm.amount,
  //         this.currentWithdrawalFee,
  //         this.currentWalletPrecision
  //       ).toString()
  //     }
  }

//   watch: {
//     selectedMarketPeriod () { this.updateMarketCard() }
//   },

//   created () {
//     if (this.wallet.assetId) {
//       this.fetchWallet()
//       this.getFullBillingData()
//     }
//   },

//   methods: {
//     ...mapActions([
//       'openApprovalDialog',
//       'openExchangeDialog',
//       'getAccountAssets',
//       'getAccountAssetTransactions',
//       'getAccountAssetTransactionsNextPage',
//       'getCryptoFullData',
//       'transferAsset',
//       'getFullBillingData',
//       'getAssetPrecision'
//     ]),

//     fetchWallet () {
//       this.getAccountAssets()
//       this.getAccountAssetTransactions({
//         assetId: this.wallet.assetId
//       })
//         .then(() => {
//           this.updateMarketCard()
//         })
//     },

//     updateMarketCard () {
//       return this.getCryptoFullData({
//         filter: this.selectedMarketPeriod,
//         asset: this.wallet.asset,
//         billingId: this.wallet.billingId
//       })
//     },

//     requestDataBeforeOpen () {
//       this.getFullBillingData()
//       this.getAssetPrecision(this.wallet.assetId)
//     },

//     onNextPage (page) {
//       this.getAccountAssetTransactionsNextPage({
//         page: this.page,
//         assetId: this.wallet.assetId
//       })
//       this.activePage = page
//     }
//   }
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
