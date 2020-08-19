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
    <CustomTxCard
      :active-tab="activeTab"
      :update-active-tab="updateActiveTab"
    />
  </el-col>
</template>

<script>
import { mapActions } from 'vuex'
import { WalletTypes } from '@/data/consts'

import WalletLimitsCard from '@/components/Settings/components/Rightside/WalletLimitsCard.vue'
import QuorumCard from '@/components/Settings/components/Rightside/QuorumCard.vue'
import PublicKeysCard from '@/components/Settings/components/Rightside/PublicKeysCard.vue'
import WhiteListCard from '@/components/Settings/components/Rightside/WhiteListCard.vue'
import CustomTxCard from '@/components/Settings/components/Rightside/CustomTxCard.vue'

export default {
  name: 'SettingsRightSide',
  components: {
    WalletLimitsCard,
    QuorumCard,
    PublicKeysCard,
    WhiteListCard,
    CustomTxCard
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
