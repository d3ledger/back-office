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
      <el-col :span="13">
        <donat-chart style="donat-chart" :height="200" :data="portfolio"/>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import DonatChart from '@/components/Dashboard/Charts/DonatChart'

export default {
  name: 'dashboard-pie-chart',
  components: {
    DonatChart
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
  width: 3.5rem;
  margin-right: 5px;
  margin-bottom: 5px;
}

.list_crypto-content-color {
  width: 1rem;
  height: 1rem;
  border-radius: 1rem;
  display: inline-block;
  background-color: #445886;
}

.list_crypto-content-asset {
  float: right;
}

.donat-chart {
  margin-top: -0.5rem
}

</style>
