<!--
  Copyright D3 Ledger, Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0
-->
<template>
  <SettingsItem
    :v-slot="{ currentZone }"
    title="Time zone"
  >
    <el-row>
      <el-col>
        <el-select
          id="timezone_select"
          v-model="currentZone"
          class="fullwidth"
          filterable
          placeholder="Select"
        >
          <el-option
            v-for="(zone, index) in timezones"
            :key="index"
            :label="zone"
            :value="zone"
          />
        </el-select>
      </el-col>
    </el-row>
  </SettingsItem>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import dateFormat from '@/components/mixins/dateFormat'

import SettingsItem from '@/components/Settings/components/Leftside/SettingsItem.vue'

export default {
  name: 'TimezoneItem',
  components: {
    SettingsItem
  },
  mixins: [
    dateFormat
  ],
  computed: {
    ...mapGetters([
      'settingsView'
    ]),
    currentZone: {
      get () {
        return this.settingsView.timezone
      },
      set (value) {
        this.updateSettingsViewTime(value)
      }
    }
  },
  methods: {
    ...mapActions([
      'updateSettingsViewTime'
    ])
  }
}
</script>

<style scoped>
</style>
