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
import _ from 'lodash'
import { mapGetters } from 'vuex'
import { format as formatDate, isWithinRange, isAfter } from 'date-fns'
import { generatePDF, generateCSV } from '@util/report-util'
// import FileSaver from 'file-saver'

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
        assetId: x.assetId,
        walletName: `${x.name} (${x.asset.toUpperCase()})`,
        date: ['Jul 1, 2018', 'Jul 15, 2018']
      }))
    }
  },
  created () {
    this.$store.dispatch('getAccountAssets')
  },
  methods: {
    // TODO: move logic elsewhere
    onClickDownload ({ date, walletName, assetId }, fileFormat) {
      const [dateFrom, dateTo] = date
      // const ext = (fileFormat === 'pdf') ? 'pdf' : 'csv'
      // const fileName = `report-${formatDate(dateFrom, 'YYYYMMDD')}-${formatDate(dateTo, 'YYYYMMDD')}.${ext}`

      this.$store.dispatch('getAccountAssetTransactions', { assetId })
        .then(() => {
          const sumAmount = (txs) => txs
            .map(tx => parseFloat(tx.amount))
            .reduce((sum, x) => sum + x, 0)

          const transactions = this.$store.getters.getTransactionsByAssetId(assetId)
          const wallet = this.$store.getters.wallets.find(x => (x.assetId === assetId))
          const currencyAbbr = wallet.asset
          const precision = wallet.precision
          const currentAmount = wallet.amount

          const txsWithinRange = transactions
            .filter(tx => isWithinRange(tx.date, dateFrom, dateTo))
          const txsAfterRange = transactions
            .filter(tx => isAfter(tx.date, dateTo))
          const netChangeAfterRange = txsAfterRange
            .map(tx => (tx.to === 'you') ? +tx.amount : -tx.amount)
            .reduce((sum, x) => sum + x, 0)
          const transfersIn = sumAmount(txsWithinRange.filter(tx => (tx.to === 'you')))
          const transfersOut = sumAmount(txsWithinRange.filter(tx => (tx.from === 'you')))
          const netChange = transfersIn - transfersOut
          const endingBalance = currentAmount - netChangeAfterRange
          // TODO:
          const endingBalanceUSD = null
          const startingBalance = endingBalance - netChange
          // TODO:
          const startingBalanceUSD = null
          // TODO:
          const transactionsByDay = _(txsWithinRange)
            .groupBy(tx => formatDate(tx.date, 'YYYYMMDD'))
            .map((txs, date) => {
              const dailyIn = sumAmount(txs.filter(tx => (tx.to === 'you')))
              // TODO:
              const dailyInUSD = null
              const dailyOut = sumAmount(txs.filter(tx => (tx.from === 'you')))
              // TODO:
              const dailyOutUSD = null
              const dailyNet = dailyIn - dailyOut

              return {
                date,
                dailyIn: dailyIn.toFixed(precision),
                dailyInUSD,
                dailyOut: dailyOut.toFixed(precision),
                dailyOutUSD,
                dailyNet: dailyNet.toFixed(precision)
              }
            })
            .value()
          // TODO:
          const transactionsDetails = []

          const reportData = {
            // metadata
            accountId: this.$store.state.Account.accountId,
            walletName,
            currencyAbbr,
            dateFrom,
            dateTo,

            // summary
            endingBalance: endingBalance.toFixed(precision),
            endingBalanceUSD,
            startingBalance: startingBalance.toFixed(precision),
            startingBalanceUSD,
            netChange: netChange.toFixed(precision),
            transfersIn: transfersIn.toFixed(precision),
            transfersOut: transfersOut.toFixed(precision),

            // transactions by day
            transactionsByDay,

            // transaction details
            transactionsDetails
          }

          const generating = (fileFormat === 'pdf')
            ? generatePDF(reportData)
            : generateCSV(reportData)

          console.log(reportData)
          generating.then(blob => {
            console.log('generated')
            // FileSaver.saveAs(blob, fileName)
          })
        })
    }
  }
}
</script>
