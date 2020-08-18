<!--
  Copyright D3 Ledger, Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0
-->
<template>
  <SettingsItem
    title="Network"
  >
    <el-row>
      <el-col>
        <el-button
          v-if="!accountWalletType.includes(WalletTypes.BTC) && freeBtcRelaysNumber > 0"
          :loading="isRegistering"
          class="action_button content_width"
          @click="onAddNetwork(WalletTypes.BTC)"
        >
          Register in BTC network
        </el-button>
        <div
          v-else-if="!accountWalletType.includes(WalletTypes.BTC)"
          class="list-title"
        >
          There is no free BTC relays now
        </div>

        <el-button
          v-if="!accountWalletType.includes(WalletTypes.ETH) && freeEthRelaysNumber > 0"
          :loading="isRegistering"
          class="action_button content_width"
          @click="onAddNetwork(WalletTypes.ETH)"
        >
          Register in ETH network
        </el-button>
        <div
          v-else-if="!accountWalletType.includes(WalletTypes.ETH)"
          class="list-title"
        >
          There is no free ETH relays now
        </div>

        <span
          v-if="accountWalletType.length === 2"
          class="list-title"
        >
          You already added all networks
        </span>
      </el-col>
    </el-row>
  </SettingsItem>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { WalletTypes } from '@/data/consts'

import SettingsItem from '@/components/Settings/components/Leftside/SettingsItem.vue'

export default {
  name: 'NetworkItem',
  components: {
    SettingsItem
  },
  props: {
    openApprovalDialog: {
      type: Function,
      required: true
    }
  },
  data () {
    return {
      WalletTypes,
      isRegistering: false
    }
  },
  computed: {
    ...mapGetters({
      accountWalletType: 'walletType',
      freeEthRelaysNumber: 'freeEthRelaysNumber',
      freeBtcRelaysNumber: 'freeBtcRelaysNumber',
      btcRegistrationIp: 'btcRegistrationIp',
      ethRegistrationIp: 'ethRegistrationIp'
    })
  },
  created () {
    this.getFreeEthRelaysNumber()
    this.getFreeBtcRelaysNumber()
  },
  methods: {
    ...mapActions([
      'setNotaryIp',
      'addNetwork',
      'updateAccount',
      'getFreeEthRelaysNumber',
      'getFreeBtcRelaysNumber'
    ]),
    onAddNetwork (network) {
      this.isRegistering = true
      this.setNotaryIp({
        ip: network === WalletTypes.BTC ? this.btcRegistrationIp : this.ethRegistrationIp
      })

      return this.addNetwork()
        .then(() => {
          this.$message.success(
            `You successfully registered in ${network === WalletTypes.BTC ? 'BTC' : 'ETH'} network!`
          )
          this.updateAccount()
        })
        .catch((err) => {
          this.$_showRegistrationError(err.message, err.response)
        })
        .finally(() => {
          this.isRegistering = false
        })
    }
  }
}
</script>

<style scoped>
</style>
