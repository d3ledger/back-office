<template>
  <el-container id="reports-page" v-if="wallets.length">
    <el-main>
      <el-row>
        <el-col :xs="24" :md="{ span: 18, offset: 3}" :lg="{ span: 16, offset: 4 }" :xl="{ span: 14, offset: 5 }">
          <el-card :body-style="{ padding: '0' }">
            <div class="header">
              <span>Reports</span>
              <div>
                <el-button class="report_button" type="primary" @click="reportFormVisible = true">
                  <fa-icon class="report_button-icon" icon="file" />
                  <span data-cy="getReport">
                    Reports
                  </span>
                </el-button>
              </div>
            </div>
            <el-table
              class="report_table"
              :data="previousMonthReports"
              >
              <el-table-column label="Date" width="350">
                <template slot-scope="scope">
                  {{ formatDateWith(scope.row.date[0], 'MMM D, YYYY') }} - {{ formatDateWith(scope.row.date[1], 'MMM D, YYYY') }}
                </template>
              </el-table-column>
              <el-table-column label="Wallet" prop="walletName" width="300"></el-table-column>
              <el-table-column label="Download" width="190">
                <template slot-scope="scope">
                  <div class="list_actions">
                    <el-button
                      plain
                      size="medium"
                      type="primary"
                      @click="download(scope.row, 'pdf')"
                    >
                      <fa-icon class="report_button-icon" icon="file-pdf" />
                      PDF
                    </el-button>
                    <el-button
                      plain
                      size="medium"
                      type="primary"
                      @click="download(scope.row, 'csv')"
                    >
                      <fa-icon class="report_button-icon" icon="file-excel" />
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
            id="wallet-selector"
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
            :picker-options="pickerOptions"
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
  </el-container>
  <el-container v-else>
    <no-assets-card />
  </el-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { generatePDF, generateCSV } from '@util/report-util'
import dateFormat from '@/components/mixins/dateFormat'
import FileSaver from 'file-saver'
import subMonths from 'date-fns/sub_months'
import startOfMonth from 'date-fns/start_of_month'
import endOfMonth from 'date-fns/end_of_month'
import endOfDay from 'date-fns/end_of_day'
import differenceInDays from 'date-fns/difference_in_days'
import isAfter from 'date-fns/is_after'
import endOfYesterday from 'date-fns/end_of_yesterday'
import cryptoCompareUtil from '@util/cryptoApi-axios-util'
import { lazyComponent } from '@router'

export default {
  name: 'reports-page',
  mixins: [dateFormat],
  components: {
    NoAssetsCard: lazyComponent('common/NoAssetsCard')
  },
  data () {
    return {
      reportFormVisible: false,
      selectedWallet: null,
      date: '',
      pickerOptions: {
        disabledDate: this.isDisabledDate
      }
    }
  },
  computed: {
    ...mapState({
      accountId: state => state.Account.accountId
    }),
    ...mapGetters([
      'wallets',
      'settingsView',
      'portfolioHistory'
    ]),
    previousMonthReports: function () {
      return this.wallets.map(x => {
        const previousMonth = subMonths(Date.now(), 1)

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
    this.selectedWallet = this.wallets && this.wallets.length && this.wallets[0].assetId
  },
  methods: {
    isDisabledDate: (date) => isAfter(date, endOfYesterday()),

    /*
     * collect prices from fiat to crypto
     */
    loadPriceFiatList (asset, dateFrom, dateTo) {
      return cryptoCompareUtil.loadHistoryByLabels(this.wallets, this.settingsView, {
        limit: differenceInDays(dateTo, dateFrom),

        // convert milliseconds to seconds; round down to prevent it goes next day
        toTs: Math.floor(dateTo.getTime() / 1000)
      })
        .then(res => res
          .find(x => (x.asset === asset))
          .data
          .map(({ time, close }) => ({ date: time * 1000, price: close }))
        )
    },

    download ({ date, assetId }, fileFormat) {
      const dateFrom = date[0]
      const dateTo = endOfDay(date[1])
      const wallet = this.wallets.find(x => (x.assetId === assetId))

      Promise.all([
        this.loadPriceFiatList(wallet.asset, dateFrom, dateTo),
        this.$store.dispatch('getAccountAssetTransactions', { assetId })
      ]).then(([priceFiatList]) => {
        const params = {
          accountId: this.accountId,
          wallet,
          transactions: this.$store.getters.getTransactionsByAssetId(assetId),
          assetId,
          priceFiatList,
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
          this.saveBlob(blob, filename)
        })
      })
        .catch(err => {
          console.error(err)

          this.$message.error(`Failed to generate a report. Please try again later.`)
        })
    },

    saveBlob (blob, filename) {
      // do not download a file in headless e2e testing environment
      if (window.Cypress) {
        alert(`downloading ${filename}`)
      } else {
        FileSaver.saveAs(blob, filename)
      }
    }
  }
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.9rem 1.5rem;
}
.report_button {
  background-color: #409eff;
  border: 0;
  text-transform: uppercase;
  border-radius: 2px;
  font-size: 0.8rem;
  line-height: 1rem;
}
.report_button-icon {
  margin-right: 0.7rem;
}
.list_actions {
  display: flex;
  justify-content: space-between;
}
.list_actions >>> button {
  background: #ffffff;
  text-transform: uppercase;
  padding: 0.7rem;
}
.report_table {
  padding: 0.9rem 1.5rem;
}
.report_table >>> .el-table__header th {
  font-weight: 500;
}
.report_table >>> .el-table__row td .cell {
  color: #000000;
}
</style>
