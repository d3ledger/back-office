<template>
  <el-row class="portfolio_left">
    <el-col class="portfolio_card-padding" :span="9">
        <el-card class="card">
          <div slot="header">
            <el-row>
              <el-col :span="22">
                <div>My Portfolio <el-tag class="portfolio_filter" size="mini" type="info">Today</el-tag></div>
              </el-col>
            </el-row>
          </div>
          <div class="portfolio_current-price">
            <p class="portfolio_current-price_value" justify="center">{{ price.value | formatNumberLong }} {{ currencySymbol }}</p>
          </div>
          <div class="portfolio_diff-price">
            <p :class="[price.diff > 0 ? 'uptrend' : 'downtrend']">{{ price | formatNumberPercentDiff }}</p>
          </div>
        </el-card>
    </el-col>
    <el-col :span="15">
        <el-card class="card" :body-style="{ padding: 0 }">
          <div slot="header">
            Market
          </div>
          <div>
            <line-chart-portfolio chart-type="portfolio" :data="chartData"/>
          </div>
        </el-card>
    </el-col>
  </el-row>
</template>

<script>
import LineChartPortfolio from '@/components/Dashboard/Charts/LineChartPortfolio'
import numberFormat from '@/components/mixins/numberFormat'
import currencySymbol from '@/components/mixins/currencySymbol'

export default {
  name: 'dashboard-portfolio',
  components: {
    LineChartPortfolio
  },
  mixins: [
    numberFormat,
    currencySymbol
  ],
  props: {
    price: {
      type: Object,
      required: true
    },
    chartData: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
.portfolio_left {
  margin-right: 20px;
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
.portfolio_diff-price .uptrend {
  color: #06b023;
}

.portfolio_diff-price .downtrend {
  color: #ff1339;
}
</style>
