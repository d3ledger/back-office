<template>
  <el-row class="portfolio_left">
    <el-card class="card" :body-style="{ padding: 0 }">
      <el-col class="portfolio_card-padding" :span="9">
        <div class="portfolio_header">
          <p class="portfolio_header-title">My Portfolio</p>
        </div>
        <div class="portfolio_current-price">
          <el-tooltip :content="`current price: ${formatNumberLongMethod(price.value)} ${currencySymbol}`" placement="top-start">
            <p class="portfolio_current-price_value" justify="center">{{ price.value | formatNumberLong }} {{ currencySymbol }}</p>
          </el-tooltip>
        </div>
        <div class="portfolio_diff-price">
          <el-tooltip :content="`${getDiffMessage()}: ${formatNumberLongMethod(price.diff)} ${currencySymbol}`" placement="top-start">
            <p :class="classTrend(price.diff)">
              {{ price.diff | formatNumberShort }} {{ currencySymbol }} ({{price.percent | formatPercent }})
            </p>
          </el-tooltip>
        </div>
      </el-col>
      <el-col :span="1">
        <div class="vertical_devider"></div>
      </el-col>
      <el-col :span="15">
        <div class="chart_header">
          <div class="chart_header-name">Portfolio history</div>
          <div class="chart_header-filter">
            <div
              v-for="(value, index) in daysLabels"
              :key="index"
              :class="[portfolioFilter !== value ? 'chart_time-filter' : 'chart_time-filter selected']"
              @click="selectLabel(value)"
            >
              <p class="chart_time-filter_value">{{ value }}</p>
            </div>
          </div>
        </div>
        <div class="chart_header-divider"></div>
        <line-chart-portfolio :data="chartData" :filter="portfolioFilter" v-loading="portfolioHistoryIsLoading" />
      </el-col>
    </el-card>
  </el-row>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { lazyComponent } from '@router'
import numberFormat from '@/components/mixins/numberFormat'
import currencySymbol from '@/components/mixins/currencySymbol'
import dateFormat from '@/components/mixins/dateFormat'

export default {
  name: 'dashboard-portfolio',
  components: {
    LineChartPortfolio: lazyComponent('Dashboard/Charts/LineChartPortfolio')
  },
  mixins: [
    numberFormat,
    currencySymbol,
    dateFormat
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
      daysLabels: ['1H', '1D', '1W', '1M', '1Y'],
      isLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'portfolioFilter',
      'portfolioHistoryIsLoading'
    ]),
    getDiffMessage () {
      switch (this.portfolioFilter) {
        case '1H': return 'Last minute change'
        case '1D': return 'Last hour change'
        case '1W':
        case '1M':
        case '1Y': return 'Last day change'
        default: return 'Difference from the last period'
      }
    }

  },
  methods: {
    ...mapActions([
      'getPortfolioHistory'
    ]),

    classTrend (value) {
      let className = 'neutraltrend'
      if (value > 0) className = 'uptrend'
      if (value < 0) className = 'downtrend'
      return className
    },

    selectLabel (label) {
      this.getPortfolioHistory({ filter: label })
    },

    formatNumberLongMethod (value) {
      return numberFormat.filters.formatNumberLong(value)
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
  justify-content: space-between
}
.chart_header-name {
  padding-left: 1rem;
  display: flex;
  align-items: center;
}
.chart_header-filter {
  display: flex;
}
.chart_time-filter {
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
