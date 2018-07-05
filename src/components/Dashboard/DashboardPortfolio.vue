<template>
  <el-row class="portfolio_left">
    <el-col class="portfolio_card-padding" :span="9">
        <el-card class="card">
          <div slot="header">
            <el-row>
              <el-col :span="22">
                <div>My Portfolio <el-tag class="portfolio_filter" size="mini" type="info">Today</el-tag></div>
              </el-col>
              <el-col :span="2">
                <i class="el-icon-more-outline"/>
              </el-col>
            </el-row>
          </div>
          <div class="portfolio_current-price">
            <p class="portfolio_current-price_value" justify="center">{{ price }} ₽</p>
          </div>
          <div>
            <p style="color: green">+ 1003 ₽ (9.4 %)</p>
          </div>
        </el-card>
    </el-col>
    <el-col :span="15">
        <el-card class="card">
          <div slot="header">
            Market
          </div>
          <div>
            <line-chart :height="150" :width="100"/>
          </div>
        </el-card>
    </el-col>
  </el-row>
</template>

<script>
import LineChart from '@/components/Dashboard/Charts/LineChart'

export default {
  name: 'dashboard-portfolio',
  components: {
    LineChart
  },
  props: {
    price: {
      type: Number,
      required: true
    }
  }
}
</script>

<style scoped>
.portfolio_left {
  margin-right: 30px;

}
.portfolio_card-padding {
  padding-right: 10px;
}
.card {
  height: 14rem;
}
.portfolio_filter {
  text-transform: uppercase;
}
.portfolio_current-price {
  margin-bottom: 4rem;
}

.portfolio_current-price_value {
  font-size: 2rem;
  font-weight: bold;
}
</style>
