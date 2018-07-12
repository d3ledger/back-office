<template>
  <el-container>
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
</template>

<script>
import { mapGetters } from 'vuex'
import DashboardPortfolio from '@/components/Dashboard/DashboardPortfolio'
import DashboardPieChart from '@/components/Dashboard/DashboardPieChart'
import DashboardTable from '@/components/Dashboard/DashboardTable'
import DashboardChart from '@/components/Dashboard/DashboardChart'

export default {
  name: 'dashboard-page',
  components: {
    DashboardPortfolio,
    DashboardPieChart,
    DashboardTable,
    DashboardChart
  },
  data () {
    return {}
  },
  mounted () {
    this.$store.dispatch('loadDashboard')
  },
  computed: {
    ...mapGetters([
      'portfolioPrice',
      'portfolioPercent',
      'portfolioHistory',
      'portfolioList'
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
