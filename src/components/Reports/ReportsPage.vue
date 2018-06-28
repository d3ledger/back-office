<template>
  <div>
    <el-aside class="column-fullheight blue-form-wrapper" width="400px">
      <el-form style="width: 100%">
        <h2 style="margin-bottom: 40px">
          New report
        </h2>
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
      </el-form>
      <el-button
        icon="el-icon-download"
        class="button-black clickable"
      >
        DOWNLOAD REPORT
      </el-button>
    </el-aside>
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
</style>
