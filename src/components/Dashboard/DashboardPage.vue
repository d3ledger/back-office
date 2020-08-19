<!--
  Copyright D3 Ledger, Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0
-->
<template>
  <el-container
    v-loading.fullscreen="isDashboardLoading"
    v-if="isDashboardLoading"
  />
  <el-container v-else-if="hasNonEmptyWallets">
    <el-main class="column-fullheight">
      <el-row class="card_margin-bottom">
        <el-col :span="16">
          <dashboard-portfolio
            :price="portfolioPrice"
            :chart-data="portfolioHistory"
          />
        </el-col>
        <el-col :span="8">
          <dashboard-donut-chart :portfolio="portfolioPercent" />
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row>
            <el-card :body-style="{ padding: '0' }">
              <el-col :span="10">
                <dashboard-table
                  :portfolio="portfolioList"
                  :dashboard-chart-height="dashboardChartHeight"
                />
              </el-col>
              <el-col :span="1">
                <div class="vertical_devider" />
              </el-col>
              <el-col :span="14">
                <dashboard-chart :dashboard-chart-height="dashboardChartHeight" />
              </el-col>
            </el-card>
          </el-row>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
  <el-container v-else-if="hasNoData">
    <el-main class="column-fullheight card-wrapper flex-direction-row">
      <el-card class="card">
        <p
          style="
            text-align: center;
            font-weight: 600;
          "
        >
          Welcome to D3
        </p>
        <p>There is no data about your current portfolio yet</p>
      </el-card>
    </el-main>
  </el-container>
  <el-container v-else>
    <no-assets-card />
  </el-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import debounce from 'lodash/fp/debounce'

import DashboardPortfolio from '@/components/Dashboard/DashboardPortfolio.vue'
import DashboardDonutChart from '@/components/Dashboard/DashboardDonutChart.vue'
import DashboardTable from '@/components/Dashboard/DashboardTable.vue'
import DashboardChart from '@/components/Dashboard/DashboardChart.vue'
import NoAssetsCard from '@/components/common/NoAssetsCard.vue'

export default {
  name: 'DashboardPage',
  components: {
    DashboardPortfolio,
    DashboardDonutChart,
    DashboardTable,
    DashboardChart,
    NoAssetsCard
  },
  data () {
    return {
      dashboardChartHeight: 0
    }
  },
  computed: {
    ...mapGetters([
      'wallets',
      'portfolioPrice',
      'portfolioPercent',
      'portfolioHistory',
      'portfolioList',
      'isDashboardLoading'
    ]),
    hasNonEmptyWallets () {
      return this.portfolioList.length && (this.portfolioList.length > this.portfolioList.filter(t => t.price === 0).length)
    },
    hasNoData () {
      return !this.hasNonEmptyWallets && this.wallets.length > 0
    }
  },
  created () {
    this.loadDashboard()
    window.addEventListener('resize', debounce(500)(this.getDashboardChartHeight))
    this.getDashboardChartHeight()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.getDashboardChartHeight)
  },
  methods: {
    ...mapActions([
      'loadDashboard'
    ]),
    getDashboardChartHeight (event) {
      this.dashboardChartHeight = document.documentElement.clientHeight - 350
    }
  }
}
</script>

<style scoped>
.card_margin-bottom {
  margin-bottom: 0.5rem;
}
.portfolio_card-padding {
  padding-right: 10px;
}
.vertical_devider {
  top: 1px;
  bottom: 1px;
  width: 2px;
  background: #f5f5f5;
  position: absolute;
}
.card-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}
.card {
  max-width: 600px;
}
</style>
