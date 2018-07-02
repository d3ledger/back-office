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
            <el-table :data="mockReports">
              <el-table-column label="date" prop="date"></el-table-column>
              <el-table-column label="wallet" prop="wallet"></el-table-column>
              <el-table-column label="download" width="160px">
                <template slot-scope="scope">
                  <div>
                    <el-button
                      size="mini"
                      plain type="primary"
                    >
                      PDF
                    </el-button>
                    <el-button
                      size="mini"
                      type="primary"
                    >
                      CSV
                    </el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
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
              :label="`${wallet.name} (${wallet.asset.toUpperCase()})`"
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
    }),
    mockReports: function () {
      return this.wallets.map(x => ({
        wallet: `${x.name} (${x.asset.toUpperCase()})`,
        date: 'DEC 3, 2017 — JAN 3, 2018'
      }))
    }
  },
  created () {
    this.$store.dispatch('getAccountAssets')
  }
}
</script>
