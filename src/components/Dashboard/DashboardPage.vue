<template>
  <el-container v-if="isDashboardLoading" v-loading.fullscreen="isDashboardLoading" />
  <el-container v-else-if="hasNonEmptyWallets">
    <el-main class="column-fullheight">
      <el-row class="card_margin-bottom">
        <el-col :span="16">
          <dashboard-portfolio :price="portfolioPrice" :chartData="portfolioHistory"/>
        </el-col>
        <el-col :span="8">
          <dashboard-donut-chart :portfolio="portfolioPercent"/>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row>
            <el-card :body-style="{ padding: '0' }">
              <el-col :span="10">
                <dashboard-table :portfolio="portfolioList" :dashboardChartHeight="dashboardChartHeight"/>
              </el-col>
              <el-col :span="1">
                <div class="vertical_devider"></div>
              </el-col>
              <el-col :span="14">
                <dashboard-chart :dashboardChartHeight="dashboardChartHeight"/>
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
        There is no data about current portfolio. Please, check your internet connection or report to administrator.
      </el-card>
    </el-main>
  </el-container>
  <el-container v-else>
    <no-assets-card />
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { lazyComponent } from '@router'
import debounce from 'lodash/fp/debounce'

export default {
  name: 'dashboard-page',
  components: {
    DashboardPortfolio: lazyComponent('Dashboard/DashboardPortfolio'),
    DashboardDonutChart: lazyComponent('Dashboard/DashboardDonutChart'),
    DashboardTable: lazyComponent('Dashboard/DashboardTable'),
    DashboardChart: lazyComponent('Dashboard/DashboardChart'),
    NoAssetsCard: lazyComponent('common/NoAssetsCard')
  },
  data () {
    return {
      dashboardChartHeight: 0
    }
  },
  created () {
    this.$store.dispatch('loadDashboard')
    window.addEventListener('resize', debounce(500)(this.getDashboardChartHeight))
    this.getDashboardChartHeight()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.getDashboardChartHeight)
  },
  methods: {
    getDashboardChartHeight (event) {
      this.dashboardChartHeight = document.documentElement.clientHeight - 350
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
  }
}
</script>

<style scoped>
.card_margin-bottom {
  margin-bottom: 20px;
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
  margin-left: 10px;
  margin-right: 10px;
}
</style>
