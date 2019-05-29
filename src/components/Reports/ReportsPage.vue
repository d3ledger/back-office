<!--
  Copyright D3 Ledger, Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0
-->
<template>
  <el-container
    v-if="wallets.length"
    id="reports-page"
  >
    <el-main>
      <el-row>
        <el-col :span="24">
          <el-card :body-style="{ padding: '0' }">
            <div class="header">
              <span>Reports</span>
              <div>
                <el-button
                  class="report_button"
                  size="medium"
                  type="primary"
                  @click="reportFormVisible = true"
                >
                  <fa-icon
                    class="report_button-icon"
                    icon="file"
                  />
                  <span data-cy="getReport">
                    Reports
                  </span>
                </el-button>
              </div>
            </div>
            <el-table
              :data="previousMonthReports"
              class="report_table"
            >
              <el-table-column
                label="Date"
                min-width="100"
              >
                <template slot-scope="scope">
                  {{ formatDateWith(scope.row.date[0], 'MMM D, YYYY') }} - {{ formatDateWith(scope.row.date[1], 'MMM D, YYYY') }}
                </template>
              </el-table-column>
              <el-table-column
                label="Wallet"
                prop="walletName"
                min-width="100"
              />
              <el-table-column
                label="Download"
                width="225"
              >
                <template slot-scope="scope">
                  <div class="list_actions">
                    <el-button
                      plain
                      size="medium"
                      type="primary"
                      @click="download(scope.row, 'pdf')"
                    >
                      <fa-icon
                        class="report_button-icon"
                        icon="file-pdf"
                      />
                      PDF
                    </el-button>
                    <el-button
                      plain
                      size="medium"
                      type="primary"
                      @click="download(scope.row, 'csv')"
                    >
                      <fa-icon
                        class="report_button-icon"
                        icon="file-excel"
                      />
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
            v-model="selectedWallets"
            placeholder="Choose wallets for a report"
            style="width: 100%;"
            size="large"
            multiple
            collapse-tags
          >
            <el-option
              v-for="wallet in wallets"
              :key="wallet.name"
              :label="`${wallet.name} (${wallet.asset.toUpperCase()})`"
              :value="wallet.assetId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Date">
          <el-date-picker
            v-model="date"
            :picker-options="pickerOptions"
            style="width: 100%"
            type="daterange"
            start-placeholder="Start date"
            end-placeholder="End date"
          />
        </el-form-item>
      </el-form>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-button
            :loading="isPDFGenerating"
            :disabled="isCSVGenerating"
            class="fullwidth black clickable"
            style="margin-top: 40px;"
            @click="downloadSeveral({ date }, 'pdf')"
          >
            <fa-icon icon="download"/>
            PDF
          </el-button>
        </el-col>

        <el-col :span="12">
          <el-button
            :loading="isCSVGenerating"
            :disabled="isPDFGenerating"
            class="fullwidth black clickable"
            style="margin-top: 40px;"
            @click="downloadSeveral({ date, assets: selectedWallets }, 'csv')"
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
import { mapState, mapGetters, mapActions } from 'vuex'
import {
  generatePDF,
  generateCSV,
  generateMultipleCSV,
  generateMultiplePDF
} from '@util/report-util'
import dateFormat from '@/components/mixins/dateFormat'
import numberFormat from '@/components/mixins/numberFormat'
import FileSaver from 'file-saver'
import subMonths from 'date-fns/sub_months'
import startOfMonth from 'date-fns/start_of_month'
import endOfMonth from 'date-fns/end_of_month'
import endOfDay from 'date-fns/end_of_day'
import differenceInDays from 'date-fns/difference_in_days'
import isAfter from 'date-fns/is_after'
import endOfToday from 'date-fns/end_of_today'
import isWithinRange from 'date-fns/is_within_range'
import addDays from 'date-fns/add_days'
import cryptoCompareUtil from '@util/cryptoApi-axios-util'
import { lazyComponent } from '@router'

export default {
  name: 'ReportsPage',
  components: {
    NoAssetsCard: lazyComponent('common/NoAssetsCard')
  },
  mixins: [
    dateFormat,
    numberFormat
  ],
  data () {
    return {
      reportFormVisible: false,
      selectedWallets: [],
      date: '',
      pickerOptions: {
        disabledDate: this.isDisabledDate
      },

      isPDFGenerating: false,
      isCSVGenerating: false
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
    this.getAccountAssets()
    if (this.wallets && this.wallets.length) {
      this.selectedWallets = this.wallets.map(w => w.assetId)
    }
  },
  methods: {
    ...mapActions([
      'getAccountAssets',
      'getAccountAssetTransactions'
    ]),
    isDisabledDate: (date) => isAfter(date, endOfToday()),

    /*
     * Collect prices from fiat to crypto
     * Use the last minute's close as the today's price if today is within the range.
     */
    loadPriceFiatList (asset, dateFrom, dateTo) {
      const today = new Date()
      const promises = []
      const fetchingDailyPrices = cryptoCompareUtil.loadHistoryByLabels(
        this.wallets,
        this.settingsView,
        {
          limit: differenceInDays(dateTo, dateFrom) + 1,

          // convert milliseconds to seconds; round down to prevent it goes next day
          toTs: Math.floor(addDays(dateTo, 1).getTime() / 1000)
        }
      )

      promises.push(fetchingDailyPrices)

      if (isWithinRange(today, dateFrom, dateTo)) {
        const fetchingMinutePrices = cryptoCompareUtil.loadHistoryByLabels(
          this.wallets,
          this.settingsView,
          {
            filter: '1H',
            limit: 1
          }
        )

        promises.push(fetchingMinutePrices)
      }

      const mergeDailyAndMinutePrices = ([dailyPrices, minutePrices]) => {
        if (!minutePrices) return dailyPrices

        minutePrices.forEach(assetMinute => {
          const utcTomorrow = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + 1)
          const currentPrice = assetMinute.data.length ? assetMinute.data.pop() : {}
          currentPrice.time = Math.floor(utcTomorrow / 1000)

          let dailyPrice = dailyPrices.find(assetDaily => assetDaily.asset === assetMinute.asset)
          dailyPrice = dailyPrice.data.length ? dailyPrice.data : []
          dailyPrice.push(currentPrice)
        })

        return dailyPrices
      }

      return Promise.all(promises)
        .then(mergeDailyAndMinutePrices)
        .then(res => {
          let data = res
            .find(x => (x.asset === asset))
            .data
          data = data.length ? data : []
          return data.map(({ time, close }) => {
            return { date: time * 1000, price: close }
          })
        })
    },

    download ({ date, assetId }, fileFormat) {
      const now = new Date()
      const dateFrom = date[0]
      const dateTo = isAfter(endOfDay(date[1]), now) ? now : endOfDay(date[1])
      const wallet = this.wallets.find(x => (x.assetId === assetId))

      Promise.all([
        this.loadPriceFiatList(wallet.asset, dateFrom, dateTo),
        this.getAccountAssetTransactions({ assetId })
      ]).then(([priceFiatList]) => {
        const params = {
          accountId: this.accountId,
          wallet,
          transactions: this.$store.getters.getTransactionsByAssetId(assetId),
          priceFiatList,
          dateFrom,
          dateTo,
          formatDate: this.formatDate.bind(this),
          formatDateWith: this.formatDateWith.bind(this),
          formatPrecision: numberFormat.filters.formatPrecision.bind(this),
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

    downloadSeveral ({ date }, fileFormat) {
      const now = new Date()
      const wallets = this.selectedWallets.map(id => this.wallets.find(w => w.assetId === id))

      if (!wallets.length) {
        this.$message.error('Please select at least one wallet for report!')
        return
      }

      if (date.length !== 2) {
        this.$message.error('Please select correct date!')
        return
      }

      if (fileFormat === 'pdf') {
        this.isPDFGenerating = true
      } else {
        this.isCSVGenerating = true
      }

      const dateFrom = date[0]
      const dateTo = isAfter(endOfDay(date[1]), now) ? now : endOfDay(date[1])

      const getTxsPromises = []
      const getPricePrimises = []

      wallets.forEach(w => {
        getTxsPromises.push(
          this.getAccountAssetTransactions({ assetId: w.assetId })
        )
        getPricePrimises.push(
          this.loadPriceFiatList(w.asset, dateFrom, dateTo)
        )
      })

      Promise.all([
        ...getTxsPromises,
        ...getPricePrimises
      ]).then(res => {
        const data = res
          .filter(Boolean)
          .map((prices, i) => ({
            accountId: this.accountId,
            wallet: wallets[i],
            transactions: this.$store.getters.getTransactionsByAssetId(wallets[i].assetId),
            priceFiatList: prices,
            dateFrom,
            dateTo,
            formatDate: this.formatDate.bind(this),
            formatDateWith: this.formatDateWith.bind(this),
            formatPrecision: numberFormat.filters.formatPrecision.bind(this),
            fiat: this.settingsView.fiat
          }))

        const generating = (fileFormat === 'pdf')
          ? generateMultiplePDF(data)
          : generateMultipleCSV(data)

        generating
          .then(({ blob }) => {
            const convertedDateFrom = this.formatDateWith(dateFrom, 'MMM_D_YYYY_HH_mm')
            const convertedDateTo = this.formatDateWith(dateTo, 'MMM_D_YYYY_HH_mm')
            this.saveBlob(
              blob,
              `report-${convertedDateFrom}-${convertedDateTo}.${fileFormat}`
            )
          })
          .finally(_ => {
            this.isPDFGenerating = false
            this.isCSVGenerating = false
          })
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
}
.list_actions >>> button {
  background: #ffffff;
  text-transform: uppercase;
  padding: 0.7rem;
}
.report_table {
  padding: 0.9rem 1.5rem;
  width: 100%;
}
.report_table >>> .el-table__header th {
  font-weight: 500;
}
.report_table >>> .el-table__row td .cell {
  color: #000000;
}
</style>
