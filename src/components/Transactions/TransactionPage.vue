<!--
  Copyright D3 Ledger, Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0
-->
<template>
  <el-container>
    <el-main>
      <el-row>
        <el-col :span="24">
          <el-card :body-style="{ padding: '0' }">
            <div class="header">
              <span>Waiting transactions</span>
            </div>
            <el-tabs type="card">
              <el-tab-pane
                label="Transfer"
              >
                <TransferTab
                  :account-quorum="accountQuorum"
                  :available-assets="availableAssets"
                />
              </el-tab-pane>
              <el-tab-pane
                label="Settings"
              >
                <SettingsTab
                  :account-quorum="accountQuorum"
                  :available-assets="availableAssets"
                />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
// import NOTIFICATIONS from '@/data/notifications'

import TransferTab from '@/components/Transactions/components/TransferTab.vue'
import SettingsTab from '@/components/Transactions/components/SettingsTab.vue'

export default {
  name: 'TransactionPage',
  components: {
    TransferTab,
    SettingsTab
  },
  data () {
    return {
      isSending: false
    }
  },
  computed: {
    ...mapGetters([
      'availableAssets',
      'accountQuorum'
    ])
  },
  created () {
    this.getAllUnsignedTransactions()
  },
  methods: {
    ...mapActions([
      'getAllUnsignedTransactions',
      'createPendingTransaction',
      'openUploadTransactionDialog'
    ]),
    onSignPendingTransaction (txStoreId, signatures) {
      this.createPendingTransaction({
        txStoreId
      })
      this.openUploadTransactionDialog()
    }
  }
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem;
}
</style>
