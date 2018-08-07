<template>
  <el-card class="card">
    <el-row>
      <el-col :span="13">
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
      <el-col class="donut-chart" :span="11">
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
  width: 110%;
  height: 100%;
  overflow-y: scroll;
  padding-right: 17px;
  box-sizing: content-box;
}

.list_crypto-content .list_crypto-content-item {
  min-width: 50px;
  margin-right: 10px;
  margin-bottom: 10px;
}

.list_crypto-content-color {
  float: left;
  width: 0.6rem;
  height: 0.6rem;
  margin-right: 3px;
  border-radius: 1rem;
  margin-top: 4px;
  background-color: #445886;
}

.list_crypto-content-asset {
  font-size: 0.9rem;
}

.donut-chart {
  margin-top: -0.5rem
}

</style>
