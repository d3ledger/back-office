<template>
  <el-card class="card">
    <el-row>
      <el-col :span="14">
        <div class="crypto_header">
          <p class="crypto_header-title">Portfolio structure</p>
        </div>
        <div class="list_crypto">
          <div class="list_crypto-content">
            <div v-for="(item, index) in portfolio.slice(0, 6)"
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
      <el-col class="donut-chart" :span="10">
        <donut-chart :data="portfolio"/>
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
  min-width: 80px;
  margin-right: 35px;
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
  min-width: 50px;
}

.donut-chart {
  margin-top: -0.5rem
}

</style>
