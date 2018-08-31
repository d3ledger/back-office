<template>
  <el-container>
    <el-main>
      <el-row>
        <el-col
          :xs="24"
          :md="{ span: 18, offset: 3 }"
          :lg="{ span: 16, offset: 4 }"
          :xl="{ span: 14, offset: 5 }">
          <el-card>
            <div slot="header">
              Settings
            </div>
            <div>
              <el-row class="settings_item">
                <div class="settings_item-header">
                  <span class="header">Currency</span>
                </div>
                <div>
                  <el-row class="currencies_list">
                    <el-col>
                      <el-radio-group v-model="currentFiat" size="small">
                        <el-radio
                          v-for="(value, index) in settingsFiatCurrencies"
                          :key="index"
                          :label="value"
                          class="currencies_list-select"
                          border>{{ value }}</el-radio>
                      </el-radio-group>
                    </el-col>
                  </el-row>
                  <el-row class="currencies_list">
                    <el-col>
                      <el-radio-group v-model="currentCrypto" size="small">
                        <el-radio
                          v-for="(value, index) in settingsCryptoCurrencies"
                          :key="index"
                          :label="value"
                          class="currencies_list-select"
                          border>{{ value }}</el-radio>
                      </el-radio-group>
                    </el-col>
                  </el-row>
                </div>
              </el-row>
              <el-row class="settings_item">
                <div class="settings_item-header">
                  <span class="header">Time zone</span>
                </div>
                <div>
                  <el-row>
                    <el-col>
                      <el-select
                        id="timezone_select"
                        class="full-width_select"
                        v-model="currentZone"
                        filterable
                        placeholder="Select">
                        <el-option
                          v-for="(zone, index) in timezones"
                          :key="index"
                          :label="zone"
                          :value="zone">
                        </el-option>
                      </el-select>
                    </el-col>
                  </el-row>
                </div>
              </el-row>
              <el-row class="settings_item">
                <div class="settings_item-header">
                  <span class="header">Privacy</span>
                </div>
                <div>
                  <el-row>
                    <el-col>
                      <div class="row_sub-header">
                        <span class="header_small">Avaliable withdrawal addresses</span>
                      </div>
                      <el-select
                        class="full-width_select"
                        v-model="withdrawWalletAddresses"
                        multiple
                        disabled
                        placeholder="You can withdraw to any address">
                      </el-select>
                    </el-col>
                  </el-row>
                </div>
              </el-row>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import dateFormat from '@/components/mixins/dateFormat'
import { mapGetters } from 'vuex'

export default {
  name: 'settings-page',
  data () {
    return {}
  },
  mixins: [
    dateFormat
  ],
  computed: {
    ...mapGetters([
      'settingsFiatCurrencies',
      'settingsCryptoCurrencies',
      'withdrawWalletAddresses'
    ]),
    currentFiat: {
      get () {
        return this.$store.getters.settingsView.fiat
      },
      set (value) {
        this.$store.dispatch('updateSettingsViewFiat', value)
      }
    },
    currentCrypto: {
      get () {
        return this.$store.getters.settingsView.crypto
      },
      set (value) {
        this.$store.dispatch('updateSettingsViewCrypto', value)
      }
    },
    currentZone: {
      get () {
        return this.$store.getters.settingsView.timezone
      },
      set (value) {
        this.$store.dispatch('updateSettingsViewTime', value)
      }
    }
  }
}
</script>

<style scoped>
.settings_item {
  margin-bottom: 20px;
}

.row_sub-header {
  margin-bottom: 10px;
}

.row_sub-header > .header_small {
  font-size: 0.8rem;
}

.settings_item-header {
  margin-bottom: 15px;
}

.settings_item-header > .header {
  font-size: 1rem;
}

.currencies_list {
  margin-bottom: 10px;
}

.currencies_list-select {
  width: 5rem;
}

.full-width_select {
  width: 100%;
}
</style>
