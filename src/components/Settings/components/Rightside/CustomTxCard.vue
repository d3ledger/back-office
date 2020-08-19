<!--
  Copyright D3 Ledger, Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0
-->
<template>
  <SettingsCard>
    <template slot="header">
      <span
        class="header_btn-title pointed"
        @click="updateActiveTab(5)"
      >
        <span class="header_btn-icon_block">
          <fa-icon
            :icon="activeTab === 5 ? 'angle-down' : 'angle-right'"
            class="header_btn-icon"
          />
        </span>
        Send custom transaction
      </span>
    </template>
    <template slot="content">
      <div v-if="activeTab === 5">
        <div
          class="settings-item"
        >
          <upload-tx />
        </div>
      </div>
    </template>
  </SettingsCard>
</template>

<script>

import SettingsCard from '@/components/Settings/components/Rightside/SettingsCard.vue'
import UploadTx from '@/components/common/UploadTx.vue'

export default {
  name: 'CustomTxCard',
  components: {
    SettingsCard,
    UploadTx
  },
  props: {
    activeTab: {
      type: Number,
      required: true
    },
    updateActiveTab: {
      type: Function,
      required: true
    }
  },
  data () {
    return {}
  }
}
</script>

<style>
</style>
