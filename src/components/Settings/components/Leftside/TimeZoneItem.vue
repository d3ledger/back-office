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

import { lazyComponent } from '@router'

export default {
  name: 'TimezoneItem',
  components: {
    SettingsItem: lazyComponent('Settings/components/Leftside/SettingsItem')
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
