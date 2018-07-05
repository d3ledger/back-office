<template>
  <div>
    <div class="column-fullheight" style="padding: 20px;">
      <!-- <div style="display: flex; flex-direction: row; justify-content: space-between; margin-bottom: 20px;">
        <img src="@/assets/portfolio.png" style="display: block; width: 61%; height: 100%;"/>
        <img src="@/assets/structure.png" style="display: block; width: 35%; height: 100%;"/>
      </div>
      <img src="@/assets/card.png" style="display: block; width: 100%; margin-bottom: 20px"/> -->
      <el-row class="card_margin-bottom">
        <el-col :span="16">
          <dashboard-portfolio :price="portfolioPrice"/>
        </el-col>
        <el-col :span="8">
          <dashboard-pie-chart :wallets="wallets" :portfolio="portfolioPercent"/>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10" class="portfolio_card-padding">
          <dashboard-table/>
        </el-col>
        <el-col :span="14">
          <dashboard-chart/>
        </el-col>
      </el-row>
    </div>
  </div>
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
    return {
    }
  },
  mounted () {
    this.$store.dispatch('getMultuplePrice')
  },
  computed: {
    ...mapGetters([
      'wallets',
      'portfolioPrice',
      'portfolioPercent'
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
