<template>
  <el-container v-if="wallets.length || dashboardLoading" v-loading.fullscreen.lock="dashboardLoading">
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
              <el-col :span="8">
                <dashboard-table :portfolio="portfolioList" :dashboardChartHeight="dashboardChartHeight"/>
              </el-col>
              <el-col :span="1">
                <div class="vertical_devider"></div>
              </el-col>
              <el-col :span="16">
                <dashboard-chart :dashboardChartHeight="dashboardChartHeight"/>
              </el-col>
            </el-card>
          </el-row>
        </el-col>
      </el-row>
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
  mounted () {
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
      'dashboardLoading'
    ])
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
.column-fullheight {
  height: 10%;
}
</style>
