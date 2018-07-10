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
                  <span class="header">Current currency</span>
                </div>
                <div>
                  <el-row class="currencies_list">
                    <el-col>
                      <el-radio-group v-model="currentFiat" size="small">
                        <el-radio
                          v-for="(value, index) in fiatCurrencies"
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
                          v-for="(value, index) in cryptoCurrencies"
                          :key="index"
                          :label="value"
                          class="currencies_list-select"
                          border>{{ value }}</el-radio>
                      </el-radio-group>
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
export default {
  name: 'settings-page',
  data () {
    return {
      fiatCurrencies: ['RUB', 'USD', 'EUR'],
      cryptoCurrencies: ['BTC', 'ETH', 'XRP']
    }
  },
  computed: {
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
    }
  }
}
</script>

<style scoped>
.settings_item {}

.settings_item-header {
  margin-bottom: 15px;
}

.settings_item-header > .header {
  font-size: 1.5rem
}

.currencies_list {
  margin-bottom: 10px;
}

.currencies_list-select {
  width: 5rem;
}
</style>
