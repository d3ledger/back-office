<!--
  Copyright D3 Ledger, Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0
-->
<template>
  <div v-if="wallet.assetId">
    <info-cards
      :wallet="wallet"
    />
    <history-table
      :wallet="wallet"
      @update-history="$emit('update-history')"
    />
  </div>
  <div v-else>
    <no-assets-card />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { lazyComponent } from '@router'

export default {
  name: 'Wallet',
  components: {
    InfoCards: lazyComponent('Wallets/InfoCards'),
    HistoryTable: lazyComponent('Wallets/HistoryTable'),
    NoAssetsCard: lazyComponent('common/NoAssetsCard')
  },
  props: {
    wallet: {
      type: Object,
      default: () => {}
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
