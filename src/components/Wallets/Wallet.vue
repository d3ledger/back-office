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
    />
  </div>
  <div v-else>
    <no-assets-card />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
  }
}
</script>

<style scoped>
</style>
