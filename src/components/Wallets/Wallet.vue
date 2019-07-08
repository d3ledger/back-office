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
    <history-table
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
    HistoryTable: lazyComponent('Wallets/components/HistoryTable'),
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
</style>
