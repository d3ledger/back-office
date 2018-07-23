<template>
  <el-card class="card">
    <el-row>
      <el-col :span="11">
        <div class="list_crypto">
          <div class="list_crypto-content">
            <div v-for="(item, index) in portfolio"
              :key="index"
              class="list_crypto-content-item"
              >
              <span class="list_crypto-content-color"
                :style="{ backgroundColor: `#${item.color}` }"></span>
              <p class="list_crypto-content-asset">{{item.asset}}</p>
            </div>
          </div>
        </div>
      </el-col>
      <el-col class="donut-chart" :span="13">
        <donut-chart :height="200" :data="portfolio"/>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import DonutChart from '@/components/Dashboard/Charts/DonutChart'

export default {
  name: 'dashboard-donut-chart',
  components: {
    DonutChart
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
  height: 14rem;
}

.list_crypto {
  height: 190px;
  width: 100%;
  overflow: hidden;
}

.list_crypto-content {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  padding-right: 17px;
  box-sizing: content-box;
}

.list_crypto-content .list_crypto-content-item {
  margin-bottom: 5px;
}

.list_crypto-content-color {
  width: 1rem;
  height: 1rem;
  margin-right: 2px;
  border-radius: 1rem;
  display: inline-block;
  background-color: #445886;
}

.list_crypto-content-asset {
  float: right;
  width: 40px;
}

.donut-chart {
  margin-top: -0.5rem
}

</style>
