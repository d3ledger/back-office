<template>
  <el-container v-if="wallets.lenght" v-loading.fullscreen.lock="dashboardLoading">
    <el-main class="column-fullheight">
      <el-row class="card_margin-bottom">
        <el-col :span="16">
          <dashboard-portfolio :price="portfolioPrice" :chartData="portfolioHistory"/>
        </el-col>
        <el-col :span="8">
          <dashboard-pie-chart :portfolio="portfolioPercent"/>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row>
            <el-col :span="8">
              <dashboard-table :portfolio="portfolioList"/>
            </el-col>
            <el-col :span="16">
              <dashboard-chart />
            </el-col>
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
import DashboardPortfolio from '@/components/Dashboard/DashboardPortfolio'
import DashboardPieChart from '@/components/Dashboard/DashboardPieChart'
import DashboardTable from '@/components/Dashboard/DashboardTable'
import DashboardChart from '@/components/Dashboard/DashboardChart'
import NoAssetsCard from '@/components/common/NoAssetsCard'

export default {
  name: 'dashboard-page',
  components: {
    DashboardPortfolio,
    DashboardPieChart,
    DashboardTable,
    DashboardChart,
    NoAssetsCard
  },
  data () {
    return {}
  },
  mounted () {
    this.$store.dispatch('loadDashboard')
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
</style>
