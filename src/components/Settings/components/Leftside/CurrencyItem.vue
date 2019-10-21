<!--
  Copyright D3 Ledger, Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0
-->
<template>
  <SettingsItem
    :v-slot="{ currentCrypto, currentFiat }"
    title="Currency"
  >
    <el-row class="currencies_list">
      <p class="list-title">
        Dashboard (Portfolio, Market, Balance and Changes)
      </p>
      <el-col>
        <el-radio-group
          v-model="currentFiat"
          size="small"
        >
          <el-radio
            v-for="(value, index) in settingsFiatCurrencies"
            :key="index"
            :label="value"
            class="currencies_list-select"
            border
          >
            {{ value }}
          </el-radio>
        </el-radio-group>
      </el-col>
    </el-row>
    <el-row class="currencies_list">
      <p class="list-title">
        Wallets (Market)
      </p>
      <el-col>
        <el-radio-group
          v-model="currentCrypto"
          size="small"
        >
          <el-radio
            v-for="(value, index) in settingsCryptoCurrencies"
            :key="index"
            :label="value"
            class="currencies_list-select"
            border
          >
            {{ value }}
          </el-radio>
        </el-radio-group>
      </el-col>
    </el-row>
  </SettingsItem>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { lazyComponent } from '@router'

export default {
  name: 'CurrencyItem',
  components: {
    SettingsItem: lazyComponent('Settings/components/Leftside/SettingsItem')
  },
  computed: {
    ...mapGetters([
      'settingsView',
      'settingsFiatCurrencies',
      'settingsCryptoCurrencies'
    ]),
    currentFiat: {
      get () {
        return this.settingsView.fiat
      },
      set (value) {
        this.updateSettingsViewFiat(value)
      }
    },
    currentCrypto: {
      get () {
        return this.settingsView.crypto
      },
      set (value) {
        this.updateSettingsViewCrypto(value)
      }
    }
  },
  methods: {
    ...mapActions([
      'updateSettingsViewFiat',
      'updateSettingsViewCrypto'
    ])
  }
}
</script>

<style scoped>
</style>
