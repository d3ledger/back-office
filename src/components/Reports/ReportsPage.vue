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
              <el-table-column label="date">
                <template slot-scope="scope">
                  {{ scope.row.date[0] }} - {{ scope.row.date[1] }}
                </template>
              </el-table-column>
              <el-table-column label="wallet" prop="walletName"></el-table-column>
              <el-table-column label="download" width="160px">
                <template slot-scope="scope">
                  <div>
                    <el-button
                      size="mini"
                      plain type="primary"
                      @click="onClickDownload(scope.row, 'pdf')"
                    >
                      PDF
                    </el-button>
                    <el-button
                      size="mini"
                      type="primary"
                      @click="onClickDownload(scope.row, 'csv')"
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
import { mapState, mapGetters } from 'vuex'
import reportGenerator from '@/components/mixins/reportGenerator'
// import FileSaver from 'file-saver'

export default {
  name: 'reports-page',
  mixins: [reportGenerator],
  data () {
    return {
      reportFormVisible: false,
      selectedWallets: [],
      date: ''
    }
  },
  computed: {
    ...mapState({
      accountId: state => state.Account.accountId
    }),
    ...mapGetters([
      'wallets'
    ]),
    mockReports: function () {
      return this.wallets.map(x => ({
        assetId: x.assetId,
        walletName: `${x.name} (${x.asset.toUpperCase()})`,
        date: ['Jul 1, 2018', 'Jul 31, 2018']
      }))
    }
  },
  created () {
    this.$store.dispatch('getAccountAssets')
  },
  methods: {
    onClickDownload ({ date, walletName, assetId }, fileFormat) {
      const [dateFrom, dateTo] = date

      this.$store.dispatch('getAccountAssetTransactions', { assetId })
        .then(() => {
          const params = {
            accountId: this.accountId,
            wallet: this.wallets.find(x => (x.assetId === assetId)),
            transactions: this.$store.getters.getTransactionsByAssetId(assetId),
            assetId,
            dateFrom,
            dateTo
          }
          const generating = (fileFormat === 'pdf')
            ? this.generatePDF(params)
            : this.generateCSV(params)

          generating.then(({ blob, filename }) => {
            console.log('generated')
            // FileSaver.saveAs(blob, filename)
          })
        })
    }
  }
}
</script>
