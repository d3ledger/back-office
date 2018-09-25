<template>
  <el-row class="portfolio_left">
    <el-card class="card" :body-style="{ padding: 0 }">
      <el-col class="portfolio_card-padding" :span="9">
        <div class="portfolio_header">
          <p class="portfolio_header-title">My Portfolio</p>
        </div>
        <div class="portfolio_current-price">
          <p class="portfolio_current-price_value" justify="center">{{ price.value | formatNumberLong }} {{ currencySymbol }}</p>
        </div>
        <div class="portfolio_diff-price">
          <p :class="classTrend(price.diff)">
            {{ price.diff | formatNumberShort }} {{ currencySymbol }} ({{price.percent | formatPercent }})
          </p>
        </div>
      </el-col>
      <el-col :span="1">
        <div class="vertical_devider"></div>
      </el-col>
      <el-col :span="15">
        <div class="chart_header">
          <div
            v-for="(value, index) in daysLabels"
            :key="index"
            :class="['1W' !== value ? 'chart_time-filter' : 'chart_time-filter selected']"
            >
            <p class="chart_time-filter_value">{{ value }}</p>
          </div>
          <div class="chart_header-divider"></div>
        </div>
        <line-chart-portfolio :data="chartData"/>
      </el-col>
    </el-card>
  </el-row>
</template>

<script>
import { lazyComponent } from '@router'
import numberFormat from '@/components/mixins/numberFormat'
import currencySymbol from '@/components/mixins/currencySymbol'

export default {
  name: 'dashboard-portfolio',
  components: {
    LineChartPortfolio: lazyComponent('Dashboard/Charts/LineChartPortfolio')
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
  },
  data () {
    return {
      daysLabels: ['1H', '1D', '1W', '1M', '1Y']
    }
  },
  methods: {
    classTrend (value) {
      let className = 'neutraltrend'
      if (value > 0) className = 'uptrend'
      if (value < 0) className = 'downtrend'
      return className
    }
  }
}
</script>

<style scoped>
.portfolio_left {
  margin-right: 20px;
}
.card {
  height: 12rem;
}
.portfolio_card-padding {
  padding: 20px;
}
.portfolio_header-title {
  font-size: 0.9rem;
}
.portfolio_header {
  margin-bottom: 2rem;
}
.portfolio_filter {
  text-transform: uppercase;
}
.portfolio_current-price {
  margin-bottom: 2rem;
}
.vertical_devider {
  top: 1px;
  bottom: 1px;
  width: 2px;
  background: #f5f5f5;
  position: absolute;
}
.chart_header {
  font-size: 0.9rem;
  width: 100%;
  display: flex;
  border-bottom: 2px solid #f5f5f5;
}
.chart_time-filter {
  justify-content: center;
  opacity: 0.3;
  padding: 0.5rem;
  cursor: pointer;
}
.chart_time-filter.selected {
  opacity: 1;
  font-weight: 600;
  background-color: #f5f5f5;
  border-bottom: 2px solid #000000;
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
