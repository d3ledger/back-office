<template>
  <div>
    <el-main>
      <el-row>
        <el-col :xs="24" :md="{ span: 18, offset: 3}" :lg="{ span: 16, offset: 4 }" :xl="{ span: 14, offset: 5 }">
          <el-card>
            <div slot="header" style="display: flex; justify-content: space-between; align-items: center;">
              <span>Reports</span>
              <el-button type="primary" @click="reportFormVisible = true" plain>New Report</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
    <el-dialog
      :visible.sync="reportFormVisible"
      title="Report"
      width="400px"
      center
    >
      <el-form style="width: 100%">
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
        class="fullwidth black clickable"
        style="margin-top: 40px;"
      >
        <fa-icon icon="download"/>
        DOWNLOAD REPORT
      </el-button>
    </el-dialog>
  </div>
</template>

<script>
// TODO: mock everything
import { mapGetters } from 'vuex'

export default {
  name: 'reports-page',
  data () {
    return {
      reportFormVisible: false,
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
