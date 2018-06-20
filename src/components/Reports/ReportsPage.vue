<template>
  <div>
    <div class="column-fullheight" style="padding: 20px;">
      <el-card style="width: 500px">
        <div slot="header">
          New report
        </div>
        <el-form>
          <el-form-item label="Wallets">
            <el-select
              v-model="selectedWallets"
              multiple
              placeholder="Choose wallets for a report"
              style="width: 100%;"
              size="large"
            >
              <el-option
                v-for="wallet in wallets"
                :key="wallet.name"
                :label="wallet.name + ' (' + wallet.asset + ')'"
                :value="wallet.name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Date">
            <el-date-picker
              style="width: 100%"
              v-model="date"
              type="daterange"
              start-placeholder="Start date"
              end-placeholder="End date"
            />
          </el-form-item>
          <el-form-item style="margin-bottom: 0;">
            <el-button
              type="primary"
              icon="el-icon-download"
              style="width: 100%; margin-top: 20px;"
            >
              Download report
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'reports-page',
  data () {
    return {
      selectedWallets: [],
      date: ''
    }
  },
  computed: {
    ...mapGetters({
      wallets: 'wallets'
    })
  },
  created () {
    this.$store.dispatch('getAccountAssets')
  }
}
</script>

<style>
.el-range-input {
  width: 50% !important;
}
</style>
