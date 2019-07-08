<!--
  Copyright D3 Ledger, Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0
-->
<template>
  <el-dialog
    :visible="isVisible"
    title="Deposit"
    width="450px"
    center
    @close="$emit('update:isVisible', false)"
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
</template>

<script>
import QrcodeVue from 'qrcode.vue'
import { mapGetters } from 'vuex'
import { BITCOIN_ASSET_NAME } from '@/data/consts'

export default {
  components: {
    QrcodeVue
  },
  props: {
    isVisible: {
      type: Boolean,
      required: true,
      default: false
    },
    wallet: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  computed: {
    ...mapGetters([
      'btcWalletAddress',
      'ethWalletAddress'
    ]),
    walletAddress () {
      return this.wallet.assetId === BITCOIN_ASSET_NAME
        ? this.btcWalletAddress
        : this.ethWalletAddress
    }
  }
}
</script>

<style>

</style>
