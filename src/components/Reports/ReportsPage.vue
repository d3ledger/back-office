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
            <el-table :data="previousMonthReports">
              <el-table-column label="date">
                <template slot-scope="scope">
                  {{ formatDateWith(scope.row.date[0], 'MMM D, YYYY') }} - {{ formatDateWith(scope.row.date[1], 'MMM D, YYYY') }}
                </template>
              </el-table-column>
              <el-table-column label="wallet" prop="walletName"></el-table-column>
              <el-table-column label="download" width="160px">
                <template slot-scope="scope">
                  <div>
                    <el-button
                      size="mini"
                      plain type="primary"
                      @click="download(scope.row, 'pdf')"
                    >
                      PDF
                    </el-button>
                    <el-button
                      size="mini"
                      type="primary"
                      @click="download(scope.row, 'csv')"
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
            v-model="selectedWallet"
            placeholder="Choose wallets for a report"
            style="width: 100%;"
            size="large"
          >
            <el-option
              v-for="wallet in wallets"
              :key="wallet.name"
              :label="`${wallet.name} (${wallet.asset.toUpperCase()})`"
              :value="wallet.assetId">
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

      <el-row :gutter="20">
        <el-col :span="12">
          <el-button
            class="fullwidth black clickable"
            style="margin-top: 40px;"
            @click="download({ date, assetId: selectedWallet }, 'pdf')"
          >
            <fa-icon icon="download"/>
            PDF
          </el-button>
        </el-col>

        <el-col :span="12">
          <el-button
            class="fullwidth black clickable"
            style="margin-top: 40px;"
            @click="download({ date, assetId: selectedWallet }, 'csv')"
          >
            <fa-icon icon="download"/>
            CSV
          </el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { generatePDF, generateCSV } from '@util/report-util'
import dateFormat from '@/components/mixins/dateFormat'
import FileSaver from 'file-saver'
import { subMonths, startOfMonth, endOfMonth } from 'date-fns'

export default {
  name: 'reports-page',
  mixins: [dateFormat],
  data () {
    return {
      reportFormVisible: false,
      selectedWallet: null,
      date: ''
    }
  },
  computed: {
    ...mapState({
      accountId: state => state.Account.accountId
    }),
    ...mapGetters([
      'wallets',
      'settingsView',
      'portfolioList'
    ]),
    previousMonthReports: function () {
      return this.wallets.map(x => {
        const previousMonth = subMonths(new Date(), 1)

        return {
          assetId: x.assetId,
          walletName: `${x.name} (${x.asset.toUpperCase()})`,
          date: [
            startOfMonth(previousMonth),
            endOfMonth(previousMonth)
          ]
        }
      })
    }
  },
  created () {
    this.$store.dispatch('getAccountAssets')
  },
  methods: {
    download ({ date, assetId }, fileFormat) {
      Promise.all([
        this.$store.dispatch('loadDashboard'),
        this.$store.dispatch('getAccountAssetTransactions', { assetId })
      ])
        .then(() => {
          const [dateFrom, dateTo] = date
          const wallet = this.wallets.find(x => (x.assetId === assetId))
          const priceFiat = this.portfolioList.find(({ asset }) => asset === wallet.asset).price
          const params = {
            accountId: this.accountId,
            wallet,
            transactions: this.$store.getters.getTransactionsByAssetId(assetId),
            assetId,
            priceFiat,
            dateFrom,
            dateTo,
            formatDate: this.formatDate.bind(this),
            formatDateWith: this.formatDateWith.bind(this),
            fiat: this.settingsView.fiat
          }
          const generating = (fileFormat === 'pdf')
            ? generatePDF(params)
            : generateCSV(params)

          generating.then(({ blob, filename }) => {
            FileSaver.saveAs(blob, filename)
          })
        })
    }
  }
}
</script>
