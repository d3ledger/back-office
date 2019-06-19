<!--
  Copyright D3 Ledger, Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0
-->
<template>
  <el-col
    :span="12"
    class="right_column fullheight"
  >
    <QuorumCard
      :open-approval-dialog="openApprovalDialog"
    />
    <PublicKeysCard
      :active-tab="activeTab"
      :update-active-tab="updateActiveTab"
      :open-approval-dialog="openApprovalDialog"
    />
    <WhiteListCard
      :id="2"
      :active-tab="activeTab"
      :update-active-tab="updateActiveTab"
      :open-approval-dialog="openApprovalDialog"
      :wallet-type="WalletTypes.ETH"
    />
    <WhiteListCard
      :id="3"
      :active-tab="activeTab"
      :update-active-tab="updateActiveTab"
      :open-approval-dialog="openApprovalDialog"
      :wallet-type="WalletTypes.BTC"
    />
    <WalletLimitsCard
      :active-tab="activeTab"
      :update-active-tab="updateActiveTab"
      :open-approval-dialog="openApprovalDialog"
    />
  </el-col>
</template>

<script>
import { mapActions } from 'vuex'
import { lazyComponent } from '@router'

import { WalletTypes } from '@/data/consts'

export default {
  name: 'SettingsRightSide',
  components: {
    WalletLimitsCard: lazyComponent('Settings/components/Rightside/WalletLimitsCard'),
    QuorumCard: lazyComponent('Settings/components/Rightside/QuorumCard'),
    PublicKeysCard: lazyComponent('Settings/components/Rightside/PublicKeysCard'),
    WhiteListCard: lazyComponent('Settings/components/Rightside/WhiteListCard')
  },
  data () {
    return {
      WalletTypes,
      activeTab: 1
    }
  },
  methods: {
    ...mapActions([
      'openApprovalDialog'
    ]),
    updateActiveTab (id) {
      this.activeTab = id
    }
  }
}
</script>

<style scoped>
</style>
