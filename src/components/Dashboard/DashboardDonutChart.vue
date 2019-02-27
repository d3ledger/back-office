<template>
  <el-card class="card">
    <el-row>
      <el-col :span="16">
        <div class="crypto_header">
          <p class="crypto_header-title">Portfolio structure</p>
        </div>
        <div class="list_crypto">
          <div class="list_crypto-content">
            <div v-for="(item, index) in filterPortfolio"
              :key="index"
              class="list_crypto-content-item"
              >
              <span class="list_crypto-content-color"
                :style="{ backgroundColor: `#${item.color}` }">
              </span>
              <p class="list_crypto-content-asset">
                <span class="list_crypto-content-percent">{{ item.percent.toFixed(0) }}% </span>
                <span class="list_crypto-content-token">{{ item.asset }}</span>
              </p>
            </div>
          </div>
        </div>
      </el-col>
      <el-col class="donut-chart" :span="8">
        <donut-chart :data="filterPortfolio"/>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import { lazyComponent } from '@router'

export default {
  name: 'dashboard-donut-chart',
  components: {
    DonutChart: lazyComponent('Dashboard/Charts/DonutChart')
  },
  props: {
    portfolio: {
      type: Array,
      requires: true
    }
  },
  data () {
    return {}
  },
  computed: {
    filterPortfolio () {
      const portfolio = this.portfolio.filter(t => t.percent !== 0)
      const sortedPortfolio = [...portfolio].sort((a, b) => b.percent - a.percent)
      const firstTokens = sortedPortfolio.slice(0, 5)
      const otherTokens = sortedPortfolio.slice(5, sortedPortfolio.length - 1)
      const otherTokensPercent = otherTokens.reduce((t1, t2) => t1 + t2.percent, 0)
      const otherTokensPrice = otherTokens.reduce((t1, t2) => t1.price + t2.price, 0)
      const otherToken = {
        asset: 'Other',
        color: 'C8C8C8',
        percent: otherTokensPercent,
        price: otherTokensPrice
      }
      if (portfolio.length > 5) {
        return [...firstTokens, otherToken]
      } else {
        return [...firstTokens]
      }
    }
  }
}
</script>

<style scoped>
.card {
  height: 12em;
}

.crypto_header {
  margin-bottom: 2rem;
}

.crypto_header-title {
  font-size: 0.9rem;
}

.list_crypto-content {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  box-sizing: content-box;
}

.list_crypto-content .list_crypto-content-item {
  min-width: 90px;
  margin-right: 15px;
  margin-bottom: 15px;
}

.list_crypto-content-color {
  float: left;
  width: 0.6rem;
  height: 0.6rem;
  margin-right: 10px;
  border-radius: 1rem;
  margin-top: 4px;
  background-color: #445886;
}

.list_crypto-content-asset {
  font-size: 0.84rem;
}

.list_crypto-content-percent {
  font-weight: 600;
  min-width: 33px;
  display: inline-block;
}

.donut-chart {
  margin-top: -0.5rem
}

</style>
