<template>
  <el-container class="fullheight">
    <el-main class="fullheight">
      <el-row class="fullheight">
        <el-col :span="24">
          <el-card
            :body-style="{ padding: '1.5rem' }"
            class="fullheight"
          >
            <div class="header">
              <span>Billing reports</span>
            </div>
            <div class="search">
              <el-form
                ref="form"
                :model="reportForm"
                style="width: 100%"
                @submit.native.prevent
              >
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="Date">
                      <el-date-picker
                        v-model="reportForm.date"
                        type="daterange"
                        range-separator="-"
                        start-placeholder="Start date"
                        end-placeholder="End date"
                        class="dialog_date"
                        @change="updateReports()"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <el-row>
              <el-tabs type="card">
                <el-tab-pane label="Custody">
                  <el-table
                    :data="custodyBillingReport"
                    class="report_table"
                  >
                    <el-table-column
                      prop="0"
                      label="Asset"
                      min-width="180"
                    />
                    <el-table-column
                      prop="1"
                      label="Fee amount"
                      min-width="180"
                    />
                  </el-table>
                </el-tab-pane>
                <el-tab-pane label="Transfer">
                  <el-table
                    :data="transferBillingReport"
                    class="report_table"
                  >
                    <el-table-column
                      prop="fromAccount"
                      label="Source account"
                    />
                    <el-table-column
                      prop="toAccount"
                      label="Destination account"
                    />
                    <el-table-column
                      prop="amount"
                      label="Amount"
                    />
                    <el-table-column
                      prop="fee"
                      label="Fee amount"
                    />
                    <el-table-column
                      prop="asset"
                      label="Asset"
                    />
                  </el-table>
                </el-tab-pane>
                <el-tab-pane label="Exchange">
                  <el-table
                    :data="exchangeBillingReport"
                    class="report_table"
                  >
                    <el-table-column
                      prop="offerAccount"
                      label="Offeraccount"
                    />
                    <el-table-column
                      prop="offerAmount"
                      label="Offer amount"
                    />
                    <el-table-column
                      prop="offerFee"
                      label="Offer fee"
                    />
                    <el-table-column
                      prop="Offer asset"
                      label="Account"
                    />
                    <el-table-column
                      prop="requestAccount"
                      label="Request account"
                    />
                    <el-table-column
                      prop="requestAmount"
                      label="request amount"
                    />
                    <el-table-column
                      prop="requestFee"
                      label="Request fee"
                    />
                    <el-table-column
                      prop="requestAsset"
                      label="Request asset"
                    />
                  </el-table>
                </el-tab-pane>
              </el-tabs>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'BillingReportPage',
  data () {
    return {
      isReportDialogVisible: false,

      reportForm: {
        date: [],
        pageNum: 1,
        pageSize: 10
      },

      reportData: [],
      totalPages: 0,
      total: 0
    }
  },
  computed: {
    ...mapGetters([
      'custodyBillingReport',
      'transferBillingReport',
      'exchangeBillingReport'
    ])
  },
  methods: {
    ...mapActions([
      'getCustodyBillingReport',
      'getTransferBillingReport',
      'getExchangeBillingReport'
    ]),
    updateReports () {
      this.updateCustodyReport()
      this.updateTransferReport()
      this.updateExhcangeReport()
    },
    updateCustodyReport () {
      const { date, ...params } = this.reportForm

      if (date.length < 2) {
        this.$message.error('Please select correct date!')
        return
      }

      params.from = date[0].getTime()
      params.to = date[1].getTime()

      this.getCustodyBillingReport({ params })
    },
    updateTransferReport () {
      const { date, ...params } = this.reportForm

      if (date.length < 2) {
        this.$message.error('Please select correct date!')
        return
      }

      params.from = date[0].getTime()
      params.to = date[1].getTime()

      this.getTransferBillingReport({ params })
    },
    updateExhcangeReport () {
      const { date, ...params } = this.reportForm

      if (date.length < 2) {
        this.$message.error('Please select correct date!')
        return
      }

      params.from = date[0].getTime()
      params.to = date[1].getTime()

      this.getExchangeBillingReport({ params })
    }
  }
}
</script>

<style scoped>
.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.card {
  margin-top: 0.5rem;
}

.settings {
  padding: 0 1.5rem;
}

.settings_item {
  margin-bottom: 20px;
}

.row_sub-header {
  margin-bottom: 10px;
}

.row_sub-header > .header_small {
  font-size: 0.8rem;
}

.settings_item-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.settings_item-header-title {
  font-size: 1rem;
}

.relay_number {
  margin-bottom: 10px;
}

.list-title {
  font-size: 0.8rem;
  margin-bottom: 6px;
}

.action_button {
  border: 1px solid #000000;
  text-transform: uppercase;
  width: 7rem;
  padding: 0.5rem;
}

.approval_form-desc {
  text-align: center;
}

.action_button:active,
.action_button:focus,
.action_button:hover {
  background-color: #ffffff;
  color: #000000;
}

.action_button-icon {
  font-size: 0.7rem;
  height: 0.8rem;
  margin-left: -0.2rem;
  margin-right: 0.3rem;
}
.report_table >>> .el-table__header th {
  font-weight: 500;
}
.report_table >>> .el-table__row td .cell {
  color: #000000;
}

.dialog_date {
  width: 100%;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.asset-name {
  font-weight: 500;
  text-transform: uppercase;
}

</style>
