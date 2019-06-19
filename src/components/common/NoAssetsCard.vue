<!--
  Copyright D3 Ledger, Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0
-->
<template>
  <el-main class="column-fullheight card-wrapper flex-direction-row">
    <el-card
      v-if="!showEthCard && !showBtcCard"
      class="card"
    >
      You don't have any wallets yet. Please add walets in <span
        class="monospace bold clickable"
        @click="goToSettings"
      >Settings</span>
    </el-card>
    <el-card
      v-if="showEthCard"
      class="card"
    >
      You have no assets at the moment. Please transfer your ETH/ERC20 tokens to <span class="monospace bold">{{ ethWalletAddress }}</span> or wait untill someone transfers assets to your account <span class="monospace">{{ accountId }}</span>
      <qrcode-vue
        :value="ethWalletAddress"
        :size="270"
        class="qr"
      />
    </el-card>
    <el-card
      v-if="showBtcCard"
      class="card"
    >
      You have no assets at the moment. Please transfer your bitcoins  to <span class="monospace bold">{{ btcWalletAddress }}</span> or wait untill someone transfers assets to your account <span class="monospace">{{ accountId }}</span>
      <qrcode-vue
        :value="btcWalletAddress"
        :size="270"
        class="qr"
      />
    </el-card>
  </el-main>
</template>

<script>
import QrcodeVue from 'qrcode.vue'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'NoAssetsCard',
  components: {
    QrcodeVue
  },
  data () {
    return {
    }
  },

  computed: {
    ...mapState({
      accountId: state => state.Account.accountId
    }),
    ...mapGetters([
      'ethWalletAddress',
      'btcWalletAddress',
      'hasEthWallet',
      'hasBtcWallet'
    ]),
    showEthCard () {
      return this.ethWalletAddress && !this.hasEthWallet
    },
    showBtcCard () {
      return this.btcWalletAddress && !this.hasBtcWallet
    }
  },

  methods: {
    goToSettings () {
      this.$router.push('/settings')
    }
  }
}
</script>

<style scoped>
.card-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}
.card {
  max-width: 600px;
  margin-left: 10px;
  margin-right: 10px;
}
.qr {
  width: 270px;
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
}
.clickable {
  cursor: pointer;
}
</style>
