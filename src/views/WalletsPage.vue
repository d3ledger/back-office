<!--
  Copyright D3 Ledger, Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0
-->
<template>
  <el-container v-if="wallets.length">
    <AssetLeftMenu
      :wallets="wallets"
      :active-wallet="currentWallet"
      :current-criterion="walletsSortCriterion"
      :portfolio-percent="portfolioPercent"
      :btc-wallet-address="btcWalletAddress"
      :eth-wallet-address="ethWalletAddress"
      :has-eth-wallet="hasEthWallet"
      :has-btc-wallet="hasBtcWallet"
      @sort-menu="sort"
      @select-asset="selectAssetById"
    />
    <el-main class="column-fullheight wallet">
      <Asset
        :wallet="currentWallet"
      />
    </el-main>
  </el-container>
  <el-container v-else>
    <no-assets-card />
  </el-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { lazyComponent } from '@router'

export default {
  name: 'WalletsPage',
  components: {
    Asset: lazyComponent('Wallets/Asset'),
    AssetLeftMenu: lazyComponent('Wallets/AssetLeftMenu'),
    NoAssetsCard: lazyComponent('common/NoAssetsCard')
  },

  data () {
    return {
      currentWallet: {}
    }
  },

  computed: {
    ...mapGetters([
      'wallets',
      'portfolioPercent',
      'walletsSortCriterion',
      'btcWalletAddress',
      'ethWalletAddress',
      'hasEthWallet',
      'hasBtcWallet'
    ])
  },

  created () {
    this.loadWalletsSortCriterion()
    this.getAccountAssets()
    this.getAllAssetsTransactions()
  },

  mounted () {
    if (this.wallets.length) {
      this.currentWallet = this.wallets[0]
    }
  },

  methods: {
    ...mapActions([
      'getAccountAssets',
      'getAllAssetsTransactions',
      'loadWalletsSortCriterion',
      'updateWalletsSortCriterion'
    ]),
    sort (criterion) {
      this.updateWalletsSortCriterion(criterion)
    },
    selectAssetById (assetId) {
      const wallet = this.wallets.find(({ assetId: id }) => id === assetId)
      this.currentWallet = wallet
    }
  }
}
</script>

<style scoped>
.wallets-menu {
  background: white;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.08);
}
</style>
