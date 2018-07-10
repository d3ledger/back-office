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
                      <el-radio-group v-model="selectedFiat" size="small" @input="selectFiat">
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
                      <el-radio-group v-model="selectedCrypto" size="small" @input="selectCrypto">
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
      cryptoCurrencies: ['BTC', 'ETH', 'XRP'],
      selectedFiat: 'RUB',
      selectedCrypto: 'BTC',
      settings: {}
    }
  },
  methods: {
    selectFiat (value) {
      this.settings.view.fiat = value
      this.$localStorage.set('settings', JSON.stringify(this.settings))
    },
    selectCrypto (value) {
      this.settings.view.crypto = value
      this.$localStorage.set('settings', JSON.stringify(this.settings))
    }
  },
  mounted () {
    this.settings = JSON.parse(this.$localStorage.get('settings'))
    if (this.settings) {
      this.selectedFiat = this.settings.view.fiat
      this.selectedCrypto = this.settings.view.crypto
    }
    // this.test()
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
