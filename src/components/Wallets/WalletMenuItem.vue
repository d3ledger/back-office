<!--
  Copyright D3 Ledger, Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0
-->
<template>
  <router-link
    :to="'/wallets/' + walletId"
    class="card"
  >
    <asset-icon
      :asset="asset"
      :size="24"
      style="margin-right: 20px"
    />
    <div class="info-container">
      <div class="label">{{ name }}</div>
      <div class="asset">{{ asset }}</div>
    </div>
  </router-link>
</template>

<script>
import AssetIcon from '@/components/common/AssetIcon'

export default {
  name: 'WalletMenuItem',
  components: {
    AssetIcon
  },
  props: {
    walletId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    asset: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.card {
  display: flex;
  width: 100%;
  font-size: 14px;
  text-decoration: none;
  align-items: center;
  padding: 15px 20px;
}

.card.router-link-active {
  background: #f4f4f4;
  padding-bottom: 13px;
  border-bottom: 2px solid #2d2d2d;
}

.info-container {
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.label {
  color: rgba(0, 0, 0, 0.87);
  font-size: 14px;
}

.card.router-link-active > .info-container > .label {
  font-weight: 600;
}

.card.router-link-active > .info-container > .asset {
  color: #000000;
  font-weight: 600;
}

.asset {
  color: rgba(0, 0, 0, 0.6);
}
</style>
